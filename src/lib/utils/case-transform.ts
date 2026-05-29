import { camelCase, snakeCase, isArray, isPlainObject, mapKeys, mapValues } from 'lodash';

/**
 * Recursively transforms all keys of an object to camelCase.
 */
export function toCamelCase<T>(obj: any): T {
  if (isArray(obj)) {
    return obj.map((v) => toCamelCase(v)) as any;
  } else if (isPlainObject(obj)) {
    const camelObj = mapKeys(obj, (v, k) => camelCase(k));
    return mapValues(camelObj, (v) => toCamelCase(v)) as any;
  }
  return obj;
}

/**
 * Recursively transforms all keys of an object to snake_case.
 */
export function toSnakeCase<T>(obj: any): T {
  if (isArray(obj)) {
    return obj.map((v) => toSnakeCase(v)) as any;
  } else if (isPlainObject(obj)) {
    const snakeObj = mapKeys(obj, (v, k) => snakeCase(k));
    return mapValues(snakeObj, (v) => toSnakeCase(v)) as any;
  }
  return obj;
}

/**
 * Extracts design settings from a flat snake_case DB object into a nested camelCase object.
 */
export function transformQRRoute(data: any): any {
  if (!data) return data;
  
  const camelData = toCamelCase<any>(data);
  
  // Create the nested design object
  const design = {
    fgColor: camelData.fgColor || '#FF5722',
    bgColor: camelData.bgColor || '#FFFFFF',
    borderStyle: camelData.borderStyle || 'none',
    logoUrl: camelData.logoUrl || null,
    logoPadding: camelData.logoPadding || 10,
    dotType: camelData.dotType || 'square',
    cornerType: camelData.cornerType || 'square',
    cornerDotType: camelData.cornerDotType || 'square',
    margin: camelData.margin || 0,
  };

  // Remove the flattened properties
  const { 
    fgColor, bgColor, borderStyle, logoUrl, logoPadding, 
    dotType, cornerType, cornerDotType, margin,
    ...rest 
  } = camelData;
  
  return {
    ...rest,
    design,
  };
}
