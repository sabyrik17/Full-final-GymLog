'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './atlas.module.css';

const muscleGroups = {
  front: [
    {
      id: 'chest',
      name: 'Грудные мышцы',
      description: 'Большая и малая грудные мышцы отвечают за толкающие движения верхней части тела.',
      exercises: ['Жим лежа', 'Разводка гантелей', 'Отжимания на брусьях'],
      path: 'M45 75 Q45 70 50 70 L70 70 Q75 70 75 75 L75 95 Q75 100 70 100 L50 100 Q45 100 45 95 Z',
      hoverPath: 'M42 72 Q42 67 47 67 L73 67 Q78 67 78 72 L78 98 Q78 103 73 103 L47 103 Q42 103 42 98 Z',
    },
    {
      id: 'pectorals',
      name: 'Ключичная часть груди',
      description: 'Верхняя часть большой грудной мышцы, отвечающая за подъем рук вперед и вверх.',
      exercises: ['Жим под углом вверх', 'Разводка на наклонной скамье'],
      path: 'M50 70 Q50 67 55 67 L65 67 Q70 67 70 70 L70 80 Q70 83 65 83 L55 83 Q50 83 50 80 Z',
      hoverPath: 'M47 67 Q47 64 52 64 L68 64 Q73 64 73 67 L73 83 Q73 86 68 86 L52 86 Q47 86 47 83 Z',
    },
    {
      id: 'sternal_pecs',
      name: 'Грудинная часть груди',
      description: 'Средняя и нижняя части большой грудной мышцы, основные толкатели в жиме лежа.',
      exercises: ['Жим лежа средним хватом', 'Кроссовер на нижних блоках'],
      path: 'M48 80 Q48 77 53 77 L67 77 Q72 77 72 80 L72 95 Q72 98 67 98 L53 98 Q48 98 48 95 Z',
      hoverPath: 'M45 77 Q45 74 50 74 L70 74 Q75 74 75 77 L75 98 Q75 101 70 101 L50 101 Q45 101 45 98 Z',
    },
    {
      id: 'shoulders',
      name: 'Дельтовидные мышцы',
      description: 'Дельты отвечают за подъем рук и вращение плеча.',
      exercises: ['Жим гантелей сидя', 'Подъемы гантелей в стороны', 'Армейский жим'],
      path: 'M30 65 Q30 60 35 60 L45 60 Q50 60 50 65 L50 75 Q50 80 45 80 L35 80 Q30 80 30 75 Z M70 65 Q70 60 75 60 L85 60 Q90 60 90 65 L90 75 Q90 80 85 80 L75 80 Q70 80 70 75 Z',
      hoverPath: 'M27 62 Q27 57 32 57 L48 57 Q53 57 53 62 L53 78 Q53 83 48 83 L32 83 Q27 83 27 78 Z M67 62 Q67 57 72 57 L88 57 Q93 57 93 62 L93 78 Q93 83 88 83 L72 83 Q67 83 67 78 Z',
    },
    {
      id: 'biceps',
      name: 'Бицепсы',
      description: 'Двуглавая мышца плеча отвечает за сгибание предплечья и супинацию.',
      exercises: ['Сгибания рук с гантелями', 'Подтягивания', 'Молотки'],
      path: 'M25 85 Q25 80 30 80 L40 80 Q45 80 45 85 L45 115 Q45 120 40 120 L30 120 Q25 120 25 115 Z M55 85 Q55 80 60 80 L70 80 Q75 80 75 85 L75 115 Q75 120 70 120 L60 120 Q55 120 55 115 Z',
      hoverPath: 'M22 82 Q22 77 27 77 L43 77 Q48 77 48 82 L48 118 Q48 123 43 123 L27 123 Q22 123 22 118 Z M52 82 Q52 77 57 77 L73 77 Q78 77 78 82 L78 118 Q78 123 73 123 L57 123 Q52 123 52 118 Z',
    },
    {
      id: 'triceps',
      name: 'Трицепсы',
      description: 'Трехглавая мышца плеча отвечает за разгибание предплечья.',
      exercises: ['Французский жим', 'Разгибания рук', 'Отжимания'],
      path: 'M20 90 Q20 85 25 85 L35 85 Q40 85 40 90 L40 130 Q40 135 35 135 L25 135 Q20 135 20 130 Z M50 90 Q50 85 55 85 L65 85 Q70 85 70 90 L70 130 Q70 135 65 135 L55 135 Q50 135 50 130 Z',
      hoverPath: 'M17 87 Q17 82 22 82 L38 82 Q43 82 43 87 L43 133 Q43 138 38 138 L22 138 Q17 138 17 133 Z M47 87 Q47 82 52 82 L68 82 Q73 82 73 87 L73 133 Q73 138 68 138 L52 138 Q47 138 47 133 Z',
    },
    {
      id: 'forearms',
      name: 'Предплечья',
      description: 'Мышцы предплечья отвечают за движения кисти и пальцев.',
      exercises: ['Сгибания запястий', 'Разгибания запястий', 'Вращение предплечья'],
      path: 'M15 125 Q15 120 20 120 L30 120 Q35 120 35 125 L35 145 Q35 150 30 150 L20 150 Q15 150 15 145 Z M45 125 Q45 120 50 120 L60 120 Q65 120 65 125 L65 145 Q65 150 60 150 L50 150 Q45 150 45 145 Z',
      hoverPath: 'M12 122 Q12 117 17 117 L33 117 Q38 117 38 122 L38 148 Q38 153 33 153 L17 153 Q12 153 12 148 Z M42 122 Q42 117 47 117 L63 117 Q68 117 68 122 L68 148 Q68 153 63 153 L47 153 Q42 153 42 148 Z',
    },
    {
      id: 'abs',
      name: 'Прямая мышца живота',
      description: 'Брюшной пресс отвечает за сгибание туловища и поддержку корпуса.',
      exercises: ['Планка', 'Скручивания', 'Подъемы ног в висе'],
      path: 'M50 105 Q50 100 55 100 L65 100 Q70 100 70 105 L70 135 Q70 140 65 140 L55 140 Q50 140 50 135 Z',
      hoverPath: 'M47 102 Q47 97 52 97 L68 97 Q73 97 73 102 L73 138 Q73 143 68 143 L52 143 Q47 143 47 138 Z',
    },
    {
      id: 'obliques',
      name: 'Косые мышцы живота',
      description: 'Косые мышцы отвечают за вращение и наклоны туловища.',
      exercises: ['Русские скручивания', 'Наклоны в стороны', 'Планка с поворотом'],
      path: 'M40 105 Q40 100 45 100 L50 100 Q55 100 55 105 L55 125 Q55 130 50 130 L45 130 Q40 130 40 125 Z M65 105 Q65 100 70 100 L75 100 Q80 100 80 105 L80 125 Q80 130 75 130 L70 130 Q65 130 65 125 Z',
      hoverPath: 'M37 102 Q37 97 42 97 L53 97 Q58 97 58 102 L58 128 Q58 133 53 133 L42 133 Q37 133 37 128 Z M62 102 Q62 97 67 97 L78 97 Q83 97 83 102 L83 128 Q83 133 78 133 L67 133 Q62 133 62 128 Z',
    },
    {
      id: 'quadriceps',
      name: 'Квадрицепсы',
      description: 'Четырехглавая мышца бедра отвечает за разгибание колена.',
      exercises: ['Приседания', 'Выпады', 'Жим ногами'],
      path: 'M48 145 Q48 140 53 140 L67 140 Q72 140 72 145 L72 195 Q72 200 67 200 L53 200 Q48 200 48 195 Z',
      hoverPath: 'M45 142 Q45 137 50 137 L70 137 Q75 137 75 142 L75 198 Q75 203 70 203 L50 203 Q45 203 45 198 Z',
    },
    {
      id: 'calves',
      name: 'Икроножные мышцы',
      description: 'Икроножная и камбаловидная мышцы отвечают за подошвенное сгибание стопы.',
      exercises: ['Подъемы на носки', 'Выпады', 'Бег'],
      path: 'M50 195 Q50 190 55 190 L65 190 Q70 190 70 195 L70 215 Q70 220 65 220 L55 220 Q50 220 50 215 Z',
      hoverPath: 'M47 192 Q47 187 52 187 L68 187 Q73 187 73 192 L73 218 Q73 223 68 223 L52 223 Q47 223 47 218 Z',
    },
  ],
  back: [
    {
      id: 'traps',
      name: 'Трапециевидные мышцы',
      description: 'Верхняя часть спины отвечает за подъем плеч и стабилизацию лопаток.',
      exercises: ['Шраги', 'Тяга штанги к подбородку', 'Подъемы плеч'],
      path: 'M35 60 Q35 55 40 55 L50 55 Q55 55 55 60 L55 70 Q55 75 50 75 L40 75 Q35 75 35 70 Z M60 60 Q60 55 65 55 L75 55 Q80 55 80 60 L80 70 Q80 75 75 75 L65 75 Q60 75 60 70 Z',
      hoverPath: 'M32 57 Q32 52 37 52 L53 52 Q58 52 58 57 L58 73 Q58 78 53 78 L37 78 Q32 78 32 73 Z M57 57 Q57 52 62 52 L78 52 Q83 52 83 57 L83 73 Q83 78 78 78 L62 78 Q57 78 57 73 Z',
    },
    {
      id: 'delts_rear',
      name: 'Задние дельты',
      description: 'Задний пучок дельт отвечает за разведение рук назад.',
      exercises: ['Разводка гантелей в наклоне', 'Обратные разводки', 'Тяга лица'],
      path: 'M25 70 Q25 65 30 65 L40 65 Q45 65 45 70 L45 85 Q45 90 40 90 L30 90 Q25 90 25 85 Z M65 70 Q65 65 70 65 L80 65 Q85 65 85 70 L85 85 Q85 90 80 90 L70 90 Q65 90 65 85 Z',
      hoverPath: 'M22 67 Q22 62 27 62 L43 62 Q48 62 48 67 L48 88 Q48 93 43 93 L27 93 Q22 93 22 88 Z M62 67 Q62 62 67 62 L83 62 Q88 62 88 67 L88 88 Q88 93 83 93 L67 93 Q62 93 62 88 Z',
    },
    {
      id: 'lats',
      name: 'Широчайшие мышцы спины',
      description: 'Крупные мышцы спины отвечают за тяговые движения.',
      exercises: ['Подтягивания', 'Тяга верхнего блока', 'Тяга гантели в наклоне'],
      path: 'M25 75 Q25 70 30 70 L40 70 Q45 70 45 75 L45 135 Q45 140 40 140 L30 140 Q25 140 25 135 Z M55 75 Q55 70 60 70 L70 70 Q75 70 75 75 L75 135 Q75 140 70 140 L60 140 Q55 140 55 135 Z',
      hoverPath: 'M22 72 Q22 67 27 67 L43 67 Q48 67 48 72 L48 138 Q48 143 43 143 L27 143 Q22 143 22 138 Z M52 72 Q52 67 57 67 L73 67 Q78 67 78 72 L78 138 Q78 143 73 143 L57 143 Q52 143 52 138 Z',
    },
    {
      id: 'rhomboids',
      name: 'Ромбовидные мышцы',
      description: 'Мышцы между лопатками отвечают за сведение лопаток.',
      exercises: ['Тяга гантели в наклоне', 'Обратные разводки', 'Планка с лопатками'],
      path: 'M40 70 Q40 65 45 65 L55 65 Q60 65 60 70 L60 90 Q60 95 55 95 L45 95 Q40 95 40 90 Z',
      hoverPath: 'M37 67 Q37 62 42 62 L58 62 Q63 62 63 67 L63 93 Q63 98 58 98 L42 98 Q37 98 37 93 Z',
    },
    {
      id: 'middle_traps',
      name: 'Средние трапеции',
      description: 'Средняя часть трапециевидных мышц помогает сводить и стабилизировать лопатки.',
      exercises: ['Шраги с гантелями', 'Тяга верхнего блока', 'Подъемы плеч'],
      path: 'M45 75 Q45 70 50 70 L60 70 Q65 70 65 75 L65 85 Q65 90 60 90 L50 90 Q45 90 45 85 Z',
      hoverPath: 'M42 72 Q42 67 47 67 L63 67 Q68 67 68 72 L68 88 Q68 93 63 93 L47 93 Q42 93 42 88 Z',
    },
    {
      id: 'lower_traps',
      name: 'Нижние трапеции',
      description: 'Нижняя часть трапециевидных мышц отвечает за опускание и контроль лопаток.',
      exercises: ['Планка', 'Обратная тяга', 'Y-подъемы'],
      path: 'M45 85 Q45 80 50 80 L60 80 Q65 80 65 85 L65 95 Q65 100 60 100 L50 100 Q45 100 45 95 Z',
      hoverPath: 'M42 82 Q42 77 47 77 L63 77 Q68 77 68 82 L68 98 Q68 103 63 103 L47 103 Q42 103 42 98 Z',
    },
    {
      id: 'glutes',
      name: 'Ягодичные мышцы',
      description: 'Ягодичные мышцы отвечают за разгибание бедра.',
      exercises: ['Приседания', 'Ягодичный мостик', 'Румынская тяга'],
      path: 'M45 135 Q45 130 50 130 L60 130 Q65 130 65 135 L65 165 Q65 170 60 170 L50 170 Q45 170 45 165 Z',
      hoverPath: 'M42 132 Q42 127 47 127 L63 127 Q68 127 68 132 L68 168 Q68 173 63 173 L47 173 Q42 173 42 168 Z',
    },
    {
      id: 'hamstrings',
      name: 'Бицепсы бедра',
      description: 'Задняя поверхность бедра отвечает за сгибание колена.',
      exercises: ['Румынская тяга', 'Сгибания ног лежа', 'Мертвая тяга'],
      path: 'M48 165 Q48 160 53 160 L57 160 Q62 160 62 165 L62 195 Q62 200 57 200 L53 200 Q48 200 48 195 Z M58 165 Q58 160 63 160 L67 160 Q72 160 72 165 L72 195 Q72 200 67 200 L63 200 Q58 200 58 195 Z',
      hoverPath: 'M45 162 Q45 157 50 157 L60 157 Q65 157 65 162 L65 198 Q65 203 60 203 L50 203 Q45 203 45 198 Z',
    },
  ],
};

const views = [
  { id: 'front', label: 'Спереди', icon: '👤' },
  { id: 'back', label: 'Сзади', icon: '🔄' },
];

export default function AtlasPage() {
  const [view, setView] = useState('front');
  const [hoveredMuscle, setHoveredMuscle] = useState(null);
  const router = useRouter();
  const currentMuscles = muscleGroups[view];

  const handleMuscleClick = (muscleId) => {
    router.push(`/atlas/${muscleId}`);
  };

  return (
    <main className={styles.pageContainer}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.subtitle}>Атлас мышц</p>
          <h1>Понимай свое тело и находи лучшие упражнения</h1>
          <p>
            Наведи курсор на мышцы, чтобы увидеть их названия. Нажми, чтобы перейти к упражнениям.
            Этот атлас поможет планировать тренировки, опираясь на прямой эффект на мышцы.
          </p>
        </div>

        <div className={styles.heroPreview}>
          <div className={styles.viewToggle}>
            {views.map((viewOption) => (
              <button
                key={viewOption.id}
                type="button"
                className={`${styles.toggleBtn} ${view === viewOption.id ? styles.active : ''}`}
                onClick={() => setView(viewOption.id)}
              >
                <span className={styles.viewIcon}>{viewOption.icon}</span>
                {viewOption.label}
              </button>
            ))}
          </div>

          <div className={styles.bodyFigure}>
            <svg viewBox="0 0 120 220" className={styles.bodySvg} aria-label="Схема тела">
              {view === 'front' ? <FrontFigure /> : <BackFigure />}

              {currentMuscles.map((muscle) => (
                <g key={muscle.id}>
                  <path
                    d={muscle.path}
                    fill="rgba(245, 158, 11, 0.3)"
                    stroke="rgba(245, 158, 11, 0.6)"
                    strokeWidth="1"
                    className={styles.musclePath}
                    onMouseEnter={() => setHoveredMuscle(muscle)}
                    onMouseLeave={() => setHoveredMuscle(null)}
                    onClick={() => handleMuscleClick(muscle.id)}
                  />
                  {hoveredMuscle?.id === muscle.id && (
                    <path
                      d={muscle.hoverPath}
                      fill="rgba(245, 158, 11, 0.5)"
                      stroke="rgba(245, 158, 11, 0.8)"
                      strokeWidth="2"
                      className={styles.muscleHover}
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>

          {hoveredMuscle && <div className={styles.muscleTooltip}>{hoveredMuscle.name}</div>}
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.selectorPanel}>
          <h2>Выбери мышечную группу</h2>
          <div className={styles.muscleList}>
            {currentMuscles.map((muscle) => (
              <button
                key={muscle.id}
                type="button"
                className={`${styles.muscleButton} ${hoveredMuscle?.id === muscle.id ? styles.active : ''}`}
                onClick={() => handleMuscleClick(muscle.id)}
                onMouseEnter={() => setHoveredMuscle(muscle)}
                onMouseLeave={() => setHoveredMuscle(null)}
              >
                {muscle.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.detailsPanel}>
          <div className={styles.detailCard}>
            {hoveredMuscle ? (
              <>
                <span className={styles.detailLabel}>Наведенная мышца</span>
                <h2>{hoveredMuscle.name}</h2>
                <p>{hoveredMuscle.description}</p>
                <div className={styles.exercisesBlock}>
                  <h3>Рекомендуемые упражнения</h3>
                  <ul>
                    {hoveredMuscle.exercises.map((exercise) => (
                      <li key={exercise} className={styles.exerciseItem}>
                        {exercise}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <span className={styles.detailLabel}>Инструкция</span>
                <h2>Наведи курсор на мышцу</h2>
                <p>
                  Наведи курсор на любую область тела на атласе слева, чтобы увидеть информацию о мышце.
                  Нажми на мышцу, чтобы перейти к подробному списку упражнений.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function FrontFigure() {
  return (
    <>
      <ellipse cx="60" cy="25" rx="12" ry="15" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <rect x="54" y="35" width="12" height="8" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <path d="M46 45 C50 38 70 38 74 45 C74 55 70 58 60 58 C50 58 46 55 46 45 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
      <path d="M49 55 C56 48 64 48 71 55" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M50 58 C47 68 47 78 50 88 C52 90 58 90 60 88 C62 90 68 90 70 88 C73 78 73 68 70 58" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M54 68 C54 78 54 88 54 98" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M66 68 C66 78 66 88 66 98" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M48 70 C42 90 42 110 48 125" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M72 70 C78 90 78 110 72 125" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M42 123 C48 115 52 107 53 95" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M78 123 C72 115 68 107 67 95" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M37 50 C40 48 43 46 48 46" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M83 50 C80 48 77 46 72 46" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M25 50 C25 70 25 88 25 95 C25 105 28 110 30 112" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M95 50 C95 70 95 88 95 95 C95 105 92 110 90 112" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M44 105 C47 100 54 100 60 105 C66 100 73 100 76 105" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M50 145 C50 132 55 130 60 140 C65 130 70 132 70 145" fill="none" stroke="#94a3b8" strokeWidth="1" />
    </>
  );
}

function BackFigure() {
  return (
    <>
      <ellipse cx="60" cy="25" rx="12" ry="15" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <rect x="54" y="35" width="12" height="8" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <path d="M46 45 C50 38 70 38 74 45 C74 60 70 65 60 65 C50 65 46 60 46 45 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
      <path d="M52 53 C56 58 64 58 68 53" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M47 48 C43 62 42 72 44 85 C46 90 50 92 53 95" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M73 48 C77 62 78 72 76 85 C74 90 70 92 67 95" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M60 55 L60 85" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M57 90 L57 190" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M63 90 L63 190" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M49 70 C45 90 45 110 49 130" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M71 70 C75 90 75 110 71 130" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M41 50 C44 58 47 62 50 65" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <path d="M79 50 C76 58 73 62 70 65" fill="none" stroke="#94a3b8" strokeWidth="1" />
    </>
  );
}
