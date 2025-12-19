export function normalizePhone10(input) {
  if (input === null || input === undefined) return null;

  // keep digits only
  let s = String(input).trim().replace(/\D/g, "");

  // convert +84 / 84xxxxxxxxx -> 0xxxxxxxxx
  if (s.startsWith("84") && s.length === 11) s = "0" + s.slice(2);

  // must be exactly 10 digits (VN mobile format in your DB: CHAR(10))
  if (!/^\d{10}$/.test(s)) return null;

  return s;
}