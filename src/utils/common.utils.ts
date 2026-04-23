/**
 * Generates a UUID v4 string with fallback for environments without crypto.randomUUID
 * @returns {string} UUID v4 string
 */
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getIds = <T extends { id?: string }>(data: T[]): ({ id: string })[] => {
  return data.map(item => item.id ? ({ id: item.id }) : null).filter(Boolean) as ({ id: string })[];
};

export const isEmptyObject = <T extends {}>(value: T) => !Object.keys(value).length;

export const getQueryParam = <T extends string = string>(
  searchParams: URLSearchParams,
  key: string
): T | undefined => {
  const value = searchParams.get(key);

  return value !== null ? (value as T) : undefined;
}