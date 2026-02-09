import axios from "axios";
import { ParsedExpense } from "../types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `You are an expense parser. Extract expense information from natural language input.

RULES:
1. Extract the amount as a number (no currency symbols)
2. Default currency is INR unless explicitly mentioned (USD, EUR, etc.)
3. Categorize into EXACTLY one of these categories:
   - Food & Dining (restaurants, cafes, food delivery, groceries)
   - Transport (uber, ola, taxi, fuel, parking, metro)
   - Shopping (clothes, electronics, amazon, flipkart)
   - Entertainment (movies, netflix, spotify, games)
   - Bills & Utilities (electricity, water, internet, phone)
   - Health (medicine, doctor, gym, pharmacy)
   - Travel (flights, hotels, trips)
   - Other (anything that doesn't fit above)
4. Description should be a clean summary (not the raw input)
5. Merchant is the company/store name if mentioned, null otherwise
6. If user pass Test 130 or abc 123, we will add this because we have amount and item name add this to Other category

RESPOND ONLY WITH VALID JSON, no other text:
{
  "amount": <number>,
  "currency": "<string>",
  "category": "<string>",
  "description": "<string>",
  "merchant": "<string or null>"
}

If the input is invalid or you cannot extract an amount, respond:
{
  "error": "Could not parse expense. Please include an amount.",
  "amount": null
}`;

export const parseExpense = async (text: string): Promise<ParsedExpense> => {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured in environment variables");
  }

  if (!text || text.trim().length === 0) {
    throw new Error("Input text cannot be empty");
  }

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text },
        ],
        temperature: 0.1,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const aiResponse = response.data.choices[0].message.content.trim();
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
    const parsed = JSON.parse(jsonStr);

    if (parsed.error || parsed.amount === null) {
      throw new Error(
        parsed.error || "Could not parse expense. Please include an amount.",
      );
    }

    if (typeof parsed.amount !== "number" || parsed.amount <= 0) {
      throw new Error("Invalid amount. Please specify a positive number.");
    }

    return {
      amount: parseFloat(parsed.amount.toFixed(2)),
      currency: parsed.currency || "INR",
      category: parsed.category,
      description: parsed.description || text,
      merchant: parsed.merchant || null,
    };
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new Error("AI returned invalid response. Please try again.");
    }
    if (error.response) {
      throw new Error(
        `AI API error: ${error.response.data.error?.message || "Unknown error"}`,
      );
    }
    throw error;
  }
};
