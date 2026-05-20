import { describe, expect, it } from 'vitest';
import { GUEST_EMAILS, GUEST_LIMITATIONS } from './guestData';

describe('guestData', () => {
  it('provides demo inbox emails', () => {
    expect(GUEST_EMAILS.length).toBeGreaterThanOrEqual(3);
    for (const email of GUEST_EMAILS) {
      expect(email.demoSummary.length).toBeGreaterThan(10);
      expect(email.demoResponse.length).toBeGreaterThan(10);
    }
  });

  it('documents guest limitations', () => {
    expect(GUEST_LIMITATIONS.length).toBe(3);
  });
});
