export interface TUser {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  problems?: Problem[];
  submissions?: Submission[];
  solvedProblems?: ProblemSolved[];
}
