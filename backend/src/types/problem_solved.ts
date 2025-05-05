export interface TProblemSolved {
  id: string;
  userId: string;
  problemId: string;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  problem?: Problem;
}
