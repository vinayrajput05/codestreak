interface Attribute {
  id: string;
  problemId: string;
  type: 'EXAMPLE' | 'TESTCASE' | 'CODE_SNIPPET' | 'REFERENCE_SOLUTION';
  langugae?: string;
  input?: string;
  output?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TProblem {
  id: string;
  title: string;
  description?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags?: string[];
  userId: string;
  constraints: string;
  hints?: string;
  editorial?: string;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  attributes: Attribute[];
  submissions: Submission[];
  solvedBy: ProblemSolved[];
}
