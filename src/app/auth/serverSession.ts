import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

export const serverSession = async () => await getServerSession(authOptions);
