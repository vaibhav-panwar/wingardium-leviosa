import type { ParsedCsvColumns } from "@/utils/parseCsv";
import { generateWithAI } from "@/lib/aiClientBrowser";

export type TargetField =
  | "firstName"
  | "lastName"
  | "phoneNo"
  | "email"
  | "agentEmail";

export type HeaderMapping = {
  sourceField: string;
  targetField: TargetField;
  matchPercentage: number; // 0-100
  sampleValues: string[]; // up to 5
};

const headerKeywords: Record<TargetField, RegExp[]> = {
  firstName: [/^first\b/i, /\bfname\b/i, /\bgiven\b/i, /\bfst\b/i],
  lastName: [
    /^last\b/i,
    /\blname\b/i,
    /\bsur\s?name\b/i,
    /\bfamily\b/i,
    /\bsirname\b/i,
  ],
  phoneNo: [
    /\bphone\b/i,
    /\bmobile\b/i,
    /\bcell\b/i,
    /\bcontact\b/i,
    /\btel\b/i,
  ],
  email: [/\bemail\b/i, /\be-mail\b/i, /\bmail\b/i],
  agentEmail: [
    /\bagent\b.*\bemail\b/i,
    /\bowner\b.*\bemail\b/i,
    /\bassignee\b.*\bemail\b/i,
    /\bagent\b/i,
  ],
};

const valueRegex: Record<TargetField, RegExp> = {
  firstName: /^[A-Za-z][A-Za-z\-']{1,}$/,
  lastName: /^[A-Za-z][A-Za-z\-']{1,}$/,
  phoneNo: /^(\+\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?[\d\s-]{6,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
  agentEmail: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
};

const WEIGHT_HEADER_MATCH = 0.6;
const WEIGHT_VALUE_MATCH = 0.4;

function scoreHeaderName(header: string, target: TargetField): number {
  const patterns = headerKeywords[target];
  const normalized = header.trim();
  let hits = 0;
  for (const re of patterns) {
    if (re.test(normalized)) hits++;
  }
  // agentEmail should strongly prefer headers that include both agent and email
  if (target === "agentEmail") {
    const strong = /\bagent\b.*\bemail\b|\bemail\b.*\bagent\b/i.test(
      normalized
    );
    if (strong) hits += 1;
  }
  return Math.min(1, hits / Math.max(1, patterns.length));
}

function scoreValues(samples: string[], target: TargetField): number {
  const re = valueRegex[target];
  if (!re) return 0;
  if (samples.length === 0) return 0;
  const valid = samples.filter(
    (v) => typeof v === "string" && re.test(v.trim())
  ).length;
  return valid / samples.length;
}

export function mapCsvHeaders(parsed: ParsedCsvColumns): HeaderMapping[] {
  const mappings: HeaderMapping[] = [];
  const targets: TargetField[] = [
    "firstName",
    "lastName",
    "phoneNo",
    "email",
    "agentEmail",
  ];

  for (const [header, values] of Object.entries(parsed)) {
    const samples = values.slice(0, 5);
    let best: { target: TargetField; score: number } | null = null;

    for (const target of targets) {
      const nameScore = scoreHeaderName(header, target); // 0..1
      const valueScore = scoreValues(samples, target); // 0..1
      let combined =
        WEIGHT_HEADER_MATCH * nameScore + WEIGHT_VALUE_MATCH * valueScore;

      // Heuristic: if header clearly matches email but also has agent keyword, favor agentEmail
      if (
        target === "agentEmail" &&
        /\bagent\b/i.test(header) &&
        /\bemail\b|\bmail\b/i.test(header)
      ) {
        combined = Math.min(1, combined + 0.15);
      }

      if (!best || combined > best.score) {
        best = { target, score: combined };
      }
    }

    const matchPercentage = Math.round((best?.score ?? 0) * 100);
    mappings.push({
      sourceField: header,
      targetField: best?.target ?? "firstName",
      matchPercentage,
      sampleValues: samples,
    });
  }

  return mappings;
}

export async function mapCsvHeadersAI(
  parsed: ParsedCsvColumns,
  model: string = "gemini-2.5-flash-lite"
): Promise<any> {
  console.log("mapping begins");
  const targets: TargetField[] = [
    "firstName",
    "lastName",
    "phoneNo",
    "email",
    "agentEmail",
  ];

  const samplesByHeader: Record<string, string[]> = {};
  for (const [header, values] of Object.entries(parsed)) {
    samplesByHeader[header] = values.slice(0, 5);
  }

  console.log("mapping rises");

  const responseShapeExample = [
    {
      sourceField: "first_name",
      targetField: "firstName",
      matchPercentage: 92,
      sampleValues: ["John", "Mary", "Ava"],
    },
  ];

  const prompt = [
    "You are mapping CSV headers to target CRM fields.",
    `Target fields: ${JSON.stringify(targets)}`,
    "Given an object where keys are CSV headers and values are the first 5 sample values for that column,",
    "return a JSON array where each element has: {sourceField, targetField, matchPercentage, sampleValues}.",
    "Rules:",
    "- targetField must be one of the target fields only.",
    "- matchPercentage must reflect BOTH:",
    " 1. How close the header name is to the target field name (this is the most important factor).",
    " - Identical or very close variations (e.g., first_name → firstName) must score above 90.",
    " - Partial matches or related synonyms (e.g., mobile → phone) should score 70–85.",
    " - Weak or unrelated matches should be below 50.",
    " 2. How well the sample values fit the expected type of the target field (names, emails, phone numbers, etc.).",
    "- Sample values must echo the provided samples (up to 5).",
    "- Return ONLY JSON. No prose, no explanation.",
    "Samples by header:",
    JSON.stringify(samplesByHeader),
    "Example of the required JSON shape:",
    JSON.stringify(responseShapeExample),
  ].join("\n");

  try {
    console.log("before api call wkjekweje");
    const aiText = await generateWithAI(prompt, model);
    console.log("after api call wjkweewewjkwejk");
    console.log(aiText);
    let stringifyJson = aiText.text || aiText;
    const jsonMatch = stringifyJson.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      stringifyJson = jsonMatch[1];
    } else {
      stringifyJson = stringifyJson.trim();
    }
    let a = JSON.parse(stringifyJson);
    return a;
  } catch (err) {
    console.log("Error while using AI mapper , using normal approach");
    return mapCsvHeaders(parsed);
  }
}
