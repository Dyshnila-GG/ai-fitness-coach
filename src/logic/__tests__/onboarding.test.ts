import {
  ONBOARDING_STEPS,
  getOnboardingSteps,
  isOptionalStep,
  needsEquipment,
  toggleEquipment,
  toggleInList,
} from '../onboarding';

describe('onboarding steps', () => {
  it('skips equipment for gym only', () => {
    expect(needsEquipment(['gym'])).toBe(false);
    expect(getOnboardingSteps(['gym'])).not.toContain('equipment');
  });

  it('asks equipment for home or outdoor', () => {
    expect(getOnboardingSteps(['gym', 'home'])).toEqual([...ONBOARDING_STEPS]);
    expect(getOnboardingSteps(['outdoor'])).toContain('equipment');
  });

  it('only limitations and metrics are optional', () => {
    expect(ONBOARDING_STEPS.filter(isOptionalStep)).toEqual(['limitations', 'metrics']);
  });
});

describe('toggleEquipment', () => {
  it('adds and removes items', () => {
    expect(toggleEquipment([], 'dumbbells')).toEqual(['dumbbells']);
    expect(toggleEquipment(['dumbbells'], 'dumbbells')).toEqual([]);
  });

  it('"none" is exclusive', () => {
    expect(toggleEquipment(['dumbbells', 'bench'], 'none')).toEqual(['none']);
    expect(toggleEquipment(['none'], 'bands')).toEqual(['bands']);
  });
});

describe('toggleInList', () => {
  it('toggles membership', () => {
    expect(toggleInList(['gym'], 'home')).toEqual(['gym', 'home']);
    expect(toggleInList(['gym', 'home'], 'gym')).toEqual(['home']);
  });
});
