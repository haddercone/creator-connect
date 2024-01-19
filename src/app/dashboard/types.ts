import { Answer } from "@/lib/types";

export type Question =  {
  id?: string,
  questionText?: string,
  isAnswered?: boolean,
  isDeleted?: boolean,
  createdAt?: Date,
  recipientId?: string,
  answer?: Answer | null,
};