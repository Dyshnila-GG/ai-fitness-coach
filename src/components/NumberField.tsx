import { useState } from 'react';

import { TextField } from './TextField';

type Props = {
  label?: string;
  value: number | null;
  onChange: (value: number | null) => void;
  suffix?: string;
  decimals?: number;
  error?: string | null;
  testID?: string;
  className?: string;
};

function format(value: number | null, decimals: number): string {
  if (value === null) return '';
  return String(Number(value.toFixed(decimals)));
}

export function parseNumber(text: string): number | null {
  const normalized = text.replace(',', '.').trim();
  if (normalized === '' || !/^\d*\.?\d*$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Numeric input that keeps the user's raw text while typing ("80," → 80). */
export function NumberField({
  label,
  value,
  onChange,
  suffix,
  decimals = 1,
  error,
  testID,
  className,
}: Props) {
  const [text, setText] = useState(() => format(value, decimals));
  const [lastValue, setLastValue] = useState(value);

  // Sync when the value changes from outside (e.g. unit switch).
  if (value !== lastValue) {
    setLastValue(value);
    if (value !== parseNumber(text)) setText(format(value, decimals));
  }

  return (
    <TextField
      testID={testID}
      className={className}
      label={label}
      value={text}
      suffix={suffix}
      error={error}
      keyboardType={decimals > 0 ? 'decimal-pad' : 'number-pad'}
      maxLength={6}
      onChangeText={(next) => {
        setText(next);
        const parsed = parseNumber(next);
        setLastValue(parsed);
        onChange(parsed);
      }}
    />
  );
}
