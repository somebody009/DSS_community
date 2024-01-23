import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { question } = await request.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a knowledgeable assistant that provides quality information.",
          },
          {
            role: "user",
            content: `Tell me ${question}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("API error:", errorResponse);
      return NextResponse.json({
        error: errorResponse.error || "Unexpected API error",
      });
    }

    const responseData = await response.json();

    if (responseData.choices && responseData.choices.length > 0) {
      const reply = responseData.choices[0]?.message?.content;

      if (reply) {
        console.log("reply", reply);
        return NextResponse.json({ reply });
      } else {
        console.error(
          "Unexpected response structure - missing content:",
          responseData.choices[0]
        );
        return NextResponse.json({ error: "Unexpected response structure" });
      }
    } else {
      console.error(
        "Unexpected response structure - missing choices:",
        responseData
      );
      return NextResponse.json({ error: "Unexpected response structure" });
    }
  } catch (error: any) {
    console.error("Error during API call:", error);
    return NextResponse.json({ error: error.message || "Unexpected error" });
  }
};
