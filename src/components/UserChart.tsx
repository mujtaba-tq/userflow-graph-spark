
import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { UserData } from "@/services/userData";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

type UserMetric = "newUsers" | "activeUsers" | "avgDailyUsers";
type TimeFilter = "all" | "year" | "month";

interface UserChartProps {
  data: UserData[];
  isLoading: boolean;
}

const UserChart = ({ data, isLoading }: UserChartProps) => {
  const [activeMetrics, setActiveMetrics] = useState<UserMetric[]>(["newUsers", "activeUsers", "avgDailyUsers"]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [filteredData, setFilteredData] = useState<UserData[]>(data);

  // Process data to add average daily users
  const processData = (data: UserData[]) => {
    return data.map((item, index, array) => {
      // Calculate average active users for a 7-day rolling window
      const startIdx = Math.max(0, index - 6);
      const window = array.slice(startIdx, index + 1);
      const avgDailyUsers = Math.round(
        window.reduce((sum, item) => sum + item.activeUsers, 0) / window.length
      );
      
      return {
        ...item,
        avgDailyUsers
      };
    });
  };

  // Apply time filters
  useEffect(() => {
    if (!data.length) return;

    const now = new Date();
    let filtered;

    switch (timeFilter) {
      case "month":
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        filtered = data.filter(item => {
          const date = new Date(item.date);
          return date >= oneMonthAgo;
        });
        break;
      case "year":
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        filtered = data.filter(item => {
          const date = new Date(item.date);
          return date >= oneYearAgo;
        });
        break;
      default:
        filtered = [...data];
    }

    setFilteredData(processData(filtered));
  }, [data, timeFilter]);

  const toggleMetric = (metric: UserMetric) => {
    setActiveMetrics((prev) => {
      // Don't allow deselecting the last metric
      if (prev.includes(metric) && prev.length === 1) {
        return prev;
      }
      return prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric];
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 w-full animate-pulse">
        <div className="h-8 bg-muted rounded-md w-1/3"></div>
        <div className="h-[300px] bg-muted rounded-lg w-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-medium text-foreground">User Analytics</h2>
        
        <div className="flex flex-wrap gap-3 items-center">
          <Select
            value={timeFilter}
            onValueChange={(value) => setTimeFilter(value as TimeFilter)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex space-x-3">
            <button
              onClick={() => toggleMetric("newUsers")}
              className={cn(
                "filter-button px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeMetrics.includes("newUsers") ? "active" : "bg-white border"
              )}
            >
              New Users
            </button>
            <button
              onClick={() => toggleMetric("activeUsers")}
              className={cn(
                "filter-button px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeMetrics.includes("activeUsers") ? "active" : "bg-white border"
              )}
            >
              Active Users
            </button>
            <button
              onClick={() => toggleMetric("avgDailyUsers")}
              className={cn(
                "filter-button px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeMetrics.includes("avgDailyUsers") ? "active" : "bg-white border"
              )}
            >
              Avg Daily
            </button>
          </div>
        </div>
      </div>

      <div className="chart-container h-[300px] w-full bg-white rounded-xl p-4 border shadow-sm animate-scale-in">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorActiveUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38B2AC" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#38B2AC" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAvgDailyUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#718096', fontSize: 12 }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#718096', fontSize: 12 }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
              }}
              labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
              cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: '8px' }}
            />
            {activeMetrics.includes("newUsers") && (
              <Area
                type="monotone"
                dataKey="newUsers"
                name="New Users"
                stroke="#F97316"
                fillOpacity={1}
                fill="url(#colorNewUsers)"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1000}
                isAnimationActive={true}
              />
            )}
            {activeMetrics.includes("activeUsers") && (
              <Area
                type="monotone"
                dataKey="activeUsers"
                name="Active Users"
                stroke="#38B2AC"
                fillOpacity={1}
                fill="url(#colorActiveUsers)"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1000}
                isAnimationActive={true}
              />
            )}
            {activeMetrics.includes("avgDailyUsers") && (
              <Area
                type="monotone"
                dataKey="avgDailyUsers"
                name="Avg Daily Users"
                stroke="#8B5CF6"
                fillOpacity={1}
                fill="url(#colorAvgDailyUsers)"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1000}
                isAnimationActive={true}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserChart;
