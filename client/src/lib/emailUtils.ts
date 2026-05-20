export interface EmailLike {
  id?: string;
  _id?: string;
  emailId?: string;
  from: string;
  subject: string;
  content: string;
  category: string;
}

export function getEmailKey(email: EmailLike): string {
  return email.id || email._id || email.emailId || '';
}

export function senderName(from: string): string {
  return (from || 'Unknown').replace(/<.*?>/, '').trim();
}

export function cleanContent(text: string): string {
  return text.replace(/https?:\/\/\S+/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

export function formatBodyParagraphs(text: string): string[] {
  const cleaned = cleanContent(text);
  const chunks = cleaned.split(/(?<=[.!?])\s+(?=[A-Z])/);
  if (chunks.length <= 1) return [cleaned];
  return chunks.filter((chunk) => chunk.length > 20);
}

export function filterEmails<T extends EmailLike>(
  emails: T[],
  activeFilter: string,
  searchQuery: string
): T[] {
  const query = searchQuery.toLowerCase();
  return emails.filter((email) => {
    if (activeFilter !== 'all' && email.category !== activeFilter) return false;
    if (!query) return true;
    return (
      (email.subject?.toLowerCase() || '').includes(query) ||
      (email.from?.toLowerCase() || '').includes(query) ||
      (email.content?.toLowerCase() || '').includes(query)
    );
  });
}
