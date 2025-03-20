
import React from "react";
import { UserData } from "@/services/userData";
import StatCard from "./StatCard";
import { Users, UserPlus, Activity } from "lucide-react";

interface UserDataHeaderProps {
  data: UserData[];
  isLoading: boolean;
}

const UserDataHeader: React.FC<UserDataHeaderProps> = ({ data, isLoading }) => {
  // Calculate summary data
  const calculateStats = () => {
    if (!data.length) return { totalNewUsers: 0, totalActiveUsers: 0, avgDailyUsers: 0, dailyChange: "0%" };
    
    const totalNewUsers = data.reduce((acc, day) => acc + day.newUsers, 0);
    const totalActiveUsers = data.reduce((acc, day) => acc + day.activeUsers, 0);
    const avgDailyUsers = Math.round(totalActiveUsers / data.length);
    
    // Calculate day-over-day change for total new users (last day vs previous day)
    const lastDay = data[data.length - 1];
    const previousDay = data.length > 1 ? data[data.length - 2] : { newUsers: lastDay.newUsers };
    
    const dailyChangeRate = ((lastDay.newUsers - previousDay.newUsers) / previousDay.newUsers) * 100;
    const dailyChange = `${dailyChangeRate.toFixed(1)}%`;
    
    // Calculate growth compared to previous period (for backward compatibility)
    const halfwayIndex = Math.floor(data.length / 2);
    const recentData = data.slice(halfwayIndex);
    const previousData = data.slice(0, halfwayIndex);
    
    const recentNewUsers = recentData.reduce((acc, day) => acc + day.newUsers, 0);
    const previousNewUsers = previousData.reduce((acc, day) => acc + day.newUsers, 0);
    
    const growthRate = ((recentNewUsers - previousNewUsers) / previousNewUsers) * 100;
    const growth = `${growthRate.toFixed(1)}%`;
    
    return { 
      totalNewUsers, 
      totalActiveUsers, 
      avgDailyUsers, 
      dailyChange, 
      isDailyPositive: dailyChangeRate > 0,
      growth, 
      isPositive: growthRate > 0 
    };
  };
  
  const stats = calculateStats();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
      <StatCard
        title="Total New Users"
        value={isLoading ? "-" : stats.totalNewUsers.toLocaleString()}
        change={stats.dailyChange}
        isPositive={stats.isDailyPositive}
        isLoading={isLoading}
        icon={<UserPlus size={18} />}
      />
      <StatCard
        title="Total Active Users"
        value={isLoading ? "-" : stats.totalActiveUsers.toLocaleString()}
        isLoading={isLoading}
        icon={<Activity size={18} />}
      />
      <StatCard
        title="Average Daily Users"
        value={isLoading ? "-" : stats.avgDailyUsers.toLocaleString()}
        isLoading={isLoading}
        icon={<Users size={18} />}
      />
    </div>
  );
};

export default UserDataHeader;
