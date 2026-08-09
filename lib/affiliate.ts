export const REF_COOKIE = "sc_ref";
export const REF_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function makeReferralCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SOUL-${suffix}`;
}

export function referralUrl(code: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://www.soulcares.life";
  const host = base.replace(/\/$/, "").replace("://soulcares.life", "://www.soulcares.life");
  return `${host}/?ref=${code}`;
}
