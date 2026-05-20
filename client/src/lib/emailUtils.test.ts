import { describe, expect, it } from 'vitest';
import {
  cleanContent,
  filterEmails,
  formatBodyParagraphs,
  getEmailKey,
  senderName,
} from './emailUtils';

describe('emailUtils', () => {
  it('getEmailKey prefers id', () => {
    expect(getEmailKey({ id: 'a', from: 'x', subject: 's', content: 'c', category: 'neutral' })).toBe('a');
  });

  it('senderName strips email brackets', () => {
    expect(senderName('Jane <jane@test.com>')).toBe('Jane');
  });

  it('cleanContent removes urls and tags', () => {
    expect(cleanContent('Hello https://x.com <b>bold</b>  world')).toBe('Hello bold world');
  });

  it('formatBodyParagraphs splits sentences', () => {
    const parts = formatBodyParagraphs('First sentence here. Second sentence starts now.');
    expect(parts.length).toBeGreaterThanOrEqual(1);
  });

  it('filterEmails applies category and search', () => {
    const emails = [
      { id: '1', from: 'A', subject: 'Urgent task', content: 'body', category: 'urgent' },
      { id: '2', from: 'B', subject: 'Newsletter', content: 'digest', category: 'neutral' },
    ];
    expect(filterEmails(emails, 'urgent', '').length).toBe(1);
    expect(filterEmails(emails, 'all', 'news').length).toBe(1);
  });
});
