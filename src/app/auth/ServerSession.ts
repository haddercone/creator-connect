import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

export const ServerSession = async () => await getServerSession(authOptions);
