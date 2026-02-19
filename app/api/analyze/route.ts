import { NextRequest, NextResponse } from "next/server"

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
}

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const backendFormData = new FormData()
    backendFormData.append(
      "file",
      new Blob([buffer], { type: "text/csv" }),
      file.name
    )

    const response = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      body: backendFormData,
      headers: {
        // Don't set Content-Type, let the browser set it with boundary
      },
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { message: `Backend error: ${error}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error analyzing CSV:", error)
    return NextResponse.json(
      { message: "Failed to analyze CSV" },
      { status: 500 }
    )
  }
}
