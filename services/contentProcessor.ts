
/**
 * Zenith Content Processor Service
 * Bertanggung jawab untuk mengubah Markdown mentah menjadi HTML yang aman (sanitasi).
 */

export const processContent = async (rawMarkdown: string): Promise<string> => {
  // Simulasi delay server
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!rawMarkdown) return "";

  // 1. Basic Markdown Parser (Simulasi logic server-side)
  let html = rawMarkdown
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-black mb-6">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4">$1</h2>')
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-600 pl-4 py-2 italic my-6 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg">$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" class="rounded-3xl shadow-xl my-8 w-full object-cover" />')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-indigo-600 hover:underline font-bold" target="_blank">$1</a>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc mb-2">$1</li>')
    .replace(/\n$/gim, '<br />');

  // 2. Wrap list items
  html = html.replace(/(<li.*<\/li>)/gim, '<ul class="my-4">$1</ul>');

  // 3. XSS Sanitizer (Whitelist approach)
  // Menghapus tag script, onclick, dsb untuk keamanan
  const sanitizedHtml = sanitizeXSS(html);

  return sanitizedHtml;
};

const sanitizeXSS = (html: string): string => {
  // Simple regex-based sanitizer for demonstration
  // Di lingkungan produksi sesungguhnya, gunakan library seperti DOMPurify
  return html
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
    .replace(/on\w+="[^"]*"/gim, "")
    .replace(/javascript:/gim, "");
};
