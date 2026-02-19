import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/download-json`, {
      method: "GET",
    })

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to download JSON" },
        { status: response.status }
      )
    }

    const data = await response.json()

    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=analysis-result.json",
      },
    })
  } catch (error) {
    console.error("[v0] Error downloading JSON:", error)
    return NextResponse.json(
      { message: "Failed to download JSON" },
      { status: 500 }
    )
  }
}
