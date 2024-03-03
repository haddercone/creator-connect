import {z} from "zod"

export const QuestionSchema = z.object({
    recipientId : z.string(),
    question: z.string().trim().min(10, {
        message : "question must be at least 10 characters long",
    }).max(200, {
        message : "question cannot be longer than 200 characters",
    }),
})

export type Question = z.infer<typeof QuestionSchema>

export const AnswerSchema = z.object({
    id: z.string().optional(),
    questionId : z.string(),
    answer: z.string().trim()
})

export type Answer = z.infer<typeof AnswerSchema>

export type User = {
    id?: string;
    username: string;
    name: string;
    email: string;
    profilePic: string;
};

export type CreatorsProp = Required<Omit<User, "email">>[];
export type UserProps = Partial<User> | null;
