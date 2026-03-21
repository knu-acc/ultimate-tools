/**
 * HTML Sanitization Utilities
 * Provides safe methods for rendering HTML content
 * Eliminates XSS vulnerabilities from dangerouslySetInnerHTML usage
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Configuration for DOMPurify sanitization
 * Allows only safe HTML tags and attributes
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'div', 'span', 'strong', 'em', 'u', 'i', 'b',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
    'blockquote', 'pre', 'code',
    'a', 'img',
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'width', 'height', 'style'],
  ALLOWED_STYLES: {
    '*': {
      'color': [/^[a-z]*$/],
      'background': [/^[a-z]*$/],
      'padding': [/^[\d]+px$/],
      'margin': [/^[\d]+px$/],
    },
  },
  KEEP_CONTENT: true,
  RETURN_DOM: false,
} as any;

/**
 * Sanitize HTML content using DOMPurify
 * @param html Raw HTML string that may contain malicious code
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  try {
    return DOMPurify.sanitize(html, {
      ...SANITIZE_CONFIG,
      RETURN_DOM: false,
    } as any) as unknown as string;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }
}

/**
 * Sanitize HTML and return as TrustedHTML for Trusted Types CSP
 * @param html Raw HTML string
 * @returns Object compatible with dangerouslySetInnerHTML
 */
export function getSafeHtmlForRender(html: string): { __html: string } {
  return {
    __html: sanitizeHtml(html),
  };
}

/**
 * Escape HTML special characters
 * Use for text content that might contain HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Safely render markdown-parsed HTML
 * Used in MarkdownPreview and similar components
 */
export function sanitizeMarkdownOutput(html: string): { __html: string } {
  return getSafeHtmlForRender(html);
}

/**
 * Safely render JSON formatted as HTML
 * Used in JsonFormatter and similar components
 */
export function sanitizeJsonOutput(html: string): { __html: string } {
  return getSafeHtmlForRender(html);
}

/**
 * Check if a string contains HTML
 * @param text The text to check
 * @returns true if text appears to contain HTML tags
 */
export function containsHtml(text: string): boolean {
  return /<[a-z][\s\S]*?>/i.test(text);
}

/**
 * Strip all HTML tags from a string
 * @param html HTML string with tags
 * @returns Plain text without HTML tags
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Get a plaintext preview of HTML content
 * Truncated to a maximum length
 */
export function getHtmlPreview(html: string, maxLength: number = 100): string {
  const plain = stripHtmlTags(sanitizeHtml(html));
  if (plain.length > maxLength) {
    return plain.slice(0, maxLength) + '...';
  }
  return plain;
}
