import type { HeightUnit, WeightUnit } from './profile';

const LB_PER_KG = 2.2046226218;
const CM_PER_INCH = 2.54;
const INCHES_PER_FOOT = 12;

export function kgToLb(kg: number): number {
  return kg * LB_PER_KG;
}

export function lbToKg(lb: number): number {
  return lb / LB_PER_KG;
}

export function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalInches = Math.round(cm / CM_PER_INCH);
  return { ft: Math.floor(totalInches / INCHES_PER_FOOT), in: totalInches % INCHES_PER_FOOT };
}

export function ftInToCm(ft: number, inches: number): number {
  return (ft * INCHES_PER_FOOT + inches) * CM_PER_INCH;
}

export function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

// Countries that use imperial units for body weight and height.
const IMPERIAL_REGIONS = new Set(['US', 'LR', 'MM']);

export function defaultUnits(regionCode: string | null | undefined): {
  weight: WeightUnit;
  height: HeightUnit;
} {
  return regionCode && IMPERIAL_REGIONS.has(regionCode.toUpperCase())
    ? { weight: 'lb', height: 'ft_in' }
    : { weight: 'kg', height: 'cm' };
}
