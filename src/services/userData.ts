// Simulated user data service
import { addDays, format, subDays, isSameMonth, differenceInMonths } from "date-fns";

export type UserData = {
  date: string;
  newUsers: number;
  activeUsers: number;
  totalUsers: number; // Added total users
  rawDate?: Date; // For filtering purposes
  formattedDate?: string; // For dynamic axis formatting
};

// Generate 30 days of simulated data
export const generateUserData = (days: number = 30): UserData[] => {
  const today = new Date();
  const data: UserData[] = [];
  let cumulativeUsers = 10000; // Starting with some base users
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(today, i);
    const formattedDate = format(date, "MMM dd");
    
    // Base values with some randomness
    const baseNewUsers = 80 + Math.floor(Math.random() * 120);
    const weekendEffect = [0, 6].includes(date.getDay()) ? 0.7 : 1; // Less users on weekends
    const trendEffect = 1 + (i / days) * 0.5; // Increasing trend over time
    
    const newUsers = Math.floor(baseNewUsers * weekendEffect * trendEffect);
    const activeUsers = Math.floor(newUsers * (2.5 + Math.random()));
    
    // Add new users to the cumulative total
    cumulativeUsers += newUsers;
    
    data.push({
      date: formattedDate,
      newUsers,
      activeUsers,
      totalUsers: cumulativeUsers,
      rawDate: new Date(date), // Store the actual date for filtering
      formattedDate: formattedDate // For axis formatting
    });
  }
  
  return data;
};

export const getUserData = (): Promise<UserData[]> => {
  // Simulating API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateUserData(180)); // Generate 6 months of data for better date range testing
    }, 800);
  });
};

// Helper function to format dates based on range
export const formatDateForAxis = (data: UserData[], startDate: Date, endDate: Date): UserData[] => {
  const monthsDiff = differenceInMonths(endDate, startDate);
  
  return data.map(item => {
    if (!item.rawDate) return item;
    
    // If range is more than 2 months, use monthly format
    if (monthsDiff > 2) {
      return {
        ...item,
        date: format(item.rawDate, "MMM yyyy")
      };
    }
    
    // Otherwise use daily format
    return {
      ...item,
      date: format(item.rawDate, "MMM dd")
    };
  });
};

// Filter data by date range
export const filterDataByDateRange = (data: UserData[], startDate: Date, endDate: Date): UserData[] => {
  return data.filter(item => {
    if (!item.rawDate) return false;
    const itemDate = new Date(item.rawDate);
    return itemDate >= startDate && itemDate <= endDate;
  });
};
