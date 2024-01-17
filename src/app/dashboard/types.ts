import { Answer } from "@/lib/types";

export type Question =  {
  id?: string,
  questionText?: string,
  isAnswered?: boolean,
  isDeleted?: boolean,
  recipientId?: string,
  answer?: Answer | null,
};