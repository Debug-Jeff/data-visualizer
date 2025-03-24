import { NextResponse } from "next/server";

export async function GET() {
  try {
    // In a real application, this would call the Flask backend to generate a JSON file
    // For this example, we'll simulate a response
    
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Create a sample JSON response
    const jsonData = {
      chartType: "line",
      data: {
        x: ["Jan", "Feb", "Mar", "Apr", "May"],
        y: [10, 25, 15, 30, 45],
      },
      config: {
        title: "Sample Chart",
        xAxisLabel: "Month",
        yAxisLabel: "Value",
      },
    };
    
    // Return the JSON data
    return NextResponse.json(jsonData, {
      headers: {
        "Content-Disposition": "attachment; filename=chart.json",
      },
    });
  } catch (error) {
    console.error("Error generating JSON:", error);
    return NextResponse.json(
      { error: "Failed to generate JSON" },
      { status: 500 }
    );
  }
}
