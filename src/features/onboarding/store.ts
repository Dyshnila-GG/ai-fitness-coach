import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { emptyDraft } from '@/features/profile/draft';
import type { ProfileDraft } from '@/features/profile/types';

type OnboardingState = {
  draft: ProfileDraft;
  update: (patch: Partial<ProfileDraft>) => void;
  reset: () => void;
};

const initialDraft = () => emptyDraft(getLocales()[0]?.regionCode);

/** Onboarding answers; persisted so the flow survives an app restart. */
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      draft: initialDraft(),
      update: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
      reset: () => set({ draft: initialDraft() }),
    }),
    {
      name: 'onboarding-draft',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);

/** True once the persisted draft has been restored from storage. */
export function useOnboardingHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useOnboardingStore.persist.onFinishHydration(onChange),
    () => useOnboardingStore.persist.hasHydrated(),
  );
}
