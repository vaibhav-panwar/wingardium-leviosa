export async function generateWithAI(
  prompt: string,
  model = "gemini-2.5-flash"
) {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model }),
    });
    return await res.json();
  } catch (error) {
    throw new Error("AI request failed");
  }
}
