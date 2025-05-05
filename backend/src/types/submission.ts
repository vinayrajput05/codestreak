export interface TSubmission {
  id: string;
  userId: string;
  problemId: string;
  sourceCode: object;
  langugae: string;
  stdin?: string;
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  memory?: string;
  time?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  problem?: Problem;
  testCases?: TestCaseResult[];
}
