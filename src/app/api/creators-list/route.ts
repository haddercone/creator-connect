import prisma from "@/server/db/PrismaClientSingleton";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const result = await prisma.user.findMany({
            select: {
                username:true,
                name:true,
                profilePic: true,
            }
        })
        return NextResponse.json(result);
    } catch (error) {
        console.log("Error fetching creators details", error);
    }
}