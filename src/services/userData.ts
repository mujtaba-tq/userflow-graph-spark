
// Simulated user data service
import { addDays, format, subDays } from "date-fns";

export type UserData = {
  date: string;
  newUsers: number;
  activeUsers: number;
  rawDate?: Date; // For filtering purposes
};

// Generate 30 days of simulated data
export const generateUserData = (days: number = 30): UserData[] => {
  const today = new Date();
  const data: UserData[] = [];
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(today, i);
    const formattedDate = format(date, "MMM dd");
    
    // Base values with some randomness
    const baseNewUsers = 80 + Math.floor(Math.random() * 120);
    const weekendEffect = [0, 6].includes(date.getDay()) ? 0.7 : 1; // Less users on weekends
    const trendEffect = 1 + (i / days) * 0.5; // Increasing trend over time
    
    const newUsers = Math.floor(baseNewUsers * weekendEffect * trendEffect);
    const activeUsers = Math.floor(newUsers * (2.5 + Math.random()));
    
    data.push({
      date: formattedDate,
      newUsers,
      activeUsers,
      rawDate: new Date(date) // Store the actual date for filtering
    });
  }
  
  return data;
};

export const getUserData = (): Promise<UserData[]> => {
  // Simulating API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateUserData());
    }, 800);
  });
};
