"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import { BarChart, LineChart, PieChart } from 'lucide-react';

export default function InputPage() {
  const router = useRouter();
  const [chartType, setChartType] = useState("line");
  const [loading, setLoading] = useState(false);
  
  // Line/Bar Chart Data
  const [lineData, setLineData] = useState({
    xAxis: "",
    yAxis: "",
    data: [
      { x: "", y: "" },
      { x: "", y: "" },
      { x: "", y: "" },
    ],
  });
  
  // Pie Chart Data
  const [pieData, setPieData] = useState({
    labels: ["", "", ""],
    values: ["", "", ""],
  });

  const handleLineDataChange = (index: number, field: string, value: string) => {
    setLineData((prev) => {
      const newData = [...prev.data];
      newData[index] = { ...newData[index], [field]: value };
      return { ...prev, data: newData };
    });
  };

  const addLineDataPoint = () => {
    setLineData((prev) => ({
      ...prev,
      data: [...prev.data, { x: "", y: "" }],
    }));
  };

  const removeLineDataPoint = (index: number) => {
    if (lineData.data.length <= 2) {
      toast({
        title: "Cannot remove",
        description: "You need at least 2 data points for a chart",
        variant: "destructive",
      });
      return;
    }
    
    setLineData((prev) => ({
      ...prev,
      data: prev.data.filter((_, i) => i !== index),
    }));
  };

  const handlePieDataChange = (index: number, field: string, value: string) => {
    setPieData((prev) => {
      const newArray = [...prev[field as keyof typeof prev] as string[]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addPieDataPoint = () => {
    setPieData((prev) => ({
      labels: [...prev.labels, ""],
      values: [...prev.values, ""],
    }));
  };

  const removePieDataPoint = (index: number) => {
    if (pieData.labels.length <= 2) {
      toast({
        title: "Cannot remove",
        description: "You need at least 2 data points for a pie chart",
        variant: "destructive",
      });
      return;
    }
    
    setPieData((prev) => ({
      labels: prev.labels.filter((_, i) => i !== index),
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  const validateData = () => {
    if (chartType === "pie") {
      // Validate pie chart data
      for (let i = 0; i < pieData.labels.length; i++) {
        if (!pieData.labels[i] || !pieData.values[i]) {
          toast({
            title: "Validation Error",
            description: "All labels and values must be filled",
            variant: "destructive",
          });
          return false;
        }
        
        if (isNaN(Number(pieData.values[i]))) {
          toast({
            title: "Validation Error",
            description: "All values must be numbers",
            variant: "destructive",
          });
          return false;
        }
      }
    } else {
      // Validate line/bar chart data
      if (!lineData.xAxis || !lineData.yAxis) {
        toast({
          title: "Validation Error",
          description: "X-axis and Y-axis labels are required",
          variant: "destructive",
        });
        return false;
      }
      
      for (const point of lineData.data) {
        if (!point.x || !point.y) {
          toast({
            title: "Validation Error",
            description: "All data points must be filled",
            variant: "destructive",
          });
          return false;
        }
        
        if (isNaN(Number(point.y))) {
          toast({
            title: "Validation Error",
            description: "Y values must be numbers",
            variant: "destructive",
          });
          return false;
        }
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateData()) return;
    
    setLoading(true);
    
    try {
      // Prepare data based on chart type
      const data = chartType === "pie" ? pieData : lineData;
      
      // Send data to Flask backend
      const response = await fetch("http://localhost:5000/api/process-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chartType,
          data,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process data");
      }
      
      // Store the response data in localStorage to pass to output page
      const responseData = await response.json();
      localStorage.setItem("chartData", JSON.stringify({
        chartType,
        data: responseData,
        rawData: chartType === "pie" ? pieData : lineData,
      }));
      
      // Navigate to output page
      router.push("/output");
    } catch (error) {
      console.error("Error processing data:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster />
      
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Input Your Data
          </h1>
          
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Chart Configuration</CardTitle>
              <CardDescription>
                Select a chart type and enter your data
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="chart-type">Chart Type</Label>
                <Select
                  value={chartType}
                  onValueChange={setChartType}
                >
                  <SelectTrigger id="chart-type" className="w-full">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">
                      <div className="flex items-center gap-2">
                        <LineChart size={16} />
                        <span>Line Chart</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bar">
                      <div className="flex items-center gap-2">
                        <BarChart size={16} />
                        <span>Bar Chart</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="pie">
                      <div className="flex items-center gap-2">
                        <PieChart size={16} />
                        <span>Pie Chart</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Tabs value={chartType === "pie" ? "pie" : "xy"} className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger 
                    value="xy" 
                    onClick={() => setChartType("line")}
                    disabled={chartType === "pie"}
                  >
                    Line/Bar Chart
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pie" 
                    onClick={() => setChartType("pie")}
                    disabled={chartType !== "pie"}
                  >
                    Pie Chart
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="xy" className="mt-4">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="x-axis">X-Axis Label</Label>
                        <Input
                          id="x-axis"
                          placeholder="e.g., Months"
                          value={lineData.xAxis}
                          onChange={(e) => setLineData({ ...lineData, xAxis: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="y-axis">Y-Axis Label</Label>
                        <Input
                          id="y-axis"
                          placeholder="e.g., Sales"
                          value={lineData.yAxis}
                          onChange={(e) => setLineData({ ...lineData, yAxis: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Data Points</Label>
                      {lineData.data.map((point, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder={`X value ${index + 1}`}
                            value={point.x}
                            onChange={(e) => handleLineDataChange(index, "x", e.target.value)}
                          />
                          <Input
                            placeholder={`Y value ${index + 1}`}
                            value={point.y}
                            onChange={(e) => handleLineDataChange(index, "y", e.target.value)}
                            type="number"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeLineDataPoint(index)}
                            type="button"
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={addLineDataPoint}
                        type="button"
                        className="w-full"
                      >
                        Add Data Point
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="pie" className="mt-4">
                  <div className="space-y-6">
                    <Label>Pie Chart Data</Label>
                    {pieData.labels.map((label, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Label ${index + 1}`}
                          value={label}
                          onChange={(e) => handlePieDataChange(index, "labels", e.target.value)}
                        />
                        <Input
                          placeholder={`Value ${index + 1}`}
                          value={pieData.values[index]}
                          onChange={(e) => handlePieDataChange(index, "values", e.target.value)}
                          type="number"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removePieDataPoint(index)}
                          type="button"
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addPieDataPoint}
                      type="button"
                      className="w-full"
                    >
                      Add Data Point
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Processing..." : "Generate Visualization"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
