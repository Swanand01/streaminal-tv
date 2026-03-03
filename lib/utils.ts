import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a URL-friendly slug from a title and ID.
 * Uses the English title from TMDB. Falls back to ID-only for non-Latin titles.
 */
export function generateSlug(title: string, id: number): string {
  const slugifiedTitle = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!slugifiedTitle) {
    return String(id);
  }

  return `${slugifiedTitle}-${id}`;
}

/**
 * Extract the TMDB ID from a slug. Never fails - always returns a valid ID or null.
 */
export function extractIdFromSlug(slug: string): number | null {
  if (!slug || typeof slug !== 'string') {
    return null;
  }

  const trimmed = slug.trim();

  // Try: ID after last hyphen (e.g., "the-dark-knight-155")
  const match = trimmed.match(/-(\d+)$/);
  if (match?.[1]) {
    const id = parseInt(match[1], 10);
    if (id > 0) return id;
  }

  // Fallback: entire slug is just a number (e.g., "129")
  const pureNumber = trimmed.match(/^(\d+)$/);
  if (pureNumber?.[1]) {
    const id = parseInt(pureNumber[1], 10);
    if (id > 0) return id;
  }

  return null;
}
