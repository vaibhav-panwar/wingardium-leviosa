import { csvParse } from "d3-dsv";

export type ParsedCsvColumns = Record<string, string[]>;

export function parseCsv(text: string): ParsedCsvColumns {
  const data = csvParse(text);
  const headers = (data.columns || []).map((h) => String(h));
  const result: ParsedCsvColumns = {};
  headers.forEach((h) => {
    result[h] = [];
  });
  data.forEach((row) => {
    headers.forEach((h) => {
      const value = (row as unknown as Record<string, unknown>)[h];
      result[h].push(value == null ? "" : String(value));
    });
  });
  return result;
}
