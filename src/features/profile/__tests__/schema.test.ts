import { toSavePayload } from '../schema';
import { completeDraft } from '../__fixtures__/draft';

describe('toSavePayload', () => {
  it('builds the RPC payload with canonical rounding', () => {
    const result = toSavePayload(
      completeDraft({ limitationZones: ['knees'], limitationNote: '  deep squats  ' }),
    );
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      disclaimer_accepted: true,
      sex: 'female',
      birth_date: '1995-06-15',
      height_cm: 168,
      weight_kg: 61.23,
      locations: ['gym'],
      equipment: [],
      goals: { primary: 'fat_loss', secondary: null },
      limitations: { zones: ['knees'], note: 'deep squats' },
      metrics: { body_fat_pct: null, waist_cm: null },
    });
  });

  it('drops equipment for gym-only training', () => {
    const result = toSavePayload(completeDraft({ equipment: ['dumbbells'] }));
    expect(result.data?.equipment).toEqual([]);
  });

  it('requires equipment for home training', () => {
    expect(toSavePayload(completeDraft({ locations: ['home'] })).success).toBe(false);
    expect(
      toSavePayload(completeDraft({ locations: ['home'], equipment: ['bands'] })).success,
    ).toBe(true);
  });

  it('rejects missing answers, disclaimer and age out of range', () => {
    expect(toSavePayload(completeDraft({ sex: null })).success).toBe(false);
    expect(toSavePayload(completeDraft({ disclaimerAccepted: false })).success).toBe(false);
    const tooYoung = `${new Date().getFullYear() - 10}-01-01`;
    expect(toSavePayload(completeDraft({ birthDate: tooYoung })).success).toBe(false);
  });

  it('validates optional metrics ranges', () => {
    expect(toSavePayload(completeDraft({ bodyFatPct: 90 })).success).toBe(false);
    const ok = toSavePayload(
      completeDraft({ bodyFatPct: 18, girths: { chest: 95, waist: 70, hips: 98, biceps: 30 } }),
    );
    expect(ok.data?.metrics).toEqual({
      body_fat_pct: 18,
      chest_cm: 95,
      waist_cm: 70,
      hips_cm: 98,
      biceps_cm: 30,
    });
  });
});
