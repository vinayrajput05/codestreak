import { NextFunction, Request, Response } from 'express';
import Db from '../libs/db';
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from '../libs/judge0.lib';
import ApiError from '../utils/api-error';
import ApiResponse from '../utils/api-response';

export const createProblem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  //  get all data from request body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  try {
    //  check user role is admin or not
    if (req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to create a problem');
    }

    //  loop through each referance solution for diffrent language
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      //  get judge0 language id
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
        return;
      }

      //  prepare judge0 submission for all testcases
      const submissions = testcases.map(
        ({ input, output }: { input: string; output: string }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }),
      );

      //  submit all testcases to judge0 and get tokens
      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res: any) => res.token);

      //  poll judge0 for all testcases
      const results = await pollBatchResults(tokens);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log('Result----', result);

        if (result.status.id !== 3) {
          throw new ApiError(
            400,
            `Testcase ${i + 1} failed for language ${language}`,
          );
        }
      }
    }
    //  save problem in database
    const newProblem = await Db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        constraints,
        codeSnippets,
        examples,
        referenceSolutions,
        testcases,
        userId: req.user.id,
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, newProblem, 'Problem created successfully'));
  } catch (error) {
    console.log('controller createProblem', error);

    next(error);
  }
};

export const getAllProblems = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const problems = await Db.problem.findMany({});
    if (!problems) {
      throw new ApiError(404, 'No problems found');
    }
    res
      .status(200)
      .json(new ApiResponse(200, problems, 'Problems fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const getProblemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;
  try {
    const problem = await Db.problem.findUnique({
      where: { id },
    });
    if (!problem) {
      throw new ApiError(404, 'Problem not found');
    }
    res
      .status(200)
      .json(new ApiResponse(200, problem, 'Problem fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  const problemId = req.params.id;

  try {
    if (req.user.role !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to update a problem');
    }

    const problem = await Db.problem.findUnique({
      where: { id: problemId },
    });
    if (!problem) {
      throw new ApiError(404, 'Problem not found');
    }

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        throw new ApiError(400, `Language ${language} is not supported`);
      }

      const submissions = testcases.map(
        ({ input, output }: { input: string; output: string }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }),
      );

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res: any) => res.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        if (results[i].status.id !== 3) {
          throw new ApiError(
            400,
            `Testcase ${i + 1} failed for language ${language}`,
          );
        }
      }
    }

    const updatedProblem = await Db.problem.update({
      where: { id: problemId },
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedProblem, 'Problem updated successfully'),
      );
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = req.params;

  try {
    const problem = await Db.problem.findUnique({ where: { id } });
    if (!problem) {
      throw new ApiError(404, 'Problem not found');
    }

    await Db.problem.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully',
    });
  } catch (error) {
    console.log('deleteProblem error', error);

    next(error);
  }
};

export const getAllProblemsSolvedyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {};
