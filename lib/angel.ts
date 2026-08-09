const defaults = [
  "Thank you for sharing that with me. Soul Care walks beside you as a voice of reason until your therapist, doctor, or pastor can weigh in. What feels most pressing on your heart today?",
  "I'm listening. Remember — sound spiritual guidance complements professional care; it doesn't replace it. You're taking a wise step by checking in.",
  "Peace to you in this moment. If something feels beyond daily support, please reach out to your care team or call 988 in the U.S.",
];

export function angelReply(message: string): string {
  const text = message.toLowerCase();

  if (/suicid|kill myself|hurt myself|end my life|988|emergency/.test(text)) {
    return "I'm glad you told me. If you're in immediate danger, call 911 or 988 now. Angel is here for daily support, but crisis care needs a live professional right away. Would someone from your care team be able to sit with you today?";
  }
  if (/anxious|anxiety|worry|afraid|scared|panic/.test(text)) {
    return "Anxiety can feel overwhelming. Try one slow breath — in for four, out for six. You're not failing; you're human. Have you shared this wave with your therapist or doctor? They can help you build tools beyond what daily check-ins provide.";
  }
  if (/sad|depress|lonely|alone|grief|hopeless/.test(text)) {
    return "Heaviness is real, and naming it matters. You don't have to carry this silently. Your pastor and therapist are part of your team for a reason — would a short note to one of them feel possible this week?";
  }
  if (/angry|frustrat|resent|bitter/.test(text)) {
    return "Anger often guards something tender underneath. Sitting with it without judgment is faithful work. When you're ready, a trusted counselor can help you unpack what it's protecting.";
  }
  if (/god|faith|pray|scripture|church|spiritual/.test(text)) {
    return "Your faith journey is yours, and it's welcome here. Sound spiritual counsel means pointing you toward wisdom, community, and professional care when needed — not replacing your pastor or clinician. What would feel spiritually grounding today?";
  }
  if (/thank|grateful|better|good day|peace/.test(text)) {
    return "I'm grateful you checked in. Celebrate small shifts — they're real. I'll include this tone in your progress summary for your care team when you send your next report.";
  }

  return defaults[Math.floor(Math.random() * defaults.length)];
}

export function buildProgressSummary(
  memberName: string,
  messages: { role: string; content: string; created_at: string }[]
): string {
  const userMessages = messages.filter((m) => m.role === "user");
  const checkIns = userMessages.length;
  const snippets = userMessages
    .slice(-5)
    .map((m) => `• "${m.content.slice(0, 120)}${m.content.length > 120 ? "…" : ""}"`)
    .join("\n");

  return [
    `Soul Care — Angel progress summary for ${memberName || "member"}`,
    `Period: last ${messages.length > 0 ? "7 days" : "check-in"}`,
    ``,
    `Check-ins with Angel: ${checkIns}`,
    snippets ? `Recent themes:\n${snippets}` : "No recent check-in text on file.",
    ``,
    `Note: This is supportive daily engagement, not a clinical assessment. Please use your professional judgment.`,
    `— Soul Care (soulcares.life)`,
  ].join("\n");
}
