function escapeCell(value: string): string {
  if (value.includes('"') || value.includes(",") || value.includes("\n") || value.includes("\r")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function toCsv(rows: Array<Record<string, string>>, headers: string[]): string {
  const headerLine = headers.map(escapeCell).join(",");
  const lines = rows.map((row) => headers.map((h) => escapeCell(row[h] ?? "")).join(","));
  return [headerLine, ...lines].join("\n") + "\n";
}

export function parseCsv(content: string): Array<Record<string, string>> {
  // Minimal RFC4180-ish parser (enough for Google Sheets roundtrip)
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  const pushCell = () => {
    row.push(cell);
    cell = "";
  };
  const pushRow = () => {
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < content.length; i++) {
    const ch = content[i]!;
    const next = content[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
        continue;
      }
      if (ch === '"') {
        inQuotes = false;
        continue;
      }
      cell += ch;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ",") {
      pushCell();
      continue;
    }
    if (ch === "\n") {
      pushCell();
      pushRow();
      continue;
    }
    if (ch === "\r") continue;
    cell += ch;
  }
  // last row
  pushCell();
  pushRow();

  const [header, ...data] = rows.filter((r) => r.some((c) => c.length > 0));
  if (!header) return [];
  const headers = header.map((h) => h.trim());

  return data.map((r) => {
    const obj: Record<string, string> = {};
    for (let i = 0; i < headers.length; i++) obj[headers[i]!] = r[i] ?? "";
    return obj;
  });
}

