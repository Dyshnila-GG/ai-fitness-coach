import type { ProfileDraft } from '@/features/profile/types';

export type StepProps = {
  draft: ProfileDraft;
  update: (patch: Partial<ProfileDraft>) => void;
};
