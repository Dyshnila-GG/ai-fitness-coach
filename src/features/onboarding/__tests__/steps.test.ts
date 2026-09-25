import { completeDraft } from '@/features/profile/__fixtures__/draft';
import { emptyDraft } from '@/features/profile/draft';
import { getOnboardingSteps } from '@/logic/onboarding';

import { STEP_CONFIG, firstIncompleteStep } from '../steps';

describe('step completion', () => {
  it('starts from the disclaimer', () => {
    const draft = emptyDraft('RU');
    expect(firstIncompleteStep(getOnboardingSteps(draft.locations), draft)).toBe('disclaimer');
  });

  it('resumes from the first unanswered step', () => {
    const draft = completeDraft({ trainingMode: null });
    expect(firstIncompleteStep(getOnboardingSteps(draft.locations), draft)).toBe('mode');
  });

  it('lands on the last step when everything is answered', () => {
    const draft = completeDraft();
    expect(firstIncompleteStep(getOnboardingSteps(draft.locations), draft)).toBe('metrics');
  });

  it('metrics are optional but must be in range when given', () => {
    expect(STEP_CONFIG.metrics.isComplete(completeDraft())).toBe(true);
    expect(STEP_CONFIG.metrics.isComplete(completeDraft({ bodyFatPct: 1 }))).toBe(false);
  });

  it('birth date must give an allowed age', () => {
    expect(STEP_CONFIG.birthDate.isComplete(completeDraft({ birthDate: '1900-01-02' }))).toBe(
      false,
    );
  });
});
