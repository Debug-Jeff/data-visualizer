import { NextResponse } from "next/server";

export async function GET() {
  try {
    // In a real application, this would call the Flask backend to generate a CSV file
    // For this example, we'll simulate a response
    
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Create a sample CSV content
    const csvContent = `Month,Value
Jan,10
Feb,25
Mar,15
Apr,30
May,45`;
    
    // Return the CSV data
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=chart.csv",
      },
    });
  } catch (error) {
    console.error("Error generating CSV:", error);
    return NextResponse.json(
      { error: "Failed to generate CSV" },
      { status: 500 }
    );
  }
}
