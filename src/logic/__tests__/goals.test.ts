import { GOALS, GOAL_DEFAULTS, isValidGoalSelection, toggleGoal } from '../goals';

describe('GOAL_DEFAULTS', () => {
  it('has defaults for every goal with consistent ranges', () => {
    for (const goal of GOALS) {
      const d = GOAL_DEFAULTS[goal];
      for (const r of [d.reps, d.sets, d.restSec, d.rir]) {
        expect(r.min).toBeLessThanOrEqual(r.max);
      }
    }
  });

  it('matches SPEC §5 for strength', () => {
    expect(GOAL_DEFAULTS.strength).toMatchObject({
      reps: { min: 3, max: 6 },
      sets: { min: 4, max: 5 },
      restSec: { min: 150, max: 240 },
      tempo: '2-1-X-0',
    });
  });

  it('marks only mobility as time-based', () => {
    expect(GOALS.filter((g) => GOAL_DEFAULTS[g].timeBased)).toEqual(['mobility']);
  });
});

describe('goal selection', () => {
  const empty = { primary: null, secondary: null };

  it('requires a primary goal', () => {
    expect(isValidGoalSelection(empty)).toBe(false);
    expect(isValidGoalSelection({ primary: 'strength', secondary: null })).toBe(true);
    expect(isValidGoalSelection({ primary: 'strength', secondary: 'strength' })).toBe(false);
  });

  it('first tap sets primary, second sets additional', () => {
    const one = toggleGoal(empty, 'strength');
    expect(one).toEqual({ primary: 'strength', secondary: null });
    expect(toggleGoal(one, 'fat_loss')).toEqual({ primary: 'strength', secondary: 'fat_loss' });
  });

  it('third goal replaces additional, keeping max 2', () => {
    const two = { primary: 'strength' as const, secondary: 'fat_loss' as const };
    expect(toggleGoal(two, 'mobility')).toEqual({ primary: 'strength', secondary: 'mobility' });
  });

  it('removing primary promotes additional', () => {
    const two = { primary: 'strength' as const, secondary: 'fat_loss' as const };
    expect(toggleGoal(two, 'strength')).toEqual({ primary: 'fat_loss', secondary: null });
    expect(toggleGoal(two, 'fat_loss')).toEqual({ primary: 'strength', secondary: null });
  });
});
