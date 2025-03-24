"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  const [skipClicks, setSkipClicks] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Auto-redirect after 8 seconds
    const redirectTimer = setTimeout(() => {
      router.push("/dashboard");
    }, 8000);

    // Progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.25; // 100% / 8 seconds * 100ms
      });
    }, 100);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(interval);
    };
  }, [router]);

  const handleSkip = () => {
    setSkipClicks(skipClicks + 1);
    if (skipClicks >= 1) {
      router.push("/dashboard");
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950"
      onClick={handleSkip}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-primary mb-6"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          Data Visualizer
        </motion.h1>
        
        <motion.div 
          className="relative h-2 w-64 md:w-96 bg-gray-200 rounded-full overflow-hidden mb-8"
        >
          <motion.div 
            className="absolute top-0 left-0 h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>

        <motion.div
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [0.98, 1.02, 0.98]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-gray-600 dark:text-gray-300 mb-8"
        >
          Loading your visualization experience...
        </motion.div>

        <Button 
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            router.push("/dashboard");
          }}
          className="mt-4"
        >
          Skip Animation
        </Button>

        {skipClicks === 1 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-gray-500 dark:text-gray-400"
          >
            Click again to skip
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
