import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { Course, Purchase } from "@prisma/client";
import { auth } from "@/lib/auth";
import { SearchContent } from "./_components/search-content";

type CourseWithDetails = Course & {
    chapters: { id: string }[];
    purchases: Purchase[];
    progress: number;
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return redirect("/");
    }

    // Get user info for filtering
    const { user } = await auth();
    
    // Build where clause for course filtering
    const whereClause: any = {
        isPublished: true,
    };

    // Apply grade/division filtering for students only
    if (user && user.role === "USER" && user.grade) {
        const intermediateGrades = ["الاول الاعدادي", "الثاني الاعدادي", "الثالث الاعدادي"];
        const isIntermediateGrade = intermediateGrades.includes(user.grade);

        whereClause.OR = [
            { grade: "الكل" }, // All grades
            { grade: null }, // Backward compatibility
            ...(isIntermediateGrade ? [
                { grade: user.grade }
            ] : []),
            ...(!isIntermediateGrade && user.division ? [
                {
                    AND: [
                        { grade: user.grade },
                        { divisions: { has: user.division } }
                    ]
                }
            ] : []),
        ];
    }

    const courses = await db.course.findMany({
        where: whereClause,
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    image: true,
                }
            },
            chapters: {
                where: {
                    isPublished: true,
                },
                select: {
                    id: true,
                }
            },
            purchases: {
                where: {
                    userId: session.user.id,
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const coursesWithProgress = await Promise.all(
        courses.map(async (course) => {
            const totalChapters = course.chapters.length;
            const completedChapters = await db.userProgress.count({
                where: {
                    userId: session.user.id,
                    chapterId: {
                        in: course.chapters.map(chapter => chapter.id)
                    },
                    isCompleted: true
                }
            });

            const progress = totalChapters > 0 
                ? (completedChapters / totalChapters) * 100 
                : 0;

            return {
                ...course,
                progress,
                user: course.user
            } as CourseWithDetails;
        })
    );

    return (
        <SearchContent
            initialCourses={coursesWithProgress}
            curriculum={user?.curriculum}
            userGrade={user?.grade}
            userDivision={user?.division}
        />
    );
}