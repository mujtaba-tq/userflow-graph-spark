
import React, { useState, useEffect } from "react";
import { getUserData, UserData } from "@/services/userData";
import UserChart from "@/components/UserChart";
import UserDataHeader from "@/components/UserDataHeader";
import { motion } from "@/lib/motion";

const Index = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
            <span className="text-primary font-normal">User</span> Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor your user growth and activity over time
          </p>
        </motion.div>

        <UserDataHeader data={userData} isLoading={isLoading} />
        
        <div className="glass-card rounded-xl p-6 mb-8 animate-fade-in">
          <UserChart data={userData} isLoading={isLoading} />
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-sm text-muted-foreground pt-4"
        >
          Data is refreshed every 24 hours
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
