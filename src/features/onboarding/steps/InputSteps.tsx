import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { NumberField } from '@/components/NumberField';
import { OptionCard } from '@/components/OptionCard';
import { Segmented } from '@/components/Segmented';
import { TextField } from '@/components/TextField';
import { ageOn, birthDateBounds, isAllowedAge, toIsoDate } from '@/logic/age';
import { toggleInList } from '@/logic/onboarding';
import {
  BODY_FAT_PCT,
  GIRTHS_CM,
  HEIGHT_CM,
  LIMITATION_NOTE_MAX,
  LIMITATION_ZONES,
  WEIGHT_KG,
  type Girth,
} from '@/logic/profile';
import { cmToFtIn, ftInToCm, kgToLb, lbToKg, roundTo } from '@/logic/units';

import type { StepProps } from './types';

type Range = { min: number; max: number };

function useRangeError() {
  const { t } = useTranslation();
  return (value: number | null, range: Range) =>
    value !== null && (value < range.min || value > range.max)
      ? t('validation.range', { min: range.min, max: range.max })
      : null;
}

function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y ?? 2000, (m ?? 1) - 1, d ?? 1);
}

const DEFAULT_AGE = 25;

export function BirthDateStep({ draft, update }: StepProps) {
  const { t, i18n } = useTranslation();
  const today = new Date();
  const { min, max } = birthDateBounds(today);
  const [showIosPicker, setShowIosPicker] = useState(false);
  const value = draft.birthDate
    ? isoToDate(draft.birthDate)
    : new Date(today.getFullYear() - DEFAULT_AGE, today.getMonth(), today.getDate());
  const age = draft.birthDate ? ageOn(draft.birthDate, today) : null;

  const setDate = (date: Date | undefined) => {
    if (date) update({ birthDate: toIsoDate(date) });
  };

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value,
        mode: 'date',
        minimumDate: min,
        maximumDate: max,
        onChange: (event, date) => {
          if (event.type === 'set') setDate(date);
        },
      });
    } else {
      setShowIosPicker((shown) => !shown);
      if (!draft.birthDate) setDate(value);
    }
  };

  return (
    <>
      {draft.birthDate ? (
        <View className="items-center gap-1 rounded-2xl border border-border bg-surface py-5">
          <Text className="text-2xl font-bold text-foreground">
            {value.toLocaleDateString(i18n.language)}
          </Text>
          {age !== null ? (
            <Text className={isAllowedAge(age) ? 'text-muted' : 'text-danger'}>
              {isAllowedAge(age)
                ? t('onboarding.birthDate.age', { age })
                : t('onboarding.birthDate.invalid')}
            </Text>
          ) : null}
        </View>
      ) : null}
      <Button variant="secondary" title={t('onboarding.birthDate.pick')} onPress={open} />
      {Platform.OS === 'ios' && showIosPicker ? (
        <DateTimePicker
          value={value}
          mode="date"
          display="spinner"
          themeVariant="dark"
          locale={i18n.language}
          minimumDate={min}
          maximumDate={max}
          onChange={(_event, date) => setDate(date)}
        />
      ) : null}
    </>
  );
}

export function HeightStep({ draft, update }: StepProps) {
  const { t } = useTranslation();
  const rangeError = useRangeError();
  const ftIn = draft.heightCm === null ? null : cmToFtIn(draft.heightCm);
  const setFtIn = (ft: number | null, inches: number | null) =>
    update({ heightCm: ft === null ? null : roundTo(ftInToCm(ft, inches ?? 0), 0.1) });

  return (
    <>
      <Segmented
        options={[
          { value: 'cm', label: t('units.cm') },
          { value: 'ft_in', label: t('units.ftIn') },
        ]}
        value={draft.heightUnit}
        onChange={(heightUnit) => update({ heightUnit })}
      />
      {draft.heightUnit === 'cm' ? (
        <NumberField
          label={t('fields.height')}
          value={draft.heightCm === null ? null : Math.round(draft.heightCm)}
          onChange={(heightCm) => update({ heightCm })}
          decimals={0}
          suffix={t('units.cm')}
          error={rangeError(draft.heightCm, HEIGHT_CM)}
        />
      ) : (
        <>
          <View className="flex-row gap-3">
            <NumberField
              className="flex-1"
              label={t('fields.feet')}
              value={ftIn?.ft ?? null}
              onChange={(ft) => setFtIn(ft, ftIn?.in ?? 0)}
              decimals={0}
              suffix={t('units.ft')}
            />
            <NumberField
              className="flex-1"
              label={t('fields.inches')}
              value={ftIn?.in ?? null}
              onChange={(inches) => setFtIn(ftIn?.ft ?? 0, inches)}
              decimals={0}
              suffix={t('units.in')}
            />
          </View>
          {rangeError(draft.heightCm, HEIGHT_CM) ? (
            <Text className="text-sm text-danger">
              {/* HEIGHT_CM range expressed in whole inches. */}
              {t('validation.range', { min: '3\'4"', max: '8\'2"' })}
            </Text>
          ) : null}
        </>
      )}
    </>
  );
}

export function WeightStep({ draft, update }: StepProps) {
  const { t } = useTranslation();
  const rangeError = useRangeError();
  const isLb = draft.weightUnit === 'lb';
  const display =
    draft.weightKg === null ? null : roundTo(isLb ? kgToLb(draft.weightKg) : draft.weightKg, 0.1);
  const displayRange = isLb
    ? { min: Math.ceil(kgToLb(WEIGHT_KG.min)), max: Math.floor(kgToLb(WEIGHT_KG.max)) }
    : WEIGHT_KG;

  return (
    <>
      <Segmented
        options={[
          { value: 'kg', label: t('units.kg') },
          { value: 'lb', label: t('units.lb') },
        ]}
        value={draft.weightUnit}
        onChange={(weightUnit) => update({ weightUnit })}
      />
      <NumberField
        label={t('fields.weight')}
        value={display}
        onChange={(v) => update({ weightKg: v === null ? null : isLb ? lbToKg(v) : v })}
        suffix={isLb ? t('units.lb') : t('units.kg')}
        error={rangeError(display, displayRange)}
      />
    </>
  );
}

export function LimitationsStep({ draft, update }: StepProps) {
  const { t } = useTranslation();
  return (
    <>
      {LIMITATION_ZONES.map((zone) => (
        <OptionCard
          key={zone}
          multi
          label={t(`options.zones.${zone}`)}
          selected={draft.limitationZones.includes(zone)}
          onPress={() => update({ limitationZones: toggleInList(draft.limitationZones, zone) })}
        />
      ))}
      <TextField
        label={t('onboarding.limitations.noteLabel')}
        placeholder={t('onboarding.limitations.notePlaceholder')}
        value={draft.limitationNote}
        onChangeText={(limitationNote) => update({ limitationNote })}
        maxLength={LIMITATION_NOTE_MAX}
        multiline
      />
    </>
  );
}

const GIRTHS = Object.keys(GIRTHS_CM) as Girth[];

export function MetricsStep({ draft, update }: StepProps) {
  const { t } = useTranslation();
  const rangeError = useRangeError();
  return (
    <>
      <NumberField
        label={t('fields.bodyFat')}
        value={draft.bodyFatPct}
        onChange={(bodyFatPct) => update({ bodyFatPct })}
        suffix={t('units.pct')}
        error={rangeError(draft.bodyFatPct, BODY_FAT_PCT)}
      />
      {GIRTHS.map((girth) => (
        <NumberField
          key={girth}
          label={t(`fields.${girth}`)}
          value={draft.girths[girth]}
          onChange={(value) => update({ girths: { ...draft.girths, [girth]: value } })}
          suffix={t('units.cm')}
          error={rangeError(draft.girths[girth], GIRTHS_CM[girth])}
        />
      ))}
    </>
  );
}
