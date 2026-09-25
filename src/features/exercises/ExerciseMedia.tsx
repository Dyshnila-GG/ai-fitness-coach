import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';

/** Start / end frames alternate to show the movement. */
export const MEDIA_FRAME_MS = 800;

/** Render with `key={exercise.id}` so frame state resets when the exercise changes. */
type Props = { urls: readonly string[] };

export function ExerciseMedia({ urls }: Props) {
  const { t } = useTranslation();
  const [frame, setFrame] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (urls.length < 2) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % urls.length), MEDIA_FRAME_MS);
    return () => clearInterval(id);
  }, [urls]);

  if (urls.length === 0 || failed) {
    return (
      <View
        testID="exercise-media-placeholder"
        className="aspect-[4/3] w-full items-center justify-center rounded-2xl border border-border bg-surface"
      >
        <Text className="text-4xl">🏋️</Text>
        <Text className="mt-2 text-sm text-muted">{t('exercises.noMedia')}</Text>
      </View>
    );
  }

  return (
    <View className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white">
      {/* Both frames stay mounted so switching does not reload images. */}
      {urls.map((uri, i) => (
        <Image
          key={uri}
          testID={`exercise-media-frame-${i}`}
          source={{ uri }}
          resizeMode="contain"
          onError={() => setFailed(true)}
          accessibilityElementsHidden={i !== frame}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: i === frame ? 1 : 0,
          }}
        />
      ))}
    </View>
  );
}
