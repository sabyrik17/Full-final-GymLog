'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './muscle-detail.module.css';

const muscleData = {
  // Передняя сторона
  chest: {
    name: 'Грудные мышцы',
    description: 'Большая и малая грудные мышцы отвечают за толкающие движения верхней части тела. Они включают в себя верхнюю, среднюю и нижнюю части груди.',
    anatomy: 'Грудные мышцы состоят из большой грудной мышцы (m. pectoralis major) и малой грудной мышцы (m. pectoralis minor). Большая грудная мышца имеет три пучка: ключичный, грудинный и брюшной.',
    functions: [
      'Сведение рук перед телом',
      'Вращение плеча внутрь',
      'Опускание поднятых рук',
      'Помощь в дыхании'
    ],
    exercises: [
      { name: 'Жим лёжа', difficulty: 'Средний', equipment: 'Штанга, гантели' },
      { name: 'Разводка гантелей', difficulty: 'Лёгкий', equipment: 'Гантели' },
      { name: 'Отжимания на брусьях', difficulty: 'Сложный', equipment: 'Брусья' },
      { name: 'Жим гантелей на наклонной скамье', difficulty: 'Средний', equipment: 'Гантели, скамья' },
      { name: 'Кроссовер', difficulty: 'Средний', equipment: 'Кроссовер' }
    ],
    tips: [
      'Всегда разминка перед тренировкой груди',
      'Контролируйте движение, не бросайте вес',
      'Дышите правильно: вдох при опускании, выдох при жиме',
      'Не прогибайтесь в пояснице при жиме лёжа',
      'Тренируйте все части груди равномерно'
    ]
  },
  shoulders: {
    name: 'Плечи',
    description: 'Дельтовидная мышца состоит из трёх пучков: переднего, среднего и заднего. Они отвечают за все движения рук в плечевом суставе.',
    anatomy: 'Дельтовидная мышца (m. deltoideus) покрывает плечевой сустав. Под ней находятся надостная, подостная и другие мышцы вращательной манжеты.',
    functions: [
      'Подъём рук вперёд и в стороны',
      'Вращение плеча',
      'Стабилизация плечевого сустава',
      'Помощь в тяговых движениях'
    ],
    exercises: [
      { name: 'Жим гантелей сидя', difficulty: 'Средний', equipment: 'Гантели, скамья' },
      { name: 'Подъёмы гантелей в стороны', difficulty: 'Лёгкий', equipment: 'Гантели' },
      { name: 'Армейский жим', difficulty: 'Средний', equipment: 'Штанга' },
      { name: 'Разводка в наклоне', difficulty: 'Средний', equipment: 'Гантели' },
      { name: 'Тяга штанги к подбородку', difficulty: 'Средний', equipment: 'Штанга' }
    ],
    tips: [
      'Не игнорируйте задний пучок дельт',
      'Контролируйте вес, техника важнее',
      'Делайте разминку с лёгкими весами',
      'Избегайте читинга в жимовых упражнениях',
      'Тренируйте плечи 1-2 раза в неделю'
    ]
  },
  biceps: {
    name: 'Бицепсы',
    description: 'Бицепс состоит из двух головок и отвечает за сгибание рук в локтевом суставе.',
    anatomy: 'Двуглавая мышца плеча (m. biceps brachii) имеет длинную и короткую головки. Под ней находится плечевая мышца (m. brachialis).',
    functions: [
      'Сгибание рук в локтях',
      'Супинация предплечья',
      'Помощь в тяговых движениях'
    ],
    exercises: [
      { name: 'Сгибания рук с гантелями', difficulty: 'Лёгкий', equipment: 'Гантели' },
      { name: 'Подтягивания', difficulty: 'Сложный', equipment: 'Турник' },
      { name: 'Молотки', difficulty: 'Лёгкий', equipment: 'Гантели' },
      { name: 'Сгибания на скамье Скотта', difficulty: 'Средний', equipment: 'Гантели, скамья' },
      { name: 'Концентрированные сгибания', difficulty: 'Лёгкий', equipment: 'Гантель' }
    ],
    tips: [
      'Фокусируйтесь на полном диапазоне движения',
      'Не раскачивайтесь корпусом',
      'Делайте паузу в пиковой точке',
      'Чередуйте хваты для разных головок',
      'Тренируйте бицепс после спины'
    ]
  },
  triceps: {
    name: 'Трицепсы',
    description: 'Трицепс составляет 2/3 объёма руки и отвечает за разгибание рук в локтевом суставе.',
    anatomy: 'Трёхглавая мышца плеча (m. triceps brachii) имеет длинную, латеральную и медиальную головки.',
    functions: [
      'Разгибание рук в локтях',
      'Приведение плеча к туловищу',
      'Стабилизация локтевого сустава'
    ],
    exercises: [
      { name: 'Французский жим', difficulty: 'Средний', equipment: 'Гантель, штанга' },
      { name: 'Разгибания рук из-за головы', difficulty: 'Лёгкий', equipment: 'Гантель' },
      { name: 'Отжимания на брусьях', difficulty: 'Сложный', equipment: 'Брусья' },
      { name: 'Разгибания в кроссовере', difficulty: 'Средний', equipment: 'Кроссовер' },
      { name: 'Жим лёжа узким хватом', difficulty: 'Средний', equipment: 'Штанга' }
    ],
    tips: [
      'Тренируйте все три головки трицепса',
      'Держите локти близко к телу',
      'Контролируйте негативную фазу',
      'Не блокируйте локти полностью',
      'Трицепс можно тренировать чаще бицепса'
    ]
  },
  abs: {
    name: 'Пресс',
    description: 'Прямая мышца живота и косые мышцы образуют кора тела, отвечая за стабильность и силу.',
    anatomy: 'Прямая мышца живота (m. rectus abdominis), внешние и внутренние косые мышцы живота, поперечная мышца живота.',
    functions: [
      'Сгибание позвоночника',
      'Повороты корпуса',
      'Стабилизация корпуса',
      'Поддержка внутренних органов'
    ],
    exercises: [
      { name: 'Планка', difficulty: 'Средний', equipment: 'Без оборудования' },
      { name: 'Скручивания', difficulty: 'Лёгкий', equipment: 'Без оборудования' },
      { name: 'Подъёмы ног в висе', difficulty: 'Сложный', equipment: 'Турник' },
      { name: 'Русские скручивания', difficulty: 'Средний', equipment: 'Без оборудования' },
      { name: 'Велосипед', difficulty: 'Лёгкий', equipment: 'Без оборудования' }
    ],
    tips: [
      'Дыхание важнее количества повторений',
      'Тренируйте пресс регулярно, но не ежедневно',
      'Комбинируйте разные типы упражнений',
      'Следите за техникой, чтобы избежать травм',
      'Пресс виден только при низком проценте жира'
    ]
  },
  quadriceps: {
    name: 'Квадрицепсы',
    description: 'Четырёхглавая мышца бедра - самая крупная мышца тела, отвечающая за разгибание ног.',
    anatomy: 'Прямая мышца бедра (m. rectus femoris), латеральная широкая (m. vastus lateralis), медиальная широкая (m. vastus medialis), промежуточная широкая (m. vastus intermedius).',
    functions: [
      'Разгибание ног в коленях',
      'Сгибание бедра в тазобедренном суставе',
      'Стабилизация коленного сустава'
    ],
    exercises: [
      { name: 'Приседания', difficulty: 'Средний', equipment: 'Штанга' },
      { name: 'Жим ногами', difficulty: 'Средний', equipment: 'Машина' },
      { name: 'Выпады', difficulty: 'Средний', equipment: 'Гантели' },
      { name: 'Разгибания ног', difficulty: 'Лёгкий', equipment: 'Машина' },
      { name: 'Фронтальные приседания', difficulty: 'Сложный', equipment: 'Штанга' }
    ],
    tips: [
      'Всегда разминка коленей и бёдер',
      'Следите за положением коленей',
      'Не опускайтесь ниже параллели с полом',
      'Контролируйте вес и технику',
      'Тренируйте квадрицепсы 1-2 раза в неделю'
    ]
  },

  // Задняя сторона
  traps: {
    name: 'Трапеции',
    description: 'Трапециевидная мышца образует рельеф верхней части спины и отвечает за движения плечевого пояса.',
    anatomy: 'Трапециевидная мышца (m. trapezius) имеет верхнюю, среднюю и нижнюю части.',
    functions: [
      'Подъём плеч',
      'Сведение лопаток',
      'Стабилизация плечевого пояса',
      'Поворот головы'
    ],
    exercises: [
      { name: 'Шраги с гантелями', difficulty: 'Лёгкий', equipment: 'Гантели' },
      { name: 'Тяга штанги к подбородку', difficulty: 'Средний', equipment: 'Штанга' },
      { name: 'Подъёмы плеч в стороны', difficulty: 'Лёгкий', equipment: 'Гантели' },
      { name: 'Лицевая тяга', difficulty: 'Средний', equipment: 'Канат' },
      { name: 'Шраги со штангой', difficulty: 'Средний', equipment: 'Штанга' }
    ],
    tips: [
      'Не поднимайте плечи слишком высоко',
      'Делайте паузы в верхней точке',
      'Контролируйте движение вниз',
      'Тренируйте трапеции после основных упражнений',
      'Избегайте перетренировки'
    ]
  },
  lats: {
    name: 'Широчайшие мышцы спины',
    description: 'Крупнейшие мышцы спины, образующие V-образную форму и отвечающие за тяговые движения.',
    anatomy: 'Широчайшая мышца спины (m. latissimus dorsi) простирается от позвоночника до плечевой кости.',
    functions: [
      'Приведение рук к туловищу',
      'Разгибание и приведение плеч',
      'Внутреннее вращение плеча',
      'Помощь в дыхании'
    ],
    exercises: [
      { name: 'Подтягивания', difficulty: 'Сложный', equipment: 'Турник' },
      { name: 'Тяга верхнего блока', difficulty: 'Средний', equipment: 'Блок' },
      { name: 'Тяга гантели в наклоне', difficulty: 'Средний', equipment: 'Гантель' },
      { name: 'Тяга штанги в наклоне', difficulty: 'Средний', equipment: 'Штанга' },
      { name: 'Пулловер', difficulty: 'Средний', equipment: 'Гантель' }
    ],
    tips: [
      'Тяните лопатки вниз и вместе',
      'Не раскачивайтесь корпусом',
      'Контролируйте негативную фазу',
      'Делайте разминку перед тяжёлыми тягами',
      'Чередуйте хваты для разных углов нагрузки'
    ]
  },
  rhomboids: {
    name: 'Ромбовидные мышцы',
    description: 'Мышцы между лопатками, отвечающие за сведение лопаток и поддержание осанки.',
    anatomy: 'Большая и малая ромбовидные мышцы (m. rhomboideus major et minor) расположены под трапецией.',
    functions: [
      'Сведение лопаток',
      'Стабилизация лопаток',
      'Поддержание правильной осанки'
    ],
    exercises: [
      { name: 'Тяга гантели в наклоне', difficulty: 'Средний', equipment: 'Гантель' },
      { name: 'Обратные разводки', difficulty: 'Лёгкий', equipment: 'Гантели' },
      { name: 'Планка с лопатками', difficulty: 'Средний', equipment: 'Без оборудования' },
      { name: 'Лицевая тяга', difficulty: 'Средний', equipment: 'Канат' },
      { name: 'Тяга верхнего блока узким хватом', difficulty: 'Средний', equipment: 'Блок' }
    ],
    tips: [
      'Фокусируйтесь на сведении лопаток',
      'Держите плечи опущенными',
      'Контролируйте движение',
      'Тренируйте ромбовидные вместе со спиной',
      'Избегайте округления плеч вперёд'
    ]
  },
  glutes: {
    name: 'Ягодицы',
    description: 'Крупнейшие мышцы таза, отвечающие за мощность нижней части тела и стабилизацию.',
    anatomy: 'Большая ягодичная мышца (m. gluteus maximus), средняя (m. gluteus medius), малая (m. gluteus minimus).',
    functions: [
      'Разгибание бедра',
      'Вращение бедра наружу',
      'Стабилизация тазобедренного сустава',
      'Поддержание вертикального положения'
    ],
    exercises: [
      { name: 'Приседания', difficulty: 'Средний', equipment: 'Штанга' },
      { name: 'Ягодичный мостик', difficulty: 'Лёгкий', equipment: 'Без оборудования' },
      { name: 'Румынская тяга', difficulty: 'Средний', equipment: 'Штанга' },
      { name: 'Выпады назад', difficulty: 'Средний', equipment: 'Гантели' },
      { name: 'Отведение ноги в сторону', difficulty: 'Лёгкий', equipment: 'Машина' }
    ],
    tips: [
      'Активируйте ягодицы в каждом повторении',
      'Не округляйте спину',
      'Контролируйте движение',
      'Тренируйте ягодицы 2 раза в неделю',
      'Комбинируйте с упражнениями на ноги'
    ]
  },
  hamstrings: {
    name: 'Бицепсы бедра',
    description: 'Мышцы задней поверхности бедра, отвечающие за сгибание ног и стабилизацию коленей.',
    anatomy: 'Двуглавая мышца бедра (m. biceps femoris), полусухожильная (m. semitendinosus), полуперепончатая (m. semimembranosus).',
    functions: [
      'Сгибание ног в коленях',
      'Разгибание бедра',
      'Стабилизация коленного сустава'
    ],
    exercises: [
      { name: 'Румынская тяга', difficulty: 'Средний', equipment: 'Штанга' },
      { name: 'Сгибания ног лёжа', difficulty: 'Лёгкий', equipment: 'Машина' },
      { name: 'Мёртвая тяга', difficulty: 'Сложный', equipment: 'Штанга' },
      { name: 'Норвежский хаммер', difficulty: 'Средний', equipment: 'Машина' },
      { name: 'Ягодичный мостик на одной ноге', difficulty: 'Средний', equipment: 'Без оборудования' }
    ],
    tips: [
      'Разминка обязательна для задней поверхности',
      'Контролируйте колени, не давайте им выходить вперёд',
      'Делайте паузы в растянутом положении',
      'Тренируйте бицепсы бедра вместе с квадрицепсами',
      'Избегайте перегрузки коленей'
    ]
  }
};

const muscleAliases = {
  'front-shoulders': 'shoulders',
  'rear-shoulders': 'shoulders',
  abdominals: 'abs',
  quads: 'quadriceps',
  'traps-back': 'traps',
};

const extraMuscleData = {
  obliques: {
    name: 'Косые мышцы живота',
    description: 'Косые мышцы отвечают за повороты корпуса, боковые наклоны и стабильность талии.',
    anatomy: 'Наружные и внутренние косые мышцы живота расположены по бокам корпуса и работают вместе с прямой и поперечной мышцами живота.',
    functions: ['Поворот корпуса', 'Боковое сгибание туловища', 'Стабилизация позвоночника', 'Поддержка корпуса при приседаниях и тягах'],
    exercises: [
      { name: 'Русский твист', difficulty: 'Средний', equipment: 'Мяч или без оборудования' },
      { name: 'Боковая планка', difficulty: 'Средний', equipment: 'Без оборудования' },
      { name: 'Косые скручивания', difficulty: 'Лёгкий', equipment: 'Без оборудования' },
      { name: 'Pallof press', difficulty: 'Средний', equipment: 'Кроссовер или резинка' },
      { name: 'Дровосек в кроссовере', difficulty: 'Средний', equipment: 'Кроссовер' }
    ],
    tips: ['Держите корпус напряжённым во всём движении', 'Не тяните шею руками во время скручиваний', 'Работайте медленно, без рывков', 'Добавляйте упражнения на анти-ротацию', 'Тренируйте косые вместе с общим кором']
  },
  lowerback: {
    name: 'Поясница',
    description: 'Мышцы поясницы помогают разгибать спину, удерживать корпус и безопасно выполнять тяги.',
    anatomy: 'Основная группа - разгибатели позвоночника. Они идут вдоль позвоночного столба и поддерживают нейтральное положение спины.',
    functions: ['Разгибание позвоночника', 'Стабилизация корпуса', 'Поддержка таза и спины', 'Помощь в тяговых движениях'],
    exercises: [
      { name: 'Гиперэкстензия', difficulty: 'Лёгкий', equipment: 'Скамья для гиперэкстензии' },
      { name: 'Мёртвая тяга', difficulty: 'Сложный', equipment: 'Штанга' },
      { name: 'Доброе утро', difficulty: 'Средний', equipment: 'Штанга' },
      { name: 'Bird dog', difficulty: 'Лёгкий', equipment: 'Без оборудования' },
      { name: 'Румынская тяга', difficulty: 'Средний', equipment: 'Штанга или гантели' }
    ],
    tips: ['Держите спину нейтральной', 'Не гонитесь за весом, пока техника нестабильна', 'Разогревайте тазобедренные суставы', 'Контролируйте движение вниз', 'Останавливайтесь при резкой боли']
  },
  'calves-back': {
    name: 'Икроножные мышцы',
    description: 'Икроножные мышцы отвечают за подъём на носки, работу голеностопа и стабильность при ходьбе, беге и прыжках.',
    anatomy: 'Икры включают икроножную и камбаловидную мышцы. Икроножная активнее работает стоя, камбаловидная - при согнутом колене.',
    functions: ['Подъём пятки', 'Стабилизация голеностопа', 'Отталкивание при ходьбе и беге', 'Помощь в прыжках'],
    exercises: [
      { name: 'Подъёмы на носки стоя', difficulty: 'Лёгкий', equipment: 'Тренажёр или гантели' },
      { name: 'Подъёмы на носки сидя', difficulty: 'Лёгкий', equipment: 'Тренажёр' },
      { name: 'Подъёмы на одной ноге', difficulty: 'Средний', equipment: 'Без оборудования или гантель' },
      { name: 'Жим носками в тренажёре', difficulty: 'Средний', equipment: 'Жим ногами' },
      { name: 'Прыжки на скакалке', difficulty: 'Средний', equipment: 'Скакалка' }
    ],
    tips: ['Работайте в полной амплитуде', 'Делайте паузу в верхней точке', 'Не пружиньте слишком быстро', 'Комбинируйте варианты стоя и сидя', 'Следите за устойчивостью стопы']
  }
};

const resolveMuscleData = (muscleId) => {
  return muscleData[muscleId] || extraMuscleData[muscleId] || muscleData[muscleAliases[muscleId]];
};

export default function MuscleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const muscleId = params.muscleId;
  const [muscle, setMuscle] = useState(null);

  useEffect(() => {
    const resolvedMuscle = resolveMuscleData(muscleId);

    if (muscleId && resolvedMuscle) {
      setMuscle(resolvedMuscle);
    } else {
      router.push('/atlas');
    }
  }, [muscleId, router]);

  if (!muscle) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Лёгкий': return '#22c55e';
      case 'Средний': return '#f59e0b';
      case 'Сложный': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <Link href="/atlas" className={styles.backButton}>
          ← Назад к атласу
        </Link>
        <h1>{muscle.name}</h1>
        <div className={styles.headerActions}>
          <button className={styles.favoriteBtn}>
            ★ Добавить в избранное
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.overview}>
          <div className={styles.description}>
            <h2>Описание</h2>
            <p>{muscle.description}</p>
          </div>

          <div className={styles.anatomy}>
            <h2>Анатомия</h2>
            <p>{muscle.anatomy}</p>
          </div>

          <div className={styles.functions}>
            <h2>Функции</h2>
            <ul>
              {muscle.functions.map((func, index) => (
                <li key={index}>{func}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.exercises}>
          <h2>Рекомендуемые упражнения</h2>
          <div className={styles.exerciseGrid}>
            {muscle.exercises.map((exercise, index) => (
              <div key={index} className={styles.exerciseCard}>
                <div className={styles.exerciseHeader}>
                  <h3>{exercise.name}</h3>
                  <span
                    className={styles.difficulty}
                    style={{ backgroundColor: getDifficultyColor(exercise.difficulty) }}
                  >
                    {exercise.difficulty}
                  </span>
                </div>
                <p className={styles.equipment}>
                  <strong>Оборудование:</strong> {exercise.equipment}
                </p>
                <button className={styles.addToWorkoutBtn}>
                  + Добавить в тренировку
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.tips}>
          <h2>Полезные советы</h2>
          <div className={styles.tipsGrid}>
            {muscle.tips.map((tip, index) => (
              <div key={index} className={styles.tipCard}>
                <div className={styles.tipNumber}>{index + 1}</div>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
