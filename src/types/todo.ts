export type Todo = {
  id: number;
  text: string;
  status: "pending" | "working" | "completed";
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  totalTimeMs: number;
};