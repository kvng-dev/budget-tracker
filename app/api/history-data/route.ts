import prisma from "@/lib/prisma";
import { Period, Timeframe } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { time } from "console";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";

const getHistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11),
  year: z.coerce.number().min(2000).max(3000),
});
export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  const queryParams = getHistoryDataSchema.safeParse({
    timeframe,
    month,
    year,
  });
  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }

  const data = await getHistoryData(user.id, queryParams.data.timeframe, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });

  return Response.json(data);
}
export type GetHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

async function getHistoryData(
  userId: string,
  timeframe: Timeframe,
  period: Period
) {
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(userId, period.year);
    case "month":
      return await getMonthHistoryData(userId, period.month, period.year);
  }
}

type HistoryData = {
  expense: number;
  income: number;
  month: number;
  year: number;
  day?: number;
};
async function getYearHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      month: "asc",
    },
  });

  if (!result || result.length === 0) {
    return [];
  }

  const historyData: HistoryData[] = [];

  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;
    const monthData = result.find((item) => item.month === i);

    if (monthData) {
      expense = monthData._sum.expense || 0;
      income = monthData._sum.income || 0;
    }

    historyData.push({
      expense,
      income,
      month: i,
      year,
    });
  }

  return historyData;
}

async function getMonthHistoryData(
  userId: string,
  month: number,
  year: number
) {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      month,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      day: "asc",
    },
  });

  if (!result || result.length === 0) {
    return [];
  }

  const historyData: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));

  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;
    const dayData = result.find((item) => item.day === i);

    if (dayData) {
      expense = dayData._sum.expense || 0;
      income = dayData._sum.income || 0;
    }

    historyData.push({
      expense,
      income,
      month,
      year,
      day: i,
    });
  }

  return historyData;
}
