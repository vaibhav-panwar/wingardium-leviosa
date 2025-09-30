import { NextRequest, NextResponse } from "next/server";
import { getGenAI } from "@/lib/genai";

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = "gemini-2.5-flash" } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate content", success: false },
      { status: 500 }
    );
  }
}
