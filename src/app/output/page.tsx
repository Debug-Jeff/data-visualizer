"use client";

import { useEffect, useState, useRef } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import { Download, ChevronDown, ArrowLeft } from 'lucide-react';
import dynamic from "next/dynamic";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface ChartData {
  chartType: string;
  data: any;
  rawData: any;
}

export default function OutputPage() {
  const router = useRouter();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("chart");
  const plotRef = useRef<any>(null);
  
  useEffect(() => {
    try {
      // Get chart data from localStorage
      const storedData = localStorage.getItem("chartData");
      if (!storedData) {
        setError("No chart data found. Please go back and input your data.");
        setLoading(false);
        return;
      }
      
      const parsedData = JSON.parse(storedData) as ChartData;
      setChartData(parsedData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading chart data:", err);
      setError("Failed to load chart data. Please try again.");
      setLoading(false);
    }
  }, []);

  const getPlotlyConfig = () => {
    if (!chartData) return null;
    
    const { chartType, data, rawData } = chartData;
    
    if (chartType === "pie") {
      return {
        data: [
          {
            type: "pie",
            labels: rawData.labels,
            values: rawData.values.map(Number),
            textinfo: "label+percent",
            insidetextorientation: "radial",
          },
        ],
        layout: {
          title: "Pie Chart",
          height: 500,
          width: 700,
          margin: { t: 50, b: 50, l: 50, r: 50 },
        },
      };
    } else if (chartType === "line" || chartType === "bar") {
      return {
        data: [
          {
            type: chartType,
            x: rawData.data.map((d: any) => d.x),
            y: rawData.data.map((d: any) => Number(d.y)),
            marker: { color: chartType === "line" ? "#4F46E5" : "#6366F1" },
          },
        ],
        layout: {
          title: chartType === "line" ? "Line Chart" : "Bar Chart",
          xaxis: {
            title: rawData.xAxis,
          },
          yaxis: {
            title: rawData.yAxis,
          },
          height: 500,
          width: 700,
          margin: { t: 50, b: 80, l: 80, r: 50 },
        },
      };
    }
    
    return null;
  };

  const handleExport = async (format: string) => {
    if (!chartData) return;
    
    try {
      let endpoint = "";
      let method = "GET";
      let body = null;
      
      // For image formats, we can use Plotly's toImage function
      if (format === "png" || format === "svg") {
        if (plotRef.current) {
          const imgData = await plotRef.current.toImage({
            format: format,
            width: 800,
            height: 600,
          });
          
          // Create a download link
          const link = document.createElement("a");
          link.href = imgData;
          link.download = `chart.${format}`;
          link.click();
          
          toast({
            title: "Export Successful",
            description: `Chart exported as ${format.toUpperCase()}`,
          });
          
          return;
        }
      }
      
      // For other formats, we need to call the backend
      switch (format) {
        case "pdf":
          endpoint = "/api/download-pdf";
          break;
        case "json":
          endpoint = "/api/download-json";
          break;
        case "csv":
          endpoint = "/api/download-csv";
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
      
      // Send request to Flask backend
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to export as ${format}`);
      }
      
      // Handle the response based on format
      if (format === "pdf") {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `chart.${format}`;
        link.click();
      } else if (format === "json" || format === "csv") {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `chart.${format}`;
        link.click();
      }
      
      toast({
        title: "Export Successful",
        description: `Chart exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : `Failed to export as ${format}`,
        variant: "destructive",
      });
    }
  };

  const renderDataTable = () => {
    if (!chartData) return null;
    
    const { chartType, rawData } = chartData;
    
    if (chartType === "pie") {
      return (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">Label</th>
              <th className="border p-2 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {rawData.labels.map((label: string, index: number) => (
              <tr key={index} className="border-b">
                <td className="border p-2">{label}</td>
                <td className="border p-2">{rawData.values[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left">{rawData.xAxis}</th>
              <th className="border p-2 text-left">{rawData.yAxis}</th>
            </tr>
          </thead>
          <tbody>
            {rawData.data.map((point: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="border p-2">{point.x}</td>
                <td className="border p-2">{point.y}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading your visualization...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>We encountered a problem</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/input")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Input
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const plotlyConfig = getPlotlyConfig();

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
            Your Visualization
          </h1>
          
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    {chartData?.chartType === "line" ? "Line Chart" : 
                     chartData?.chartType === "bar" ? "Bar Chart" : "Pie Chart"}
                  </CardTitle>
                  <CardDescription>
                    Interactive visualization of your data
                  </CardDescription>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport("pdf")}>
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("png")}>
                      Export as PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("svg")}>
                      Export as SVG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("json")}>
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("csv")}>
                      Export as CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart" className="mt-4">
                  <div className="flex justify-center">
                    {plotlyConfig ? (
                      <Plot
                        ref={plotRef}
                        data={plotlyConfig.data}
                        layout={plotlyConfig.layout}
                        config={{ responsive: true, displayModeBar: true }}
                      />
                    ) : (
                      <div className="p-12 text-center">
                        <p>Failed to render chart. Please try again.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="data" className="mt-4">
                  <div className="overflow-x-auto">
                    {renderDataTable()}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/input")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Input
              </Button>
              <Button onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
