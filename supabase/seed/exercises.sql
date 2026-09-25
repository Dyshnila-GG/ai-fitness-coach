-- Stage 2 seed: starter exercise library (SPEC §6) and alternatives.
-- Idempotent: safe to run again in the Supabase SQL Editor after the exercises migration.
-- Media: 2 frames (start / end) from free-exercise-db (Unlicense, public domain),
-- https://github.com/yuhonas/free-exercise-db pinned to commit a859101.
-- Empty media_urls = no matching exercise there, the app shows a placeholder.

begin;

insert into public.exercises (
  id, name_ru, name_en,
  primary_muscles, secondary_muscles,
  equipment, pattern, difficulty, is_compound, is_unilateral, default_tempo,
  instructions_ru,
  instructions_en,
  mistakes_ru,
  mistakes_en,
  contraindications,
  media_urls
)
values
  (
    'barbell_bench_press', 'Жим штанги лёжа', 'Barbell bench press',
    array['chest']::text[], array['triceps', 'shoulders']::text[],
    'barbell', 'push_h', 2, true, false, '2-0-1-0',
    array[
      'Лягте на скамью, глаза под грифом, стопы плотно на полу.',
      'Сведите лопатки и слегка прогнитесь в грудном отделе.',
      'Возьмите гриф чуть шире плеч, снимите со стоек над грудью.',
      'Опустите штангу к низу груди, локти под углом ~45° к корпусу.',
      'Выжмите штангу вверх, не отрывая таз и лопатки от скамьи.'
    ],
    array[
      'Lie on the bench with eyes under the bar and feet flat on the floor.',
      'Squeeze your shoulder blades together and keep a slight upper-back arch.',
      'Grip the bar slightly wider than shoulders and unrack it over your chest.',
      'Lower the bar to the lower chest with elbows at about 45° to the torso.',
      'Press the bar up without lifting hips or shoulder blades off the bench.'
    ],
    array[
      'Локти разведены под 90° к корпусу',
      'Отбив штанги от груди',
      'Таз отрывается от скамьи'
    ],
    array[
      'Elbows flared to 90° from the torso',
      'Bouncing the bar off the chest',
      'Hips lifting off the bench'
    ],
    array['shoulders']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Barbell_Bench_Press_-_Medium_Grip/1.jpg'
    ]
  ),
  (
    'incline_dumbbell_press', 'Жим гантелей на наклонной скамье', 'Incline dumbbell press',
    array['chest']::text[], array['shoulders', 'triceps']::text[],
    'dumbbell', 'push_h', 2, true, false, '2-0-1-0',
    array[
      'Установите спинку скамьи под углом 30–45°.',
      'Сядьте, поставьте гантели на бёдра и лягте, поднимая их к плечам.',
      'Сведите лопатки, гантели по бокам верха груди.',
      'Выжмите гантели вверх, слегка сводя их над грудью.',
      'Медленно опустите до лёгкого растяжения грудных.'
    ],
    array[
      'Set the bench back to 30–45°.',
      'Sit with dumbbells on your thighs, then lie back bringing them to your shoulders.',
      'Retract your shoulder blades with dumbbells beside the upper chest.',
      'Press the dumbbells up, bringing them slightly together over the chest.',
      'Lower slowly until you feel a light stretch in the chest.'
    ],
    array[
      'Слишком крутой наклон — работают плечи',
      'Гантели ударяются вверху',
      'Неполная амплитуда'
    ],
    array[
      'Too steep an incline shifts work to shoulders',
      'Clanking dumbbells at the top',
      'Partial range of motion'
    ],
    array['shoulders']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Incline_Dumbbell_Press/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Incline_Dumbbell_Press/1.jpg'
    ]
  ),
  (
    'dumbbell_bench_press', 'Жим гантелей лёжа', 'Dumbbell bench press',
    array['chest']::text[], array['triceps', 'shoulders']::text[],
    'dumbbell', 'push_h', 2, true, false, '2-0-1-0',
    array[
      'Лягте на горизонтальную скамью с гантелями у груди.',
      'Сведите лопатки, стопы упираются в пол.',
      'Выжмите гантели вверх до почти прямых рук.',
      'Опустите гантели по дуге до уровня груди, локти ~45° к корпусу.'
    ],
    array[
      'Lie on a flat bench holding dumbbells at chest level.',
      'Retract your shoulder blades and plant your feet.',
      'Press the dumbbells up until arms are almost straight.',
      'Lower them in an arc to chest level, elbows about 45° to the torso.'
    ],
    array[
      'Локти разведены в стороны',
      'Гантели опускаются слишком низко с болью в плече'
    ],
    array[
      'Elbows flared out wide',
      'Lowering too deep with shoulder pain'
    ],
    array['shoulders']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Dumbbell_Bench_Press/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Dumbbell_Bench_Press/1.jpg'
    ]
  ),
  (
    'machine_chest_press', 'Жим в тренажёре (грудь)', 'Machine chest press',
    array['chest']::text[], array['triceps', 'shoulders']::text[],
    'machine', 'push_h', 1, true, false, '2-0-1-0',
    array[
      'Отрегулируйте сиденье: рукояти на уровне середины груди.',
      'Прижмите спину к спинке, сведите лопатки.',
      'Выжмите рукояти вперёд, не выпрямляя локти до щелчка.',
      'Медленно вернитесь до растяжения грудных.'
    ],
    array[
      'Adjust the seat so the handles are at mid-chest height.',
      'Press your back into the pad and retract your shoulder blades.',
      'Push the handles forward without locking your elbows hard.',
      'Return slowly until you feel a chest stretch.'
    ],
    array[
      'Сиденье слишком высоко или низко',
      'Плечи поднимаются к ушам'
    ],
    array[
      'Seat set too high or too low',
      'Shrugging shoulders toward the ears'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Machine_Bench_Press/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Machine_Bench_Press/1.jpg'
    ]
  ),
  (
    'cable_crossover', 'Сведения в кроссовере', 'Cable crossover',
    array['chest']::text[], array['shoulders']::text[],
    'cable', 'isolation', 2, false, false, '2-1-1-0',
    array[
      'Установите блоки выше плеч, возьмите рукояти и сделайте шаг вперёд.',
      'Слегка наклонитесь вперёд, локти немного согнуты и зафиксированы.',
      'Сведите руки по дуге перед грудью, напрягая грудные.',
      'Медленно разведите руки до растяжения грудных.'
    ],
    array[
      'Set the pulleys above shoulder height, grab the handles and step forward.',
      'Lean forward slightly with elbows softly bent and fixed.',
      'Bring your hands together in an arc in front of the chest, squeezing the pecs.',
      'Open your arms slowly until you feel a chest stretch.'
    ],
    array[
      'Сгибание локтей превращает движение в жим',
      'Рывки корпусом'
    ],
    array[
      'Bending the elbows turns it into a press',
      'Using body momentum'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Cable_Crossover/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Cable_Crossover/1.jpg'
    ]
  ),
  (
    'pec_deck', 'Бабочка (pec deck)', 'Pec deck fly',
    array['chest']::text[], array['shoulders']::text[],
    'machine', 'isolation', 1, false, false, '2-1-1-0',
    array[
      'Отрегулируйте сиденье: рукояти на уровне груди.',
      'Прижмите спину к спинке, руки слегка согнуты.',
      'Сведите рукояти перед собой, сжимая грудные.',
      'Медленно разведите до лёгкого растяжения, не заводя руки за спину.'
    ],
    array[
      'Adjust the seat so the handles are at chest height.',
      'Keep your back against the pad with arms slightly bent.',
      'Bring the handles together in front of you, squeezing the chest.',
      'Open slowly to a light stretch without letting arms go behind you.'
    ],
    array[
      'Слишком большая амплитуда назад',
      'Спина отрывается от спинки'
    ],
    array[
      'Excessive range behind the body',
      'Back leaving the pad'
    ],
    array['shoulders']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Butterfly/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Butterfly/1.jpg'
    ]
  ),
  (
    'push_up', 'Отжимания', 'Push-up',
    array['chest']::text[], array['triceps', 'shoulders', 'core']::text[],
    'bodyweight', 'push_h', 1, true, false, '2-0-1-0',
    array[
      'Упор лёжа: ладони чуть шире плеч, тело — прямая линия.',
      'Напрягите пресс и ягодицы.',
      'Опуститесь, пока грудь почти не коснётся пола, локти ~45° к корпусу.',
      'Выжмите себя вверх, сохраняя прямое тело.'
    ],
    array[
      'Get into a plank with hands slightly wider than shoulders, body in a straight line.',
      'Brace your abs and glutes.',
      'Lower until your chest nearly touches the floor, elbows about 45° to the torso.',
      'Push back up keeping your body straight.'
    ],
    array[
      'Провисание таза',
      'Неполная амплитуда',
      'Голова тянется вперёд'
    ],
    array[
      'Sagging hips',
      'Partial range of motion',
      'Head poking forward'
    ],
    array['wrists']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Pushups/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Pushups/1.jpg'
    ]
  ),
  (
    'chest_dip', 'Отжимания на брусьях (акцент грудь)', 'Chest dip',
    array['chest']::text[], array['triceps', 'shoulders']::text[],
    'bodyweight', 'push_v', 3, true, false, '2-0-1-0',
    array[
      'Упритесь на брусьях на прямых руках.',
      'Наклоните корпус вперёд на 20–30°, локти слегка в стороны.',
      'Опуститесь до угла ~90° в локтях, чувствуя растяжение груди.',
      'Выжмите себя вверх, сохраняя наклон.'
    ],
    array[
      'Support yourself on the bars with straight arms.',
      'Lean your torso forward 20–30° with elbows slightly out.',
      'Lower until elbows reach about 90°, feeling a chest stretch.',
      'Press back up keeping the forward lean.'
    ],
    array[
      'Слишком глубокое опускание',
      'Плечи поднимаются к ушам'
    ],
    array[
      'Going too deep',
      'Shoulders shrugging up'
    ],
    array['shoulders', 'elbows']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Dips_-_Chest_Version/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Dips_-_Chest_Version/1.jpg'
    ]
  ),
  (
    'pull_up', 'Подтягивания', 'Pull-up',
    array['back']::text[], array['biceps', 'forearms']::text[],
    'bodyweight', 'pull_v', 3, true, false, '2-0-1-0',
    array[
      'Повисните на турнике хватом чуть шире плеч, ладони от себя.',
      'Опустите плечи вниз, напрягите пресс.',
      'Подтянитесь, ведя локти вниз к корпусу, пока подбородок не выше перекладины.',
      'Опуститесь под контролем до почти прямых рук.'
    ],
    array[
      'Hang from the bar with an overhand grip slightly wider than shoulders.',
      'Pull your shoulders down and brace your abs.',
      'Pull up driving elbows down to your sides until the chin clears the bar.',
      'Lower under control to nearly straight arms.'
    ],
    array[
      'Раскачка и рывки ногами',
      'Неполная амплитуда внизу'
    ],
    array[
      'Swinging and kipping',
      'Not lowering fully'
    ],
    array['shoulders', 'elbows']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Pullups/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Pullups/1.jpg'
    ]
  ),
  (
    'lat_pulldown', 'Тяга верхнего блока', 'Lat pulldown',
    array['back']::text[], array['biceps']::text[],
    'cable', 'pull_v', 1, true, false, '2-0-1-0',
    array[
      'Сядьте, зафиксируйте бёдра под валиками.',
      'Возьмите рукоять хватом шире плеч.',
      'Опустите плечи и тяните рукоять к верху груди, ведя локти вниз.',
      'Медленно верните рукоять вверх до полного выпрямления рук.'
    ],
    array[
      'Sit down and lock your thighs under the pads.',
      'Grip the bar wider than shoulder width.',
      'Depress your shoulders and pull the bar to your upper chest, driving elbows down.',
      'Return the bar slowly until arms are fully extended.'
    ],
    array[
      'Сильный отклон корпуса назад',
      'Тяга за голову',
      'Рывки весом'
    ],
    array[
      'Leaning back too far',
      'Pulling behind the neck',
      'Jerking the weight'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Wide-Grip_Lat_Pulldown/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Wide-Grip_Lat_Pulldown/1.jpg'
    ]
  ),
  (
    'barbell_row', 'Тяга штанги в наклоне', 'Barbell bent-over row',
    array['back']::text[], array['biceps', 'lower_back']::text[],
    'barbell', 'pull_h', 2, true, false, '2-0-1-0',
    array[
      'Возьмите штангу хватом чуть шире плеч, колени слегка согнуты.',
      'Наклонитесь до 30–45° к полу с прямой спиной.',
      'Тяните штангу к низу живота, сводя лопатки.',
      'Опустите штангу под контролем, сохраняя наклон.'
    ],
    array[
      'Hold the bar slightly wider than shoulders with knees softly bent.',
      'Hinge forward to 30–45° to the floor with a flat back.',
      'Row the bar to your lower belly, squeezing the shoulder blades.',
      'Lower under control while keeping the hinge.'
    ],
    array[
      'Округлённая спина',
      'Корпус поднимается с каждым повтором',
      'Рывки весом'
    ],
    array[
      'Rounded back',
      'Torso rising with every rep',
      'Jerking the weight'
    ],
    array['lower_back']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Bent_Over_Barbell_Row/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Bent_Over_Barbell_Row/1.jpg'
    ]
  ),
  (
    'one_arm_dumbbell_row', 'Тяга гантели одной рукой', 'One-arm dumbbell row',
    array['back']::text[], array['biceps']::text[],
    'dumbbell', 'pull_h', 1, true, true, '2-0-1-0',
    array[
      'Упритесь коленом и рукой в скамью, спина параллельна полу.',
      'Возьмите гантель свободной рукой, рука выпрямлена.',
      'Тяните гантель к поясу, ведя локоть вдоль корпуса.',
      'Опустите гантель до растяжения широчайшей и повторите, затем смените сторону.'
    ],
    array[
      'Place one knee and hand on a bench with your back parallel to the floor.',
      'Hold a dumbbell in the free hand with the arm straight.',
      'Row the dumbbell to your hip, keeping the elbow close to the body.',
      'Lower to a lat stretch, repeat, then switch sides.'
    ],
    array[
      'Скручивание корпуса',
      'Тяга к груди вместо пояса'
    ],
    array[
      'Twisting the torso',
      'Rowing to the chest instead of the hip'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/One-Arm_Dumbbell_Row/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/One-Arm_Dumbbell_Row/1.jpg'
    ]
  ),
  (
    'seated_cable_row', 'Тяга горизонтального блока', 'Seated cable row',
    array['back']::text[], array['biceps']::text[],
    'cable', 'pull_h', 1, true, false, '2-0-1-0',
    array[
      'Сядьте, упритесь стопами, колени слегка согнуты.',
      'Возьмите рукоять, спина прямая, корпус вертикально.',
      'Тяните рукоять к животу, сводя лопатки.',
      'Медленно выпрямите руки, давая лопаткам разойтись.'
    ],
    array[
      'Sit with feet on the platform and knees slightly bent.',
      'Grab the handle with a straight back and upright torso.',
      'Pull the handle to your belly, squeezing the shoulder blades.',
      'Extend your arms slowly, letting the shoulder blades spread.'
    ],
    array[
      'Раскачка корпусом',
      'Округление спины при возврате'
    ],
    array[
      'Rocking the torso',
      'Rounding the back on the return'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Seated_Cable_Rows/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Seated_Cable_Rows/1.jpg'
    ]
  ),
  (
    'chest_supported_t_bar_row', 'Тяга Т-грифа с упором', 'Chest-supported T-bar row',
    array['back']::text[], array['biceps']::text[],
    'machine', 'pull_h', 1, true, false, '2-0-1-0',
    array[
      'Лягте грудью на упор, стопы на платформе.',
      'Возьмите рукояти, руки выпрямлены.',
      'Тяните рукояти к корпусу, сводя лопатки.',
      'Опустите вес под контролем до полного выпрямления рук.'
    ],
    array[
      'Lie chest-down on the pad with feet on the platform.',
      'Grab the handles with arms straight.',
      'Row the handles toward your torso, squeezing the shoulder blades.',
      'Lower under control until arms are fully extended.'
    ],
    array[
      'Грудь отрывается от упора',
      'Неполная амплитуда'
    ],
    array[
      'Chest lifting off the pad',
      'Partial range of motion'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Lying_T-Bar_Row/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Lying_T-Bar_Row/1.jpg'
    ]
  ),
  (
    'cable_pullover', 'Пуловер в блоке', 'Cable pullover',
    array['back']::text[], array['triceps', 'core']::text[],
    'cable', 'isolation', 2, false, false, '2-1-1-0',
    array[
      'Встаньте лицом к верхнему блоку, возьмите прямую рукоять или канат.',
      'Наклонитесь вперёд, руки почти прямые над головой.',
      'Опустите рукоять по дуге к бёдрам, напрягая широчайшие.',
      'Медленно верните руки вверх до растяжения.'
    ],
    array[
      'Face the high pulley and grab a straight bar or rope.',
      'Hinge forward slightly with arms almost straight overhead.',
      'Sweep the handle in an arc down to your thighs, squeezing the lats.',
      'Return slowly to a stretch overhead.'
    ],
    array[
      'Сгибание локтей — движение превращается в разгибание трицепса',
      'Рывки корпусом'
    ],
    array[
      'Bending the elbows turns it into a triceps pushdown',
      'Using body momentum'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Straight-Arm_Pulldown/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Straight-Arm_Pulldown/1.jpg'
    ]
  ),
  (
    'overhead_press', 'Армейский жим', 'Overhead press',
    array['shoulders']::text[], array['triceps', 'core']::text[],
    'barbell', 'push_v', 3, true, false, '2-0-1-0',
    array[
      'Снимите штангу со стоек на уровне ключиц, хват чуть шире плеч.',
      'Напрягите пресс и ягодицы, стопы на ширине бёдер.',
      'Выжмите штангу вверх, убирая голову назад, затем под гриф.',
      'Опустите штангу под контролем к ключицам.'
    ],
    array[
      'Unrack the bar at collarbone height with a grip slightly wider than shoulders.',
      'Brace your abs and glutes, feet hip-width apart.',
      'Press the bar overhead, moving your head back and then under the bar.',
      'Lower under control back to the collarbones.'
    ],
    array[
      'Сильный прогиб в пояснице',
      'Штанга уходит вперёд от лица'
    ],
    array[
      'Excessive lower-back arch',
      'Bar drifting forward away from the face'
    ],
    array['shoulders', 'lower_back']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Standing_Military_Press/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Standing_Military_Press/1.jpg'
    ]
  ),
  (
    'seated_dumbbell_press', 'Жим гантелей сидя', 'Seated dumbbell shoulder press',
    array['shoulders']::text[], array['triceps']::text[],
    'dumbbell', 'push_v', 2, true, false, '2-0-1-0',
    array[
      'Сядьте на скамью с вертикальной спинкой, гантели у плеч.',
      'Прижмите спину, напрягите пресс.',
      'Выжмите гантели вверх до почти прямых рук.',
      'Медленно опустите до уровня ушей.'
    ],
    array[
      'Sit on an upright bench with dumbbells at shoulder height.',
      'Press your back into the pad and brace your abs.',
      'Press the dumbbells up until arms are almost straight.',
      'Lower slowly to ear level.'
    ],
    array[
      'Прогиб в пояснице',
      'Слишком короткая амплитуда'
    ],
    array[
      'Arching the lower back',
      'Too short a range of motion'
    ],
    array['shoulders']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Seated_Dumbbell_Press/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Seated_Dumbbell_Press/1.jpg'
    ]
  ),
  (
    'machine_shoulder_press', 'Жим в тренажёре (плечи)', 'Machine shoulder press',
    array['shoulders']::text[], array['triceps']::text[],
    'machine', 'push_v', 1, true, false, '2-0-1-0',
    array[
      'Отрегулируйте сиденье: рукояти на уровне плеч.',
      'Прижмите спину к спинке.',
      'Выжмите рукояти вверх, не блокируя локти.',
      'Медленно опустите до уровня плеч.'
    ],
    array[
      'Adjust the seat so the handles are at shoulder height.',
      'Keep your back against the pad.',
      'Press the handles up without locking your elbows.',
      'Lower slowly to shoulder level.'
    ],
    array[
      'Плечи поднимаются к ушам',
      'Спина отрывается от спинки'
    ],
    array[
      'Shrugging shoulders up',
      'Back leaving the pad'
    ],
    array['shoulders']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Machine_Shoulder_Military_Press/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Machine_Shoulder_Military_Press/1.jpg'
    ]
  ),
  (
    'dumbbell_lateral_raise', 'Махи гантелями в стороны', 'Dumbbell lateral raise',
    array['shoulders']::text[], '{}',
    'dumbbell', 'isolation', 1, false, false, '2-0-1-0',
    array[
      'Встаньте прямо, гантели по бокам, локти слегка согнуты.',
      'Поднимите руки в стороны до уровня плеч, ведя движение локтями.',
      'Задержитесь на мгновение вверху.',
      'Медленно опустите гантели.'
    ],
    array[
      'Stand tall with dumbbells at your sides and elbows slightly bent.',
      'Raise your arms out to shoulder height, leading with the elbows.',
      'Pause briefly at the top.',
      'Lower the dumbbells slowly.'
    ],
    array[
      'Раскачка корпусом',
      'Подъём выше плеч с подключением трапеций'
    ],
    array[
      'Swinging the torso',
      'Raising above shoulder height and shrugging'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Side_Lateral_Raise/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Side_Lateral_Raise/1.jpg'
    ]
  ),
  (
    'cable_lateral_raise', 'Махи в кроссовере', 'Cable lateral raise',
    array['shoulders']::text[], '{}',
    'cable', 'isolation', 1, false, false, '2-0-1-0',
    array[
      'Встаньте боком к нижнему блоку, рукоять в дальней руке.',
      'Корпус неподвижен, локоть слегка согнут.',
      'Поднимите руку в сторону до уровня плеча.',
      'Медленно опустите, сохраняя натяжение троса.'
    ],
    array[
      'Stand side-on to a low pulley holding the handle in the far hand.',
      'Keep your torso still and elbow slightly bent.',
      'Raise your arm out to shoulder height.',
      'Lower slowly, keeping tension on the cable.'
    ],
    array[
      'Наклон корпуса в сторону',
      'Слишком большой вес'
    ],
    array[
      'Leaning the torso sideways',
      'Using too much weight'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Cable_Seated_Lateral_Raise/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Cable_Seated_Lateral_Raise/1.jpg'
    ]
  ),
  (
    'reverse_fly', 'Обратные разведения', 'Reverse dumbbell fly',
    array['shoulders']::text[], array['back']::text[],
    'dumbbell', 'isolation', 1, false, false, '2-1-1-0',
    array[
      'Наклонитесь вперёд почти параллельно полу, спина прямая.',
      'Гантели под грудью, локти слегка согнуты.',
      'Разведите руки в стороны до уровня корпуса, работая задними дельтами.',
      'Медленно опустите гантели.'
    ],
    array[
      'Hinge forward until almost parallel to the floor with a flat back.',
      'Hold dumbbells under your chest with elbows slightly bent.',
      'Raise your arms out to the sides to torso level using the rear delts.',
      'Lower the dumbbells slowly.'
    ],
    array[
      'Сведение лопаток вместо работы задних дельт',
      'Рывки корпусом'
    ],
    array[
      'Squeezing shoulder blades instead of using rear delts',
      'Jerking the torso'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Reverse_Flyes/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Reverse_Flyes/1.jpg'
    ]
  ),
  (
    'face_pull', 'Тяга каната к лицу (face pull)', 'Face pull',
    array['shoulders']::text[], array['back']::text[],
    'cable', 'isolation', 1, false, false, '2-1-1-0',
    array[
      'Установите блок на уровне лица, возьмите канат хватом сверху.',
      'Отойдите на шаг, руки выпрямлены вперёд.',
      'Тяните канат к лицу, разводя концы и уводя локти в стороны-назад.',
      'Задержитесь и медленно вернитесь.'
    ],
    array[
      'Set the pulley at face height and grab the rope with an overhand grip.',
      'Step back with arms extended in front.',
      'Pull the rope to your face, spreading the ends and driving elbows out and back.',
      'Pause and return slowly.'
    ],
    array[
      'Отклон корпуса назад',
      'Тяга к груди вместо лица'
    ],
    array[
      'Leaning back',
      'Pulling to the chest instead of the face'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Face_Pull/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Face_Pull/1.jpg'
    ]
  ),
  (
    'barbell_curl', 'Подъём штанги на бицепс', 'Barbell curl',
    array['biceps']::text[], array['forearms']::text[],
    'barbell', 'isolation', 1, false, false, '2-0-1-0',
    array[
      'Встаньте прямо, штанга в опущенных руках хватом снизу на ширине плеч.',
      'Прижмите локти к корпусу.',
      'Согните руки, поднимая штангу к груди.',
      'Медленно опустите до полного выпрямления рук.'
    ],
    array[
      'Stand tall holding the bar with an underhand, shoulder-width grip.',
      'Pin your elbows to your sides.',
      'Curl the bar up toward your chest.',
      'Lower slowly until your arms are fully straight.'
    ],
    array[
      'Раскачка корпусом',
      'Локти уходят вперёд'
    ],
    array[
      'Swinging the torso',
      'Elbows drifting forward'
    ],
    array['wrists', 'elbows']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Barbell_Curl/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Barbell_Curl/1.jpg'
    ]
  ),
  (
    'dumbbell_curl', 'Подъём гантелей на бицепс', 'Dumbbell curl',
    array['biceps']::text[], array['forearms']::text[],
    'dumbbell', 'isolation', 1, false, false, '2-0-1-0',
    array[
      'Встаньте прямо, гантели по бокам, ладони вперёд.',
      'Локти прижаты к корпусу.',
      'Согните руки, поднимая гантели к плечам.',
      'Медленно опустите до прямых рук.'
    ],
    array[
      'Stand tall with dumbbells at your sides, palms forward.',
      'Keep your elbows pinned to your sides.',
      'Curl the dumbbells up to your shoulders.',
      'Lower slowly to straight arms.'
    ],
    array[
      'Раскачка корпусом',
      'Неполное разгибание внизу'
    ],
    array[
      'Swinging the torso',
      'Not extending fully at the bottom'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Dumbbell_Bicep_Curl/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Dumbbell_Bicep_Curl/1.jpg'
    ]
  ),
  (
    'hammer_curl', 'Молотки', 'Hammer curl',
    array['biceps']::text[], array['forearms']::text[],
    'dumbbell', 'isolation', 1, false, false, '2-0-1-0',
    array[
      'Встаньте прямо, гантели по бокам, ладони смотрят друг на друга.',
      'Локти прижаты к корпусу.',
      'Согните руки, сохраняя нейтральный хват.',
      'Медленно опустите гантели.'
    ],
    array[
      'Stand tall with dumbbells at your sides, palms facing each other.',
      'Keep your elbows pinned to your sides.',
      'Curl the weights up keeping the neutral grip.',
      'Lower the dumbbells slowly.'
    ],
    array[
      'Раскачка корпусом',
      'Локти уходят вперёд'
    ],
    array[
      'Swinging the torso',
      'Elbows drifting forward'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Hammer_Curls/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Hammer_Curls/1.jpg'
    ]
  ),
  (
    'incline_dumbbell_curl', 'Подъём гантелей на наклонной скамье', 'Incline dumbbell curl',
    array['biceps']::text[], array['forearms']::text[],
    'dumbbell', 'isolation', 2, false, false, '2-0-1-0',
    array[
      'Установите спинку скамьи под 45–60° и сядьте, прижав спину.',
      'Руки с гантелями свободно висят вниз.',
      'Согните руки, не выводя локти вперёд.',
      'Медленно опустите до полного растяжения бицепса.'
    ],
    array[
      'Set the bench to 45–60° and sit with your back against it.',
      'Let your arms hang straight down with the dumbbells.',
      'Curl the weights without moving your elbows forward.',
      'Lower slowly to a full biceps stretch.'
    ],
    array[
      'Локти уходят вперёд',
      'Плечи отрываются от спинки'
    ],
    array[
      'Elbows moving forward',
      'Shoulders leaving the bench'
    ],
    array['shoulders']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Incline_Dumbbell_Curl/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Incline_Dumbbell_Curl/1.jpg'
    ]
  ),
  (
    'cable_curl', 'Подъём на бицепс на блоке', 'Cable curl',
    array['biceps']::text[], array['forearms']::text[],
    'cable', 'isolation', 1, false, false, '2-0-1-0',
    array[
      'Встаньте лицом к нижнему блоку, возьмите прямую рукоять хватом снизу.',
      'Локти прижаты к корпусу.',
      'Согните руки, подтягивая рукоять к груди.',
      'Медленно опустите, сохраняя натяжение троса.'
    ],
    array[
      'Face a low pulley and grab a straight bar with an underhand grip.',
      'Pin your elbows to your sides.',
      'Curl the bar up toward your chest.',
      'Lower slowly keeping tension on the cable.'
    ],
    array[
      'Отклон корпуса назад',
      'Локти уходят вперёд'
    ],
    array[
      'Leaning back',
      'Elbows drifting forward'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Standing_Biceps_Cable_Curl/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Standing_Biceps_Cable_Curl/1.jpg'
    ]
  ),
  (
    'preacher_curl', 'Подъём на скамье Скотта', 'Preacher curl',
    array['biceps']::text[], array['forearms']::text[],
    'barbell', 'isolation', 1, false, false, '3-0-1-0',
    array[
      'Сядьте за скамью Скотта, трицепсы плотно на подушке.',
      'Возьмите EZ-гриф хватом снизу.',
      'Согните руки, поднимая гриф к плечам.',
      'Медленно опустите, не выпрямляя локти рывком до конца.'
    ],
    array[
      'Sit at the preacher bench with triceps flat on the pad.',
      'Take an EZ bar with an underhand grip.',
      'Curl the bar up toward your shoulders.',
      'Lower slowly without snapping the elbows straight.'
    ],
    array[
      'Резкое опускание внизу',
      'Отрыв локтей от подушки'
    ],
    array[
      'Dropping fast at the bottom',
      'Lifting elbows off the pad'
    ],
    array['elbows']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Preacher_Curl/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Preacher_Curl/1.jpg'
    ]
  ),
  (
    'close_grip_bench_press', 'Жим штанги узким хватом', 'Close-grip bench press',
    array['triceps']::text[], array['chest', 'shoulders']::text[],
    'barbell', 'push_h', 2, true, false, '2-0-1-0',
    array[
      'Лягте на скамью, возьмите гриф хватом на ширине плеч.',
      'Сведите лопатки, стопы на полу.',
      'Опустите штангу к низу груди, локти вдоль корпуса.',
      'Выжмите штангу вверх за счёт трицепсов.'
    ],
    array[
      'Lie on the bench and grip the bar at shoulder width.',
      'Retract your shoulder blades with feet on the floor.',
      'Lower the bar to the lower chest with elbows close to the body.',
      'Press the bar up by driving with the triceps.'
    ],
    array[
      'Слишком узкий хват — нагрузка на запястья',
      'Локти разведены в стороны'
    ],
    array[
      'Grip too narrow, straining the wrists',
      'Elbows flaring out'
    ],
    array['wrists', 'elbows']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Close-Grip_Barbell_Bench_Press/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Close-Grip_Barbell_Bench_Press/1.jpg'
    ]
  ),
  (
    'cable_pushdown', 'Разгибания на блоке', 'Cable triceps pushdown',
    array['triceps']::text[], '{}',
    'cable', 'isolation', 1, false, false, '2-0-1-0',
    array[
      'Встаньте лицом к верхнему блоку, возьмите рукоять или канат.',
      'Прижмите локти к корпусу, слегка наклонитесь вперёд.',
      'Разогните руки вниз до полного выпрямления.',
      'Медленно верните рукоять, не отводя локти.'
    ],
    array[
      'Face a high pulley and grab a bar or rope.',
      'Pin your elbows to your sides and lean forward slightly.',
      'Extend your arms down until fully straight.',
      'Return slowly without moving your elbows.'
    ],
    array[
      'Локти двигаются вперёд-назад',
      'Подключение корпуса'
    ],
    array[
      'Elbows moving back and forth',
      'Using the torso to push'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Triceps_Pushdown/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Triceps_Pushdown/1.jpg'
    ]
  ),
  (
    'skull_crusher', 'Французский жим лёжа', 'Lying triceps extension (skull crusher)',
    array['triceps']::text[], '{}',
    'barbell', 'isolation', 2, false, false, '3-0-1-0',
    array[
      'Лягте на скамью, EZ-гриф на прямых руках над грудью.',
      'Зафиксируйте плечи, локти направлены вверх.',
      'Согните руки, опуская гриф ко лбу или за голову.',
      'Разогните руки до исходного положения.'
    ],
    array[
      'Lie on a bench holding an EZ bar with straight arms over your chest.',
      'Fix your upper arms with elbows pointing up.',
      'Bend your elbows to lower the bar toward your forehead or behind your head.',
      'Extend your arms back to the start.'
    ],
    array[
      'Локти разводятся в стороны',
      'Плечи двигаются — работает грудь'
    ],
    array[
      'Elbows flaring out',
      'Upper arms moving, turning it into a press'
    ],
    array['elbows']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/EZ-Bar_Skullcrusher/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/EZ-Bar_Skullcrusher/1.jpg'
    ]
  ),
  (
    'overhead_cable_extension', 'Разгибание из-за головы на блоке', 'Overhead cable triceps extension',
    array['triceps']::text[], '{}',
    'cable', 'isolation', 2, false, false, '2-0-1-0',
    array[
      'Встаньте спиной к блоку, канат за головой, шаг вперёд.',
      'Локти направлены вперёд и зафиксированы.',
      'Разогните руки вперёд-вверх до полного выпрямления.',
      'Медленно верните канат за голову до растяжения трицепса.'
    ],
    array[
      'Stand facing away from the pulley with the rope behind your head, one foot forward.',
      'Point your elbows forward and keep them fixed.',
      'Extend your arms forward and up until fully straight.',
      'Return the rope slowly behind your head to a triceps stretch.'
    ],
    array[
      'Локти расходятся в стороны',
      'Прогиб в пояснице'
    ],
    array[
      'Elbows flaring out',
      'Arching the lower back'
    ],
    array['elbows', 'shoulders']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Cable_Rope_Overhead_Triceps_Extension/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Cable_Rope_Overhead_Triceps_Extension/1.jpg'
    ]
  ),
  (
    'triceps_dip', 'Отжимания на брусьях (акцент трицепс)', 'Triceps dip',
    array['triceps']::text[], array['chest', 'shoulders']::text[],
    'bodyweight', 'push_v', 3, true, false, '2-0-1-0',
    array[
      'Упритесь на брусьях на прямых руках.',
      'Держите корпус вертикально, локти вдоль тела.',
      'Опуститесь до угла ~90° в локтях.',
      'Выжмите себя вверх до прямых рук.'
    ],
    array[
      'Support yourself on the bars with straight arms.',
      'Keep your torso upright and elbows close to the body.',
      'Lower until your elbows reach about 90°.',
      'Press back up to straight arms.'
    ],
    array[
      'Слишком глубокое опускание',
      'Плечи поднимаются к ушам'
    ],
    array[
      'Going too deep',
      'Shoulders shrugging up'
    ],
    array['shoulders', 'elbows']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Dips_-_Triceps_Version/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Dips_-_Triceps_Version/1.jpg'
    ]
  ),
  (
    'close_grip_push_up', 'Отжимания узким хватом', 'Close-grip push-up',
    array['triceps']::text[], array['chest', 'shoulders']::text[],
    'bodyweight', 'push_h', 2, true, false, '2-0-1-0',
    array[
      'Упор лёжа, ладони под плечами или чуть уже.',
      'Тело — прямая линия, пресс напряжён.',
      'Опуститесь, ведя локти вдоль корпуса.',
      'Выжмите себя вверх за счёт трицепсов.'
    ],
    array[
      'Get into a plank with hands under your shoulders or slightly narrower.',
      'Keep your body in a straight line with abs braced.',
      'Lower yourself keeping elbows close to the body.',
      'Press back up driving with the triceps.'
    ],
    array[
      'Локти разводятся в стороны',
      'Провисание таза'
    ],
    array[
      'Elbows flaring out',
      'Sagging hips'
    ],
    array['wrists', 'elbows']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Push-Ups_-_Close_Triceps_Position/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Push-Ups_-_Close_Triceps_Position/1.jpg'
    ]
  ),
  (
    'back_squat', 'Присед со штангой', 'Barbell back squat',
    array['quads', 'glutes']::text[], array['hamstrings', 'lower_back', 'core']::text[],
    'barbell', 'squat', 3, true, false, '3-0-1-0',
    array[
      'Положите штангу на верх трапеций, снимите со стоек и отойдите на шаг.',
      'Стопы на ширине плеч, носки слегка развёрнуты.',
      'Вдохните, напрягите пресс и опуститесь, отводя таз назад и сгибая колени.',
      'Опуститесь до параллели бёдер с полом или ниже с прямой спиной.',
      'Встаньте, толкаясь всей стопой, колени идут по направлению носков.'
    ],
    array[
      'Place the bar on your upper traps, unrack it and step back.',
      'Stand with feet shoulder-width apart, toes slightly out.',
      'Breathe in, brace and descend by sitting back and bending the knees.',
      'Go to thighs parallel with the floor or lower with a neutral back.',
      'Drive up through the whole foot, knees tracking over the toes.'
    ],
    array[
      'Колени заваливаются внутрь',
      'Округление поясницы внизу',
      'Пятки отрываются от пола'
    ],
    array[
      'Knees caving in',
      'Lower back rounding at the bottom',
      'Heels lifting off the floor'
    ],
    array['knees', 'lower_back']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Barbell_Squat/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Barbell_Squat/1.jpg'
    ]
  ),
  (
    'front_squat', 'Фронтальный присед', 'Front squat',
    array['quads']::text[], array['glutes', 'core']::text[],
    'barbell', 'squat', 3, true, false, '3-0-1-0',
    array[
      'Положите штангу на передние дельты, локти высоко вперёд.',
      'Стопы на ширине плеч, корпус вертикально.',
      'Присядьте, сохраняя локти высоко и спину прямой.',
      'Встаньте, толкаясь всей стопой.'
    ],
    array[
      'Rest the bar on your front delts with elbows high and forward.',
      'Stand with feet shoulder-width apart and torso upright.',
      'Squat down keeping elbows high and back straight.',
      'Stand up driving through the whole foot.'
    ],
    array[
      'Локти опускаются — штанга скатывается',
      'Корпус заваливается вперёд'
    ],
    array[
      'Elbows dropping so the bar rolls forward',
      'Torso collapsing forward'
    ],
    array['knees', 'wrists']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Front_Barbell_Squat/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Front_Barbell_Squat/1.jpg'
    ]
  ),
  (
    'leg_press', 'Жим ногами', 'Leg press',
    array['quads', 'glutes']::text[], array['hamstrings']::text[],
    'machine', 'squat', 1, true, false, '3-0-1-0',
    array[
      'Сядьте в тренажёр, спина и таз прижаты к спинке.',
      'Стопы на платформе на ширине плеч.',
      'Снимите платформу с упоров и опустите её, сгибая колени до ~90°.',
      'Выжмите платформу, не выпрямляя колени до щелчка.'
    ],
    array[
      'Sit in the machine with back and hips against the pad.',
      'Place your feet shoulder-width apart on the platform.',
      'Release the safeties and lower the platform, bending knees to about 90°.',
      'Press the platform up without locking your knees.'
    ],
    array[
      'Таз отрывается от сиденья внизу',
      'Полное выпрямление коленей с блокировкой'
    ],
    array[
      'Hips lifting off the seat at the bottom',
      'Locking the knees out hard'
    ],
    array['knees']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Leg_Press/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Leg_Press/1.jpg'
    ]
  ),
  (
    'hack_squat', 'Гакк-присед', 'Hack squat',
    array['quads']::text[], array['glutes']::text[],
    'machine', 'squat', 2, true, false, '3-0-1-0',
    array[
      'Встаньте в тренажёр, спина к подушке, плечи под упорами.',
      'Стопы на платформе на ширине плеч.',
      'Снимите с упоров и присядьте до параллели или ниже.',
      'Выжмите себя вверх, не блокируя колени.'
    ],
    array[
      'Step into the machine with your back on the pad and shoulders under the pads.',
      'Place your feet shoulder-width apart on the platform.',
      'Release the safeties and squat to parallel or below.',
      'Drive back up without locking the knees.'
    ],
    array[
      'Колени заваливаются внутрь',
      'Пятки отрываются от платформы'
    ],
    array[
      'Knees caving in',
      'Heels lifting off the platform'
    ],
    array['knees']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Hack_Squat/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Hack_Squat/1.jpg'
    ]
  ),
  (
    'bulgarian_split_squat', 'Болгарские выпады', 'Bulgarian split squat',
    array['quads', 'glutes']::text[], array['hamstrings']::text[],
    'dumbbell', 'lunge', 2, true, true, '2-0-1-0',
    array[
      'Встаньте спиной к скамье, носок задней ноги положите на скамью.',
      'Возьмите гантели в опущенные руки.',
      'Опуститесь, сгибая переднюю ногу, пока бедро не станет параллельно полу.',
      'Встаньте, толкаясь пяткой передней ноги, затем смените ногу.'
    ],
    array[
      'Stand with your back to a bench and rest the rear foot on it.',
      'Hold dumbbells at your sides.',
      'Lower by bending the front leg until the thigh is parallel to the floor.',
      'Drive up through the front heel, then switch legs.'
    ],
    array[
      'Передняя нога слишком близко к скамье',
      'Колено заваливается внутрь'
    ],
    array[
      'Front foot too close to the bench',
      'Knee caving in'
    ],
    array['knees']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Split_Squat_with_Dumbbells/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Split_Squat_with_Dumbbells/1.jpg'
    ]
  ),
  (
    'leg_extension', 'Разгибания ног', 'Leg extension',
    array['quads']::text[], '{}',
    'machine', 'isolation', 1, false, false, '2-1-1-0',
    array[
      'Сядьте в тренажёр, валик на нижней части голени.',
      'Ось вращения тренажёра — на уровне коленей.',
      'Разогните ноги до почти прямых, задержитесь на мгновение.',
      'Медленно опустите вес.'
    ],
    array[
      'Sit in the machine with the pad on your lower shins.',
      'Align the machine pivot with your knees.',
      'Extend your legs until almost straight and pause briefly.',
      'Lower the weight slowly.'
    ],
    array[
      'Рывки весом',
      'Таз отрывается от сиденья'
    ],
    array[
      'Jerking the weight',
      'Hips lifting off the seat'
    ],
    array['knees']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Leg_Extensions/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Leg_Extensions/1.jpg'
    ]
  ),
  (
    'goblet_squat', 'Гоблет-присед', 'Goblet squat',
    array['quads', 'glutes']::text[], array['core']::text[],
    'dumbbell', 'squat', 1, true, false, '3-0-1-0',
    array[
      'Держите гантель или гирю вертикально у груди.',
      'Стопы чуть шире плеч, носки слегка развёрнуты.',
      'Присядьте между коленей, спина прямая, локти внутри коленей.',
      'Встаньте, толкаясь всей стопой.'
    ],
    array[
      'Hold a dumbbell or kettlebell vertically at your chest.',
      'Stand with feet slightly wider than shoulders, toes turned out.',
      'Squat down between your knees with a straight back, elbows inside the knees.',
      'Stand up driving through the whole foot.'
    ],
    array[
      'Корпус заваливается вперёд',
      'Пятки отрываются от пола'
    ],
    array[
      'Torso collapsing forward',
      'Heels lifting off the floor'
    ],
    array['knees']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Goblet_Squat/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Goblet_Squat/1.jpg'
    ]
  ),
  (
    'lunge', 'Выпады', 'Dumbbell lunge',
    array['quads', 'glutes']::text[], array['hamstrings']::text[],
    'dumbbell', 'lunge', 2, true, true, '2-0-1-0',
    array[
      'Встаньте прямо, гантели в опущенных руках.',
      'Сделайте широкий шаг вперёд.',
      'Опуститесь, пока заднее колено почти не коснётся пола.',
      'Оттолкнитесь передней ногой и вернитесь в стойку, чередуйте ноги.'
    ],
    array[
      'Stand tall holding dumbbells at your sides.',
      'Take a long step forward.',
      'Lower until the back knee nearly touches the floor.',
      'Push off the front foot back to standing, alternating legs.'
    ],
    array[
      'Короткий шаг — колено уходит далеко за носок',
      'Корпус наклоняется вперёд'
    ],
    array[
      'Short step pushing the knee far past the toes',
      'Leaning the torso forward'
    ],
    array['knees']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Dumbbell_Lunges/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Dumbbell_Lunges/1.jpg'
    ]
  ),
  (
    'romanian_deadlift', 'Румынская тяга', 'Romanian deadlift',
    array['hamstrings', 'glutes']::text[], array['lower_back']::text[],
    'barbell', 'hinge', 2, true, false, '3-0-1-0',
    array[
      'Встаньте прямо со штангой в руках, хват на ширине плеч.',
      'Слегка согните колени и зафиксируйте их.',
      'Отводите таз назад, опуская штангу вдоль ног с прямой спиной.',
      'Опуститесь до сильного растяжения задней поверхности бедра.',
      'Вернитесь, толкая таз вперёд и напрягая ягодицы.'
    ],
    array[
      'Stand tall holding the bar with a shoulder-width grip.',
      'Bend your knees slightly and keep them fixed.',
      'Push your hips back, sliding the bar down your legs with a flat back.',
      'Descend until you feel a strong hamstring stretch.',
      'Return by driving your hips forward and squeezing the glutes.'
    ],
    array[
      'Округлённая спина',
      'Штанга уходит от ног',
      'Приседание вместо наклона'
    ],
    array[
      'Rounded back',
      'Bar drifting away from the legs',
      'Squatting instead of hinging'
    ],
    array['lower_back']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Romanian_Deadlift/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Romanian_Deadlift/1.jpg'
    ]
  ),
  (
    'deadlift', 'Становая тяга', 'Deadlift',
    array['hamstrings', 'glutes', 'lower_back']::text[], array['back', 'quads', 'forearms']::text[],
    'barbell', 'hinge', 3, true, false, '2-0-1-0',
    array[
      'Встаньте так, чтобы гриф был над серединой стопы.',
      'Наклонитесь и возьмите гриф хватом чуть шире ног.',
      'Опустите таз, выпрямите спину, грудь вперёд, вдохните и напрягите пресс.',
      'Поднимите штангу, выпрямляя ноги и корпус одновременно, гриф скользит по ногам.',
      'Опустите штангу тем же путём, сначала отводя таз назад.'
    ],
    array[
      'Stand with the bar over your mid-foot.',
      'Hinge down and grip the bar just outside your legs.',
      'Drop your hips, flatten your back, chest up, breathe in and brace.',
      'Lift by extending knees and hips together, keeping the bar against your legs.',
      'Lower along the same path, pushing your hips back first.'
    ],
    array[
      'Округлённая спина',
      'Таз поднимается быстрее плеч',
      'Рывок штанги с пола'
    ],
    array[
      'Rounded back',
      'Hips rising faster than shoulders',
      'Jerking the bar off the floor'
    ],
    array['lower_back']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Barbell_Deadlift/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Barbell_Deadlift/1.jpg'
    ]
  ),
  (
    'lying_leg_curl', 'Сгибания ног лёжа', 'Lying leg curl',
    array['hamstrings']::text[], array['calves']::text[],
    'machine', 'isolation', 1, false, false, '2-1-1-0',
    array[
      'Лягте на тренажёр лицом вниз, валик над пятками.',
      'Колени чуть ниже края скамьи.',
      'Согните ноги, подтягивая валик к ягодицам.',
      'Медленно опустите до почти прямых ног.'
    ],
    array[
      'Lie face down on the machine with the pad above your heels.',
      'Keep your knees just off the edge of the bench.',
      'Curl your legs, bringing the pad toward your glutes.',
      'Lower slowly to almost straight legs.'
    ],
    array[
      'Таз отрывается от скамьи',
      'Рывки весом'
    ],
    array[
      'Hips lifting off the bench',
      'Jerking the weight'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Lying_Leg_Curls/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Lying_Leg_Curls/1.jpg'
    ]
  ),
  (
    'seated_leg_curl', 'Сгибания ног сидя', 'Seated leg curl',
    array['hamstrings']::text[], array['calves']::text[],
    'machine', 'isolation', 1, false, false, '2-1-1-0',
    array[
      'Сядьте в тренажёр, валик под нижней частью голени.',
      'Зафиксируйте бёдра верхним валиком.',
      'Согните ноги, опуская валик вниз-назад.',
      'Медленно вернитесь до почти прямых ног.'
    ],
    array[
      'Sit in the machine with the pad under your lower shins.',
      'Lock your thighs under the upper pad.',
      'Curl your legs down and back.',
      'Return slowly to almost straight legs.'
    ],
    array[
      'Неполная амплитуда',
      'Рывки весом'
    ],
    array[
      'Partial range of motion',
      'Jerking the weight'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Seated_Leg_Curl/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Seated_Leg_Curl/1.jpg'
    ]
  ),
  (
    'hip_thrust', 'Ягодичный мост со штангой (hip thrust)', 'Barbell hip thrust',
    array['glutes']::text[], array['hamstrings']::text[],
    'barbell', 'hinge', 2, true, false, '2-1-1-0',
    array[
      'Сядьте на пол, лопатки упираются в край скамьи.',
      'Положите штангу на таз (используйте мягкую накладку).',
      'Стопы на ширине плеч, голени вертикальны в верхней точке.',
      'Поднимите таз до прямой линии от плеч до колен, сожмите ягодицы.',
      'Медленно опустите таз.'
    ],
    array[
      'Sit on the floor with shoulder blades against the edge of a bench.',
      'Roll the bar over your hips (use a pad).',
      'Place feet shoulder-width apart, shins vertical at the top.',
      'Drive your hips up to a straight line from shoulders to knees and squeeze the glutes.',
      'Lower your hips slowly.'
    ],
    array[
      'Прогиб в пояснице вверху',
      'Толчок носками вместо пяток'
    ],
    array[
      'Arching the lower back at the top',
      'Pushing through toes instead of heels'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Barbell_Hip_Thrust/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Barbell_Hip_Thrust/1.jpg'
    ]
  ),
  (
    'hyperextension', 'Гиперэкстензия', 'Back extension',
    array['lower_back', 'glutes']::text[], array['hamstrings']::text[],
    'bodyweight', 'hinge', 1, false, false, '2-1-1-0',
    array[
      'Лягте в тренажёр, валики под верхом бёдер, пятки зафиксированы.',
      'Руки скрещены на груди, спина прямая.',
      'Наклонитесь вниз, сгибаясь в тазобедренных суставах.',
      'Поднимитесь до прямой линии тела, не переразгибаясь.'
    ],
    array[
      'Position yourself in the bench with pads under your upper thighs and heels locked.',
      'Cross your arms over your chest with a straight back.',
      'Bend down at the hips.',
      'Rise to a straight body line without hyperextending.'
    ],
    array[
      'Переразгибание в пояснице вверху',
      'Рывки'
    ],
    array[
      'Hyperextending the lower back at the top',
      'Jerky movement'
    ],
    array['lower_back']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Hyperextensions_Back_Extensions/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Hyperextensions_Back_Extensions/1.jpg'
    ]
  ),
  (
    'cable_kickback', 'Отведение ноги в кроссовере', 'Cable glute kickback',
    array['glutes']::text[], array['hamstrings']::text[],
    'cable', 'isolation', 1, false, true, '2-1-1-0',
    array[
      'Закрепите манжету на лодыжке и встаньте лицом к нижнему блоку.',
      'Держитесь за стойку, слегка наклонитесь вперёд.',
      'Отведите ногу назад, сжимая ягодицу, без прогиба в пояснице.',
      'Медленно верните ногу, затем смените сторону.'
    ],
    array[
      'Attach an ankle cuff and face a low pulley.',
      'Hold the frame and lean forward slightly.',
      'Kick the leg back squeezing the glute without arching the lower back.',
      'Return slowly, then switch sides.'
    ],
    array[
      'Прогиб в пояснице',
      'Раскачка корпусом'
    ],
    array[
      'Arching the lower back',
      'Swinging the torso'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/One-Legged_Cable_Kickback/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/One-Legged_Cable_Kickback/1.jpg'
    ]
  ),
  (
    'standing_calf_raise', 'Подъём на носки стоя', 'Standing calf raise',
    array['calves']::text[], '{}',
    'machine', 'isolation', 1, false, false, '2-1-1-1',
    array[
      'Встаньте в тренажёр, плечи под упорами, носки на краю платформы.',
      'Опустите пятки вниз до растяжения икр.',
      'Поднимитесь на носки максимально высоко, задержитесь.',
      'Медленно опуститесь.'
    ],
    array[
      'Stand in the machine with shoulders under the pads and toes on the platform edge.',
      'Lower your heels to a calf stretch.',
      'Rise onto your toes as high as possible and pause.',
      'Lower slowly.'
    ],
    array[
      'Пружинящие повторы без паузы',
      'Сгибание коленей'
    ],
    array[
      'Bouncing reps without a pause',
      'Bending the knees'
    ],
    array['ankles']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Standing_Calf_Raises/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Standing_Calf_Raises/1.jpg'
    ]
  ),
  (
    'seated_calf_raise', 'Подъём на носки сидя', 'Seated calf raise',
    array['calves']::text[], '{}',
    'machine', 'isolation', 1, false, false, '2-1-1-1',
    array[
      'Сядьте в тренажёр, валик на нижней части бёдер, носки на платформе.',
      'Опустите пятки до растяжения.',
      'Поднимитесь на носки максимально высоко, задержитесь.',
      'Медленно опуститесь.'
    ],
    array[
      'Sit in the machine with the pad on your lower thighs and toes on the platform.',
      'Lower your heels to a stretch.',
      'Raise onto your toes as high as possible and pause.',
      'Lower slowly.'
    ],
    array[
      'Короткая амплитуда',
      'Рывки весом'
    ],
    array[
      'Short range of motion',
      'Jerking the weight'
    ],
    array['ankles']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Seated_Calf_Raise/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Seated_Calf_Raise/1.jpg'
    ]
  ),
  (
    'leg_press_calf_raise', 'Подъём на носки в жиме ногами', 'Leg press calf raise',
    array['calves']::text[], '{}',
    'machine', 'isolation', 1, false, false, '2-1-1-1',
    array[
      'Сядьте в жим ногами, носки на нижнем краю платформы.',
      'Ноги почти прямые, колени не заблокированы.',
      'Выжмите платформу носками, вытягивая стопы.',
      'Медленно верните пятки к себе до растяжения.'
    ],
    array[
      'Sit in the leg press with the balls of your feet on the lower edge of the platform.',
      'Keep legs almost straight without locking the knees.',
      'Push the platform with your toes by pointing your feet.',
      'Slowly return to a calf stretch.'
    ],
    array[
      'Сгибание коленей',
      'Ступни соскальзывают с платформы'
    ],
    array[
      'Bending the knees',
      'Feet slipping off the platform'
    ],
    array['ankles']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Calf_Press_On_The_Leg_Press_Machine/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Calf_Press_On_The_Leg_Press_Machine/1.jpg'
    ]
  ),
  (
    'plank', 'Планка', 'Plank',
    array['core']::text[], array['shoulders']::text[],
    'bodyweight', 'core', 1, false, false, null,
    array[
      'Упритесь предплечьями в пол, локти под плечами.',
      'Выпрямите ноги, тело — прямая линия от головы до пяток.',
      'Напрягите пресс и ягодицы, дышите ровно.',
      'Удерживайте положение заданное время.'
    ],
    array[
      'Rest on your forearms with elbows under your shoulders.',
      'Straighten your legs so your body forms a line from head to heels.',
      'Brace your abs and glutes and breathe steadily.',
      'Hold the position for the set time.'
    ],
    array[
      'Провисание таза',
      'Таз поднят слишком высоко'
    ],
    array[
      'Sagging hips',
      'Hips piked too high'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Plank/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Plank/1.jpg'
    ]
  ),
  (
    'side_plank', 'Боковая планка', 'Side plank',
    array['core']::text[], array['shoulders']::text[],
    'bodyweight', 'core', 1, false, true, null,
    array[
      'Лягте на бок, упритесь предплечьем, локоть под плечом.',
      'Поднимите таз, тело — прямая линия.',
      'Удерживайте положение, затем смените сторону.'
    ],
    array[
      'Lie on your side resting on your forearm with the elbow under the shoulder.',
      'Lift your hips so your body forms a straight line.',
      'Hold the position, then switch sides.'
    ],
    array[
      'Таз опускается',
      'Корпус заваливается вперёд'
    ],
    array[
      'Hips dropping',
      'Torso rolling forward'
    ],
    array['shoulders']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Side_Bridge/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Side_Bridge/1.jpg'
    ]
  ),
  (
    'hanging_leg_raise', 'Подъём ног в висе', 'Hanging leg raise',
    array['core']::text[], array['forearms']::text[],
    'bodyweight', 'core', 3, false, false, '2-0-1-0',
    array[
      'Повисните на турнике на прямых руках.',
      'Напрягите пресс, остановите раскачку.',
      'Поднимите ноги до параллели с полом или выше, подкручивая таз.',
      'Медленно опустите ноги без раскачки.'
    ],
    array[
      'Hang from the bar with straight arms.',
      'Brace your abs and stop any swinging.',
      'Raise your legs to parallel or higher, curling the pelvis up.',
      'Lower your legs slowly without swinging.'
    ],
    array[
      'Раскачка',
      'Подъём ног только за счёт сгибателей бедра без подкручивания таза'
    ],
    array[
      'Swinging',
      'Lifting legs with hip flexors only, no pelvic curl'
    ],
    array['shoulders', 'lower_back']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Hanging_Leg_Raise/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Hanging_Leg_Raise/1.jpg'
    ]
  ),
  (
    'cable_crunch', 'Скручивания на блоке', 'Cable crunch',
    array['core']::text[], '{}',
    'cable', 'core', 1, false, false, '2-1-1-0',
    array[
      'Встаньте на колени лицом к верхнему блоку, канат у головы.',
      'Бёдра неподвижны.',
      'Скрутитесь, округляя спину и опуская локти к бёдрам.',
      'Медленно вернитесь.'
    ],
    array[
      'Kneel facing a high pulley holding the rope beside your head.',
      'Keep your hips still.',
      'Crunch down by rounding your spine and bringing elbows toward your thighs.',
      'Return slowly.'
    ],
    array[
      'Движение за счёт таза, а не пресса',
      'Тяга руками'
    ],
    array[
      'Moving from the hips instead of the abs',
      'Pulling with the arms'
    ],
    array['lower_back']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Cable_Crunch/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Cable_Crunch/1.jpg'
    ]
  ),
  (
    'ab_wheel', 'Ролик для пресса', 'Ab wheel rollout',
    array['core']::text[], array['shoulders', 'back']::text[],
    'bodyweight', 'core', 3, false, false, '3-0-1-0',
    array[
      'Встаньте на колени, возьмите ролик под плечами.',
      'Напрягите пресс, подкрутите таз.',
      'Выкатите ролик вперёд, пока держите поясницу ровной.',
      'Вернитесь, подтягивая ролик силой пресса.'
    ],
    array[
      'Kneel and hold the wheel under your shoulders.',
      'Brace your abs and tuck your pelvis.',
      'Roll forward as far as you can keep your lower back flat.',
      'Pull back using your abs.'
    ],
    array[
      'Прогиб в пояснице',
      'Слишком большая амплитуда для своего уровня'
    ],
    array[
      'Arching the lower back',
      'Rolling out further than you can control'
    ],
    array['lower_back', 'shoulders']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Ab_Roller/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Ab_Roller/1.jpg'
    ]
  ),
  (
    'dead_bug', 'Dead bug («мёртвый жук»)', 'Dead bug',
    array['core']::text[], '{}',
    'bodyweight', 'core', 1, false, false, '2-0-2-0',
    array[
      'Лягте на спину, руки вверх, ноги согнуты под 90°.',
      'Прижмите поясницу к полу.',
      'Медленно опустите противоположные руку и ногу, не отрывая поясницу.',
      'Вернитесь и повторите на другую сторону.'
    ],
    array[
      'Lie on your back with arms up and knees bent at 90°.',
      'Press your lower back into the floor.',
      'Slowly lower the opposite arm and leg without lifting your lower back.',
      'Return and repeat on the other side.'
    ],
    array[
      'Поясница отрывается от пола',
      'Слишком быстрый темп'
    ],
    array[
      'Lower back lifting off the floor',
      'Moving too fast'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Dead_Bug/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Dead_Bug/1.jpg'
    ]
  ),
  (
    'pallof_press', 'Pallof press', 'Pallof press',
    array['core']::text[], array['shoulders']::text[],
    'cable', 'core', 1, false, true, '2-2-2-0',
    array[
      'Встаньте боком к блоку на уровне груди, рукоять у груди двумя руками.',
      'Стопы на ширине плеч, пресс напряжён.',
      'Выжмите рукоять вперёд, не давая корпусу повернуться.',
      'Задержитесь и верните к груди, затем смените сторону.'
    ],
    array[
      'Stand side-on to a chest-height pulley holding the handle at your chest with both hands.',
      'Feet shoulder-width apart, abs braced.',
      'Press the handle straight out without letting your torso rotate.',
      'Pause, return to the chest, then switch sides.'
    ],
    array[
      'Поворот корпуса к блоку',
      'Слишком близко к блоку — нет натяжения'
    ],
    array[
      'Rotating toward the pulley',
      'Standing too close so there is no tension'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Pallof_Press/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Pallof_Press/1.jpg'
    ]
  ),
  (
    'treadmill', 'Беговая дорожка', 'Treadmill',
    array['full_body']::text[], array['quads', 'calves']::text[],
    'machine', 'cardio', 1, true, false, null,
    array[
      'Встаньте на дорожку, начните с ходьбы 1–2 минуты.',
      'Увеличьте скорость до комфортного бега или быстрой ходьбы.',
      'Держите корпус прямо, не держитесь за поручни.',
      'В конце снизьте скорость и пройдитесь 1–2 минуты.'
    ],
    array[
      'Step on and start walking for 1–2 minutes.',
      'Increase to a comfortable jog or brisk walk.',
      'Keep your torso upright and avoid holding the rails.',
      'Slow down and walk for 1–2 minutes at the end.'
    ],
    array[
      'Опора на поручни',
      'Слишком высокий темп в начале'
    ],
    array[
      'Leaning on the rails',
      'Starting too fast'
    ],
    array['knees', 'ankles']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Jogging_Treadmill/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Jogging_Treadmill/1.jpg'
    ]
  ),
  (
    'stationary_bike', 'Велотренажёр', 'Stationary bike',
    array['full_body']::text[], array['quads']::text[],
    'machine', 'cardio', 1, true, false, null,
    array[
      'Отрегулируйте сиденье: в нижней точке нога почти прямая.',
      'Начните с лёгкого сопротивления 1–2 минуты.',
      'Увеличьте сопротивление или темп до умеренной нагрузки.',
      'В конце снизьте нагрузку.'
    ],
    array[
      'Adjust the seat so your leg is almost straight at the bottom.',
      'Start with light resistance for 1–2 minutes.',
      'Increase resistance or cadence to a moderate effort.',
      'Ease off at the end.'
    ],
    array[
      'Сиденье слишком низко — нагрузка на колени',
      'Раскачка корпусом'
    ],
    array[
      'Seat too low, stressing the knees',
      'Rocking the torso'
    ],
    '{}',
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Bicycling_Stationary/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Bicycling_Stationary/1.jpg'
    ]
  ),
  (
    'rowing_machine', 'Гребной тренажёр', 'Rowing machine',
    array['full_body']::text[], array['back', 'quads']::text[],
    'machine', 'cardio', 2, true, false, null,
    array[
      'Сядьте, закрепите стопы, возьмите рукоять.',
      'Оттолкнитесь ногами, затем отклоните корпус и подтяните рукоять к низу груди.',
      'Вернитесь в обратном порядке: руки, корпус, ноги.',
      'Держите ровный темп и прямую спину.'
    ],
    array[
      'Sit down, strap in your feet and grab the handle.',
      'Drive with the legs, then lean back and pull the handle to your lower chest.',
      'Return in reverse order: arms, torso, legs.',
      'Keep a steady pace and a straight back.'
    ],
    array[
      'Тяга руками раньше ног',
      'Округлённая спина'
    ],
    array[
      'Pulling with arms before the legs',
      'Rounded back'
    ],
    array['lower_back']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Rowing_Stationary/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Rowing_Stationary/1.jpg'
    ]
  ),
  (
    'jump_rope', 'Скакалка', 'Jump rope',
    array['full_body']::text[], array['calves']::text[],
    'bodyweight', 'cardio', 2, true, false, null,
    array[
      'Возьмите рукояти, скакалка сзади у пяток.',
      'Вращайте скакалку запястьями, локти у корпуса.',
      'Прыгайте невысоко на носках.',
      'Начните с коротких отрезков с отдыхом.'
    ],
    array[
      'Hold the handles with the rope behind your heels.',
      'Turn the rope with your wrists, elbows close to the body.',
      'Jump low on the balls of your feet.',
      'Start with short intervals and rest in between.'
    ],
    array[
      'Высокие прыжки',
      'Вращение всей рукой'
    ],
    array[
      'Jumping too high',
      'Turning the rope with the whole arm'
    ],
    array['knees', 'ankles']::text[],
    array[
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Rope_Jumping/0.jpg',
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/a859101d633a01c4a1a920d6a8ce41dabba0705f/exercises/Rope_Jumping/1.jpg'
    ]
  ),
  (
    'joint_warmup', 'Суставная разминка (5 мин)', 'Joint warm-up (5 min)',
    array['full_body']::text[], '{}',
    'bodyweight', 'mobility', 1, false, false, null,
    array[
      'Шея: наклоны и плавные повороты головы — по 5 раз.',
      'Плечи: круговые движения вперёд и назад — по 10 раз.',
      'Локти и запястья: вращения — по 10 раз.',
      'Таз и корпус: круговые движения и наклоны — по 10 раз.',
      'Колени и голеностопы: вращения — по 10 раз на сторону.',
      'Лёгкие приседания без веса — 10 раз.'
    ],
    array[
      'Neck: tilts and slow head turns, 5 each.',
      'Shoulders: circles forward and backward, 10 each.',
      'Elbows and wrists: rotations, 10 each.',
      'Hips and torso: circles and bends, 10 each.',
      'Knees and ankles: rotations, 10 per side.',
      'Easy bodyweight squats, 10 reps.'
    ],
    array[
      'Резкие движения',
      'Пропуск проблемных суставов'
    ],
    array[
      'Jerky movements',
      'Skipping problem joints'
    ],
    '{}',
    '{}'
  )
on conflict (id) do update set
  name_ru = excluded.name_ru,
  name_en = excluded.name_en,
  primary_muscles = excluded.primary_muscles,
  secondary_muscles = excluded.secondary_muscles,
  equipment = excluded.equipment,
  pattern = excluded.pattern,
  difficulty = excluded.difficulty,
  is_compound = excluded.is_compound,
  is_unilateral = excluded.is_unilateral,
  default_tempo = excluded.default_tempo,
  instructions_ru = excluded.instructions_ru,
  instructions_en = excluded.instructions_en,
  mistakes_ru = excluded.mistakes_ru,
  mistakes_en = excluded.mistakes_en,
  contraindications = excluded.contraindications,
  media_urls = excluded.media_urls;

-- Alternatives are fully defined here: replace the whole set.
delete from public.exercise_alternatives;

insert into public.exercise_alternatives (exercise_id, alternative_id)
values
  ('barbell_bench_press', 'dumbbell_bench_press'),
  ('barbell_bench_press', 'incline_dumbbell_press'),
  ('barbell_bench_press', 'machine_chest_press'),
  ('barbell_bench_press', 'push_up'),
  ('barbell_bench_press', 'chest_dip'),
  ('dumbbell_bench_press', 'barbell_bench_press'),
  ('dumbbell_bench_press', 'incline_dumbbell_press'),
  ('dumbbell_bench_press', 'machine_chest_press'),
  ('dumbbell_bench_press', 'push_up'),
  ('dumbbell_bench_press', 'chest_dip'),
  ('incline_dumbbell_press', 'barbell_bench_press'),
  ('incline_dumbbell_press', 'dumbbell_bench_press'),
  ('incline_dumbbell_press', 'machine_chest_press'),
  ('incline_dumbbell_press', 'push_up'),
  ('incline_dumbbell_press', 'chest_dip'),
  ('machine_chest_press', 'barbell_bench_press'),
  ('machine_chest_press', 'dumbbell_bench_press'),
  ('machine_chest_press', 'incline_dumbbell_press'),
  ('machine_chest_press', 'push_up'),
  ('machine_chest_press', 'chest_dip'),
  ('push_up', 'barbell_bench_press'),
  ('push_up', 'dumbbell_bench_press'),
  ('push_up', 'incline_dumbbell_press'),
  ('push_up', 'machine_chest_press'),
  ('push_up', 'chest_dip'),
  ('chest_dip', 'barbell_bench_press'),
  ('chest_dip', 'dumbbell_bench_press'),
  ('chest_dip', 'incline_dumbbell_press'),
  ('chest_dip', 'machine_chest_press'),
  ('chest_dip', 'push_up'),
  ('cable_crossover', 'pec_deck'),
  ('pec_deck', 'cable_crossover'),
  ('pull_up', 'lat_pulldown'),
  ('lat_pulldown', 'pull_up'),
  ('lat_pulldown', 'cable_pullover'),
  ('cable_pullover', 'lat_pulldown'),
  ('barbell_row', 'one_arm_dumbbell_row'),
  ('barbell_row', 'seated_cable_row'),
  ('barbell_row', 'chest_supported_t_bar_row'),
  ('one_arm_dumbbell_row', 'barbell_row'),
  ('one_arm_dumbbell_row', 'seated_cable_row'),
  ('one_arm_dumbbell_row', 'chest_supported_t_bar_row'),
  ('seated_cable_row', 'barbell_row'),
  ('seated_cable_row', 'one_arm_dumbbell_row'),
  ('seated_cable_row', 'chest_supported_t_bar_row'),
  ('chest_supported_t_bar_row', 'barbell_row'),
  ('chest_supported_t_bar_row', 'one_arm_dumbbell_row'),
  ('chest_supported_t_bar_row', 'seated_cable_row'),
  ('overhead_press', 'seated_dumbbell_press'),
  ('overhead_press', 'machine_shoulder_press'),
  ('seated_dumbbell_press', 'overhead_press'),
  ('seated_dumbbell_press', 'machine_shoulder_press'),
  ('machine_shoulder_press', 'overhead_press'),
  ('machine_shoulder_press', 'seated_dumbbell_press'),
  ('dumbbell_lateral_raise', 'cable_lateral_raise'),
  ('cable_lateral_raise', 'dumbbell_lateral_raise'),
  ('reverse_fly', 'face_pull'),
  ('face_pull', 'reverse_fly'),
  ('barbell_curl', 'dumbbell_curl'),
  ('barbell_curl', 'hammer_curl'),
  ('barbell_curl', 'incline_dumbbell_curl'),
  ('barbell_curl', 'cable_curl'),
  ('barbell_curl', 'preacher_curl'),
  ('dumbbell_curl', 'barbell_curl'),
  ('dumbbell_curl', 'hammer_curl'),
  ('dumbbell_curl', 'incline_dumbbell_curl'),
  ('dumbbell_curl', 'cable_curl'),
  ('dumbbell_curl', 'preacher_curl'),
  ('hammer_curl', 'barbell_curl'),
  ('hammer_curl', 'dumbbell_curl'),
  ('hammer_curl', 'incline_dumbbell_curl'),
  ('hammer_curl', 'cable_curl'),
  ('hammer_curl', 'preacher_curl'),
  ('incline_dumbbell_curl', 'barbell_curl'),
  ('incline_dumbbell_curl', 'dumbbell_curl'),
  ('incline_dumbbell_curl', 'hammer_curl'),
  ('incline_dumbbell_curl', 'cable_curl'),
  ('incline_dumbbell_curl', 'preacher_curl'),
  ('cable_curl', 'barbell_curl'),
  ('cable_curl', 'dumbbell_curl'),
  ('cable_curl', 'hammer_curl'),
  ('cable_curl', 'incline_dumbbell_curl'),
  ('cable_curl', 'preacher_curl'),
  ('preacher_curl', 'barbell_curl'),
  ('preacher_curl', 'dumbbell_curl'),
  ('preacher_curl', 'hammer_curl'),
  ('preacher_curl', 'incline_dumbbell_curl'),
  ('preacher_curl', 'cable_curl'),
  ('close_grip_bench_press', 'triceps_dip'),
  ('close_grip_bench_press', 'close_grip_push_up'),
  ('triceps_dip', 'close_grip_bench_press'),
  ('triceps_dip', 'close_grip_push_up'),
  ('close_grip_push_up', 'close_grip_bench_press'),
  ('close_grip_push_up', 'triceps_dip'),
  ('cable_pushdown', 'skull_crusher'),
  ('cable_pushdown', 'overhead_cable_extension'),
  ('skull_crusher', 'cable_pushdown'),
  ('skull_crusher', 'overhead_cable_extension'),
  ('overhead_cable_extension', 'cable_pushdown'),
  ('overhead_cable_extension', 'skull_crusher'),
  ('back_squat', 'front_squat'),
  ('back_squat', 'leg_press'),
  ('back_squat', 'hack_squat'),
  ('back_squat', 'goblet_squat'),
  ('front_squat', 'back_squat'),
  ('front_squat', 'leg_press'),
  ('front_squat', 'hack_squat'),
  ('front_squat', 'goblet_squat'),
  ('leg_press', 'back_squat'),
  ('leg_press', 'front_squat'),
  ('leg_press', 'hack_squat'),
  ('leg_press', 'goblet_squat'),
  ('hack_squat', 'back_squat'),
  ('hack_squat', 'front_squat'),
  ('hack_squat', 'leg_press'),
  ('hack_squat', 'goblet_squat'),
  ('goblet_squat', 'back_squat'),
  ('goblet_squat', 'front_squat'),
  ('goblet_squat', 'leg_press'),
  ('goblet_squat', 'hack_squat'),
  ('bulgarian_split_squat', 'lunge'),
  ('lunge', 'bulgarian_split_squat'),
  ('leg_extension', 'leg_press'),
  ('leg_press', 'leg_extension'),
  ('leg_extension', 'goblet_squat'),
  ('goblet_squat', 'leg_extension'),
  ('romanian_deadlift', 'deadlift'),
  ('romanian_deadlift', 'hyperextension'),
  ('deadlift', 'romanian_deadlift'),
  ('deadlift', 'hyperextension'),
  ('hyperextension', 'romanian_deadlift'),
  ('hyperextension', 'deadlift'),
  ('hip_thrust', 'cable_kickback'),
  ('cable_kickback', 'hip_thrust'),
  ('lying_leg_curl', 'seated_leg_curl'),
  ('seated_leg_curl', 'lying_leg_curl'),
  ('standing_calf_raise', 'seated_calf_raise'),
  ('standing_calf_raise', 'leg_press_calf_raise'),
  ('seated_calf_raise', 'standing_calf_raise'),
  ('seated_calf_raise', 'leg_press_calf_raise'),
  ('leg_press_calf_raise', 'standing_calf_raise'),
  ('leg_press_calf_raise', 'seated_calf_raise'),
  ('plank', 'ab_wheel'),
  ('plank', 'dead_bug'),
  ('ab_wheel', 'plank'),
  ('ab_wheel', 'dead_bug'),
  ('dead_bug', 'plank'),
  ('dead_bug', 'ab_wheel'),
  ('side_plank', 'pallof_press'),
  ('pallof_press', 'side_plank'),
  ('hanging_leg_raise', 'cable_crunch'),
  ('cable_crunch', 'hanging_leg_raise'),
  ('treadmill', 'stationary_bike'),
  ('treadmill', 'rowing_machine'),
  ('treadmill', 'jump_rope'),
  ('stationary_bike', 'treadmill'),
  ('stationary_bike', 'rowing_machine'),
  ('stationary_bike', 'jump_rope'),
  ('rowing_machine', 'treadmill'),
  ('rowing_machine', 'stationary_bike'),
  ('rowing_machine', 'jump_rope'),
  ('jump_rope', 'treadmill'),
  ('jump_rope', 'stationary_bike'),
  ('jump_rope', 'rowing_machine');

commit;
