import { NextResponse } from "next/server";



export async function readForm(request: Request): Promise<Record<string, FormDataEntryValue | string>> {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const data = (await request.json()) as Record<string, unknown>;
    const out: Record<string, FormDataEntryValue | string> = {};
    for (const [k, v] of Object.entries(data)) out[k] = typeof v === "string" ? v : (v as never);
    return out;
  }
  const fd = await request.formData();
  const out: Record<string, FormDataEntryValue | string> = {};
  for (const [k, v] of fd.entries()) out[k] = typeof v === "string" ? v : "";
  // multi-value fields (checkbox groups)
  for (const k of new Set(fd.keys())) {
    const all = fd.getAll(k);
    if (all.length > 1) out[`${k}__all`] = all.map(String).join("|");
  }
  return out;
}

export function str(v: FormDataEntryValue | string | undefined, fallback = "") {
  if (typeof v !== "string") return fallback;
  const t = v.trim();
  return t.length ? t : fallback;
}

export function list(v: FormDataEntryValue | string | undefined, key?: string, raw?: FormData): string[] {
  if (key && raw) {
    const all = raw.getAll(key).map((x) => String(x)).filter(Boolean);
    if (all.length) return all;
  }
  if (typeof v !== "string") return [];
  return v
    .split(/[|,]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function toBool(v: FormDataEntryValue | string | undefined) {
  return v === "on" || v === "true" || v === "1" || v === "yes";
}

export function toInt(v: FormDataEntryValue | string | undefined, fallback = 0) {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

export function redirect(request: Request, to: string, status: 303 = 303) {
  const target = new URL(to.startsWith("http") ? to : to, request.url);
  return NextResponse.redirect(target, status);
}

export function safeNext(value: string | undefined, fallback = "/") {
  if (!value) return fallback;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return fallback;
}
