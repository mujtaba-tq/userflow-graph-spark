
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
import { UserData, filterDataByDateRange, formatDateForAxis } from "@/services/userData";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type UserMetric = "totalUsers" | "activeUsers" | "avgDailyUsers";

interface UserChartProps {
  data: UserData[];
  isLoading: boolean;
}

const UserChart = ({ data, isLoading }: UserChartProps) => {
  const [activeMetrics, setActiveMetrics] = useState<UserMetric[]>(["totalUsers", "activeUsers", "avgDailyUsers"]);
  const [filteredData, setFilteredData] = useState<UserData[]>(data);
  
  // Set initial date range (past 30 days by default)
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: thirtyDaysAgo,
    to: today,
  });

  // Process data to add average daily users and apply date filtering
  useEffect(() => {
    if (!data.length) return;

    let filtered = filterDataByDateRange(data, dateRange.from, dateRange.to);
    filtered = formatDateForAxis(filtered, dateRange.from, dateRange.to);
    
    // Add 7-day rolling average for daily users
    const processedData = filtered.map((item, index, array) => {
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
    
    setFilteredData(processedData);
  }, [data, dateRange]);

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
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                        {format(dateRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "PPP")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({
                        from: range.from,
                        to: range.to,
                      });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => toggleMetric("totalUsers")}
              className={cn(
                "filter-button px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeMetrics.includes("totalUsers") ? "active" : "bg-white border"
              )}
            >
              Total Users
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
              <linearGradient id="colorTotalUsers" x1="0" y1="0" x2="0" y2="1">
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
            {activeMetrics.includes("totalUsers") && (
              <Area
                type="monotone"
                dataKey="totalUsers"
                name="Total Users"
                stroke="#F97316"
                fillOpacity={1}
                fill="url(#colorTotalUsers)"
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
