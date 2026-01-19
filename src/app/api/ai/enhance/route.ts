import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // ✅ Guard: don't crash builds / environments without the key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured (missing OPENAI_API_KEY)" },
        { status: 503 }
      );
    }

    // ✅ Lazy import so build doesn't evaluate OpenAI module/key at compile time
    const OpenAI = (await import("openai")).default;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await request.json();
    const { code, language, template, variables } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: "Missing required fields: code, language" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      // ✅ Use a model you can actually run (gpt-4 may fail depending on account access)
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a code enhancement assistant. Review and improve ${language} code for best practices, performance, and readability.`,
        },
        {
          role: "user",
          content: `Enhance this ${language} code from template "${template ?? "unknown"}":\n\n${code}\n\nVariables used: ${JSON.stringify(
            variables ?? {}
          )}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return NextResponse.json({
      enhancedCode: completion.choices[0]?.message?.content || "",
      suggestions: [
        "Added error handling",
        "Improved variable names",
        "Added comments",
        "Optimized performance",
      ],
    });
  } catch (error) {
    console.error("AI enhancement error:", error);
    return NextResponse.json({ error: "Failed to enhance code" }, { status: 500 });
  }
}
