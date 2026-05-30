import { camelCase, snakeCase, isArray, isPlainObject, mapKeys, mapValues } from 'lodash';

/**
 * Recursively transforms all keys of an object to camelCase.
 */
export function toCamelCase<T>(obj: unknown): T {
  if (isArray(obj)) {
    return obj.map((v) => toCamelCase(v)) as unknown as T;
  } else if (isPlainObject(obj)) {
    const camelObj = mapKeys(obj as Record<string, unknown>, (_, k) => camelCase(k));
    return mapValues(camelObj, (v) => toCamelCase(v)) as unknown as T;
  }
  return obj as T;
}

/**
 * Recursively transforms all keys of an object to snake_case.
 */
export function toSnakeCase<T>(obj: unknown): T {
  if (isArray(obj)) {
    return obj.map((v) => toSnakeCase(v)) as unknown as T;
  } else if (isPlainObject(obj)) {
    const snakeObj = mapKeys(obj as Record<string, unknown>, (_, k) => snakeCase(k));
    return mapValues(snakeObj, (v) => toSnakeCase(v)) as unknown as T;
  }
  return obj as T;
}

/**
 * Extracts design settings from a flat snake_case DB object into a nested camelCase object.
 */
export function transformQRRoute(data: unknown): unknown {
  if (!data) return data;
  
  const camelData = toCamelCase<Record<string, unknown>>(data);
  
  const design = {
    fgColor: (camelData.fgColor as string) || '#FF5722',
    bgColor: (camelData.bgColor as string) || '#FFFFFF',
    borderStyle: (camelData.borderStyle as string) || 'none',
    logoUrl: (camelData.logoUrl as string | null) || null,
    logoPadding: (camelData.logoPadding as number) || 10,
    dotType: (camelData.dotType as string) || 'square',
    cornerType: (camelData.cornerType as string) || 'square',
    cornerDotType: (camelData.cornerDotType as string) || 'square',
    margin: (camelData.margin as number) || 0,
  };

  const { 
    ...rest 
  } = camelData;

  // Manually remove keys that are now in design object
  delete rest.fgColor;
  delete rest.bgColor;
  delete rest.borderStyle;
  delete rest.logoUrl;
  delete rest.logoPadding;
  delete rest.dotType;
  delete rest.cornerType;
  delete rest.cornerDotType;
  delete rest.margin;
  
  return {
    ...rest,
    design,
  };
}
