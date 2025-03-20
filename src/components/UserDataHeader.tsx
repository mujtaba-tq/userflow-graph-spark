
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
    if (!data.length) return { totalUsers: 0, totalActiveUsers: 0, avgDailyUsers: 0, dailyChange: "0%" };
    
    const totalUsers = data.length > 0 ? data[data.length - 1].totalUsers : 0;
    const totalActiveUsers = data.reduce((acc, day) => acc + day.activeUsers, 0);
    const avgDailyUsers = Math.round(totalActiveUsers / data.length);
    
    // Calculate day-over-day change for total users (last day vs previous day)
    const lastDay = data[data.length - 1];
    const previousDay = data.length > 1 ? data[data.length - 2] : { totalUsers: lastDay.totalUsers };
    
    const dailyChangeRate = ((lastDay.totalUsers - previousDay.totalUsers) / previousDay.totalUsers) * 100;
    const dailyChange = `${dailyChangeRate.toFixed(1)}%`;
    
    return { 
      totalUsers, 
      totalActiveUsers, 
      avgDailyUsers, 
      dailyChange, 
      isDailyPositive: dailyChangeRate > 0
    };
  };
  
  const stats = calculateStats();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
      <StatCard
        title="Total Users"
        value={isLoading ? "-" : stats.totalUsers.toLocaleString()}
        change={stats.dailyChange}
        isPositive={stats.isDailyPositive}
        isLoading={isLoading}
        icon={<Users size={18} />}
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
        icon={<UserPlus size={18} />}
      />
    </div>
  );
};

export default UserDataHeader;
