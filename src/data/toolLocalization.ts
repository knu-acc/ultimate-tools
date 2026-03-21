/**
 * Tool Localization Helpers
 * Eliminates the need for 'as any' casting throughout the codebase
 * Provides safe access to bilingual tool properties
 */

import type { Tool, ToolGroup } from '@/src/data/tools';

/**
 * Get the name of a tool in the specified language
 * @param tool The tool object
 * @param locale The language ('ru' or 'en')
 * @returns The tool name in the specified language
 */
export function getToolName(tool: Tool, locale: string): string {
  return locale === 'en' ? tool.nameEn || tool.name : tool.name;
}

/**
 * Get the description of a tool in the specified language
 * @param tool The tool object
 * @param locale The language ('ru' or 'en')
 * @returns The tool description in the specified language
 */
export function getToolDescription(tool: Tool, locale: string): string {
  return locale === 'en' ? tool.descriptionEn || tool.description : tool.description;
}

/**
 * Get the SEO title of a tool in the specified language
 * @param tool The tool object
 * @param locale The language ('ru' or 'en')
 * @returns The SEO title, or undefined if not set
 */
export function getToolSeoTitle(tool: Tool, locale: string): string | undefined {
  return tool.seoTitle;
}

/**
 * Get the SEO description of a tool in the specified language
 * @param tool The tool object
 * @param locale The language ('ru' or 'en')
 * @returns The SEO description, or undefined if not set
 */
export function getToolSeoDescription(tool: Tool, locale: string): string | undefined {
  return tool.seoDescription;
}

/**
 * Get the display name of a tool group in the specified language
 * @param group The tool group object
 * @param locale The language ('ru' or 'en')
 * @returns The group name in the specified language
 */
export function getGroupName(group: ToolGroup | undefined, locale: string): string {
  if (!group) return '';
  return locale === 'en' ? group.nameEn || group.name : group.name;
}

/**
 * Get the display description of a tool group in the specified language
 * @param group The tool group object
 * @param locale The language ('ru' or 'en')
 * @returns The group description in the specified language
 */
export function getGroupDescription(group: ToolGroup | undefined, locale: string): string {
  if (!group) return '';
  return locale === 'en' ? group.descriptionEn || group.description : group.description;
}

/**
 * Get typed tool name with type safety
 * Use this instead of (tool as any).nameEn
 */
export function getTypedToolName(tool: Tool, locale: string): string {
  if (locale === 'en') {
    return tool.nameEn || tool.name;
  }
  return tool.name;
}

/**
 * Get typed tool description with type safety
 * Use this instead of (tool as any).descriptionEn
 */
export function getTypedToolDescription(tool: Tool, locale: string): string {
  if (locale === 'en') {
    return tool.descriptionEn || tool.description;
  }
  return tool.description;
}

/**
 * Create a safe bilingual property accessor
 * Returns a getter function that safely accesses properties with fallback
 */
export const createBilingualAccessor = <T>(ruValue: T | undefined, enValue: T | undefined) => (locale: string) => {
  return locale === 'en' ? enValue || ruValue : ruValue;
};

/**
 * Transform a tool object to ensure all bilingual properties are safely accessible
 * This prevents the need for 'as any' casts in components
 */
export function enhanceToolForLocale(tool: Tool, locale: string) {
  return {
    ...tool,
    displayName: getToolName(tool, locale),
    displayDescription: getToolDescription(tool, locale),
    displaySeoTitle: getToolSeoTitle(tool, locale),
    displaySeoDescription: getToolSeoDescription(tool, locale),
  };
}

/**
 * Transform a group object to ensure all bilingual properties are safely accessible
 */
export function enhanceGroupForLocale(group: ToolGroup | undefined, locale: string) {
  if (!group) return undefined;
  return {
    ...group,
    displayName: getGroupName(group, locale),
    displayDescription: getGroupDescription(group, locale),
  };
}
