import { Prisma } from '../generated/prisma';

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
  examples: Prisma.JsonValue;
  testcases: Prisma.JsonValue;
  codeSnippets: Prisma.JsonValue;
  referenceSolutions: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  submissions: Submission[];
  solvedBy: ProblemSolved[];
}
