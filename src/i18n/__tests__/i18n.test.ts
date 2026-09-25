import en from '../en.json';
import ru from '../ru.json';

function keys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v !== null && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

describe('i18n resources', () => {
  it('en has the same keys as ru', () => {
    expect(keys(en).sort()).toEqual(keys(ru).sort());
  });
});
