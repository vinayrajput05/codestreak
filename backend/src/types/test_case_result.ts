export interface TTestCaseResult {
  id: string;
  submissionId: string;
  testCase: number;
  passed: boolean;
  expected: string;
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  memory?: string;
  time?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  submission?: Submission;
}
