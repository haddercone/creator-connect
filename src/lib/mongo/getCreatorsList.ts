import prisma from "@/server/db/PrismaClientSingleton";

export async function getCreatorsList() {
    try {
        const response = await prisma.user.findMany({
            select: {
                name: true,
                username: true,
                profilePic: true,
                id: true
            }
        })
        return response;
    } catch (error) {
        console.log("Error getting creators list: ", error);
        return {
            error: "Error getting creators list"
        }
    }
}