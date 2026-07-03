/**
 * formatAiText.js — Extracted from AppContent.jsx
 * Pure function, no React dependency. Formats raw AI text → HTML string.
 */
export function formatAiText(text) {
  if (!text) return "";

  let f = text;

  // Strip markdown bold
  f = f.replace(/\*\*/g, "");

  // Section titles
  f = f
    .replace(/Step-by-step guide:/gi,
      "<br/><h2 class='text-sm font-bold text-violet-600 mt-3 mb-1'>✨ Step-by-step Guide</h2>")
    .replace(/Here's a.*?:/gi,
      "<br/><h2 class='text-sm font-bold text-violet-600 mt-3 mb-1'>💡 Skincare Routine</h2>")
    .replace(/Understanding Your Skin Type:?/gi,
      "<br/><h2 class='text-sm font-bold text-pink-600 mt-3 mb-1'>🧠 Skin Types</h2>")
    .replace(/Morning Routine:?/gi,
      "<br/><h3 class='text-sm font-semibold text-orange-500 mt-2'>🌞 Morning Routine</h3>")
    .replace(/Evening Routine:?/gi,
      "<br/><h3 class='text-sm font-semibold text-indigo-500 mt-2'>🌙 Evening Routine</h3>");

  // Numbered lists
  f = f.replace(/(\d+)\.\s+([^\n]+)/g,
    "<div class='flex gap-2 ml-2 my-0.5'><span class='font-bold text-violet-500 flex-shrink-0 text-xs'>$1.</span><span>$2</span></div>");

  // Bullets
  f = f.replace(/[•]\s?([^\n]+)/g,
    "<div class='flex gap-2 ml-3 my-0.5'><span class='text-violet-400 flex-shrink-0'>•</span><span>$1</span></div>");
  f = f.replace(/^-\s([^\n]+)/gm,
    "<div class='flex gap-2 ml-3 my-0.5'><span class='text-violet-400 flex-shrink-0'>•</span><span>$1</span></div>");

  // Line breaks
  f = f.replace(/\n{2,}/g, "<br/><br/>");
  f = f.replace(/\n/g, "<br/>");

  return f.trim();
}
