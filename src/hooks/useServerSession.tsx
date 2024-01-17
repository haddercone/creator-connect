import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export const useServerSession = async () => await getServerSession(authOptions);
