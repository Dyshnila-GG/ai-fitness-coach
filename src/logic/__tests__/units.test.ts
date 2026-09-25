import { cmToFtIn, defaultUnits, ftInToCm, kgToLb, lbToKg, roundTo } from '../units';

describe('units', () => {
  it('converts kg to lb', () => {
    expect(kgToLb(100)).toBeCloseTo(220.462, 3);
  });

  it('converts lb to kg', () => {
    expect(lbToKg(45)).toBeCloseTo(20.412, 3);
  });

  it('round-trips without drift', () => {
    expect(lbToKg(kgToLb(82.5))).toBeCloseTo(82.5, 10);
  });
});

describe('height units', () => {
  it('converts cm to ft-in', () => {
    expect(cmToFtIn(180)).toEqual({ ft: 5, in: 11 });
    expect(cmToFtIn(182.88)).toEqual({ ft: 6, in: 0 });
  });

  it('converts ft-in to cm', () => {
    expect(ftInToCm(5, 11)).toBeCloseTo(180.34, 2);
  });
});

describe('roundTo', () => {
  it('rounds to step', () => {
    expect(roundTo(80.26, 0.1)).toBeCloseTo(80.3, 10);
    expect(roundTo(81.3, 2.5)).toBe(82.5);
  });
});

describe('defaultUnits', () => {
  it('uses imperial for US', () => {
    expect(defaultUnits('US')).toEqual({ weight: 'lb', height: 'ft_in' });
    expect(defaultUnits('us')).toEqual({ weight: 'lb', height: 'ft_in' });
  });

  it('uses metric elsewhere and when unknown', () => {
    expect(defaultUnits('RU')).toEqual({ weight: 'kg', height: 'cm' });
    expect(defaultUnits('GB')).toEqual({ weight: 'kg', height: 'cm' });
    expect(defaultUnits(null)).toEqual({ weight: 'kg', height: 'cm' });
  });
});
