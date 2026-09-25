import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

import type { SavePayload } from './schema';
import type { BodyMetricsRow, GoalRow, LimitationsRow, ProfileBundle, ProfileRow } from './types';

export const profileQueryKey = (userId: string | undefined) => ['profile', userId] as const;

export async function fetchProfileBundle(userId: string): Promise<ProfileBundle> {
  const [profile, goals, limitations, metrics] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('user_goals').select('goal, priority').eq('user_id', userId),
    supabase.from('user_limitations').select('zones, note').eq('user_id', userId).maybeSingle(),
    supabase
      .from('body_metrics')
      .select('measured_at, body_fat_pct, chest_cm, waist_cm, hips_cm, biceps_cm')
      .eq('user_id', userId)
      .order('measured_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  const error = profile.error ?? goals.error ?? limitations.error ?? metrics.error;
  if (error) throw error;
  return {
    profile: profile.data as ProfileRow | null,
    goals: (goals.data ?? []) as GoalRow[],
    limitations: limitations.data as LimitationsRow | null,
    metrics: metrics.data as BodyMetricsRow | null,
  };
}

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: profileQueryKey(userId),
    queryFn: () => fetchProfileBundle(userId as string),
    enabled: !!userId,
  });
}

export function useSaveProfile(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SavePayload) => {
      const { error } = await supabase.rpc('save_onboarding', { payload });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileQueryKey(userId) }),
  });
}
