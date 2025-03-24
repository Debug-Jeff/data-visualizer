import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chartType, data } = body;
    
    // Validate the request
    if (!chartType || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // In a real application, this would process the data and send it to the Flask backend
    // For this example, we'll simulate a response from the Flask backend
    
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Return processed data based on chart type
    if (chartType === "pie") {
      return NextResponse.json({
        chartData: {
          labels: data.labels,
          values: data.values.map(Number),
        },
        config: {
          title: "Pie Chart",
        },
      });
    } else {
      // Line or bar chart
      return NextResponse.json({
        chartData: {
          x: data.data.map((d: any) => d.x),
          y: data.data.map((d: any) => Number(d.y)),
        },
        config: {
          title: chartType === "line" ? "Line Chart" : "Bar Chart",
          xAxisLabel: data.xAxis,
          yAxisLabel: data.yAxis,
        },
      });
    }
  } catch (error) {
    console.error("Error processing data:", error);
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500 }
    );
  }
}
