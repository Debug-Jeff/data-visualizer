"use client";

import { motion } from "framer-motion";
import { ChevronDown } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

export default function Dashboard() {
  const scrollToInput = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col items-center justify-center text-center px-4 relative h-screen"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950" />
          <div className="absolute inset-0 opacity-20 dark:opacity-30 bg-[radial-gradient(circle_at_center,rgba(0,0,255,0.1),transparent_65%)]" />
        </div>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-primary mb-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Transform Your Data
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Create beautiful, interactive visualizations with just a few clicks
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/input">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started
            </Button>
          </Link>
        </motion.div>
        
        {/* Abstract Data Visualization Image */}
        <motion.div 
          className="mt-12 relative w-full max-w-3xl h-64 md:h-80"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Image 
            src="/placeholder.svg?height=400&width=800" 
            alt="Data Visualization" 
            fill
            className="object-contain"
          />
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
          onClick={scrollToInput}
        >
          <ChevronDown size={32} className="text-primary" />
        </motion.div>
      </motion.section>
      
      {/* Data Input Section */}
      <section className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-background">
        <div className="w-full max-w-4xl">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Start Visualizing Your Data
          </motion.h2>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { 
                title: "Line Charts", 
                description: "Perfect for showing trends over time",
                image: "/placeholder.svg?height=200&width=200"
              },
              { 
                title: "Bar Charts", 
                description: "Compare values across different categories",
                image: "/placeholder.svg?height=200&width=200"
              },
              { 
                title: "Pie Charts", 
                description: "Visualize parts of a whole",
                image: "/placeholder.svg?height=200&width=200"
              }
            ].map((chart, index) => (
              <motion.div 
                key={index}
                className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-40 relative">
                  <Image 
                    src={chart.image || "/placeholder.svg"} 
                    alt={chart.title} 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{chart.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{chart.description}</p>
                  <Link href="/input">
                    <Button variant="outline" className="w-full">
                      Create {chart.title}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/input">
              <Button size="lg">
                Create Custom Visualization
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
