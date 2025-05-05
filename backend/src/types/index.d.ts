import { TUser } from './user';
import { TProblem } from './problem';
import { TSubmission } from './submission';
import { TProblemSolved } from './problem_solved';
import { TTestCaseResult } from './test_case_result';
import { Request } from 'express';

declare global {
  type User = TUser;
  type Problem = TProblem;
  type Submission = TSubmission;
  type ProblemSolved = TProblemSolved;
  type TestCaseResult = TTestCaseResult;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: Pick<User>;
  }
}

export {};
