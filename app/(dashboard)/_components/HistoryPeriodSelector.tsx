import { GetHistoryPeriods } from "@/app/api/history-period/route";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Period, Timeframe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface Props {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;
}

const HistoryPeriodSelector = ({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}: Props) => {
  const historyPeriods = useQuery<GetHistoryPeriods>({
    queryKey: ["history-periods"],
    queryFn: async () => {
      const response = await fetch("/api/history-period");
      if (!response.ok) {
        throw new Error("Failed to fetch history periods");
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as Timeframe)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>

      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper
          isLoading={historyPeriods.isFetching}
          fullWidth={false}
        >
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods.data || []}
          />
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper
            isLoading={historyPeriods.isFetching}
            fullWidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
};
export default HistoryPeriodSelector;

function YearSelector({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetHistoryPeriods;
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) =>
        setPeriod({
          month: period.month,
          year: parseInt(value),
        })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MonthSelector({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) =>
        setPeriod({
          month: parseInt(value),
          year: period.year,
        })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
          const monthStr = new Date(period.year, month, 1).toLocaleString(
            "default",
            {
              month: "long",
            }
          );
          return (
            <SelectItem key={month} value={month.toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
