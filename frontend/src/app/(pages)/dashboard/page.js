'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import { RealtimeContext } from '@/context/RealtimeContext';
import { readWorkoutNotes } from '@/lib/workoutNotes';
import styles from './dashboard.module.css';

const actions = [
  {
    title: 'Новая тренировка',
    text: 'Создай запись на дату и добавь упражнения через плюсик.',
    href: '/workouts/new',
    cta: 'Создать',
  },
  {
    title: 'Атлас мышц',
    text: 'Выбери мышечную группу и посмотри упражнения.',
    href: '/atlas',
    cta: 'Открыть',
  },
  {
    title: 'Друзья',
    text: 'Раздел готов под подключение API друзей без фейковых данных.',
    href: '/friends',
    cta: 'Перейти',
  },
  {
    title: 'Профиль',
    text: 'Обнови аватар, вес, рост, bio и приватность дневника.',
    href: '/profile',
    cta: 'Настроить',
  },
];

export default function DashboardPage() {
  const { user, token, logout, isLoading } = useContext(AuthContext);
  const { isConnected, onlineUsers, liveEvents } = useContext(RealtimeContext);
  const router = useRouter();
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
    if (!isLoading && token && !user) {
      router.push('/login');
    }
  }, [user, token, isLoading, router]);

  useEffect(() => {
    if (!isLoading && token) {
      readWorkoutNotes()
        .then(setWorkouts)
        .catch(() => setWorkouts([]));
    }
  }, [token, isLoading]);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!user) {
    return <div className={styles.loading}>Переход ко входу...</div>;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const monthCount = workouts.filter((workout) => {
    const workoutDate = new Date(workout.date);
    const now = new Date();
    return workoutDate.getMonth() === now.getMonth() && workoutDate.getFullYear() === now.getFullYear();
  }).length;
  const exerciseCount = workouts.reduce((total, workout) => total + (workout.exercises?.length || 0), 0);

  const stats = [
    { label: 'Записей', value: workouts.length, hint: 'в календаре' },
    { label: 'В этом месяце', value: monthCount, hint: 'создано записей' },
    { label: 'Упражнений', value: exerciseCount, hint: 'добавлено в записи' },
    { label: 'Онлайн', value: onlineUsers.length, hint: isConnected ? 'WebSocket подключен' : 'нет соединения' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>Личный кабинет</p>
            <h1>Добро пожаловать, {user.name}!</h1>
            <p className={styles.heroText}>
              Здесь твои тренировки, атлас мышц, загрузки медиа и live-активность в реальном времени.
            </p>
            <div className={styles.heroActions}>
              <Link href="/workouts/new" className="btn btn-primary">
                Новая тренировка
              </Link>
              <Link href="/atlas" className="btn btn-outline">
                Открыть атлас
              </Link>
            </div>
          </div>

          <div className={styles.profilePanel}>
            <div className={styles.avatar}>
              {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Выйти
            </button>
          </div>
        </section>

        <section className={styles.statsGrid} aria-label="Статистика">
          {stats.map((item) => (
            <div className={styles.statCard} key={item.label}>
              <span className={styles.statValue}>{item.value}</span>
              <span className={styles.statLabel}>{item.label}</span>
              <span className={styles.statHint}>{item.hint}</span>
            </div>
          ))}
        </section>

        <div className={styles.mainGrid}>
          <section className={styles.actionsGrid} aria-label="Быстрые действия">
            {actions.map((item) => (
              <Link href={item.href} className={styles.actionCard} key={item.title}>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                </div>
                <span>{item.cta}</span>
              </Link>
            ))}
          </section>

          <div className={styles.sideColumn}>
            <aside className={styles.feedPanel}>
              <div className={styles.panelHeader}>
                <h2>Онлайн</h2>
                <span className={isConnected ? styles.liveBadge : styles.offlineBadge}>
                  {isConnected ? 'live' : 'offline'}
                </span>
              </div>

              <div className={styles.onlineList}>
                {onlineUsers.length === 0 ? (
                  <div className={styles.emptyFeed}>
                    <p>Пока никого нет онлайн.</p>
                  </div>
                ) : (
                  onlineUsers.map((onlineUser) => (
                    <div className={styles.onlineItem} key={onlineUser.id}>
                      <span className={styles.onlineDot}></span>
                      <div>
                        <strong>{onlineUser.name}</strong>
                        <p>{onlineUser.isTraining ? 'тренируется сейчас' : 'в сети'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </aside>

            <aside className={styles.feedPanel}>
              <div className={styles.panelHeader}>
                <h2>Live-активность</h2>
              </div>

              <div className={styles.feedList}>
                {liveEvents.length === 0 ? (
                  <div className={styles.emptyFeed}>
                    <p>Создай или измени тренировку во второй вкладке, и событие появится здесь без перезагрузки.</p>
                  </div>
                ) : (
                  liveEvents.map((event) => (
                    <div className={styles.feedItem} key={event.id}>
                      <span className={styles.feedDot}></span>
                      <div>
                        <h3>{event.userName}</h3>
                        <p>{event.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </aside>

            <aside className={styles.feedPanel}>
              <div className={styles.panelHeader}>
                <h2>Последние записи</h2>
                <Link href="/workouts">Все</Link>
              </div>
              <div className={styles.feedList}>
                {workouts.length === 0 ? (
                  <div className={styles.emptyFeed}>
                    <p>Пока нет записей. Создай первую тренировку, и она появится здесь.</p>
                  </div>
                ) : (
                  workouts.slice(0, 3).map((item) => {
                    const firstExercise = item.exercises?.[0];

                    return (
                      <Link href={`/workouts/${item.id}`} className={styles.feedItem} key={item.id}>
                        <span className={styles.feedDot}></span>
                        <div>
                          <h3>{item.title}</h3>
                          <p>
                            {new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                            {firstExercise?.name ? ` · ${firstExercise.name}` : ''}
                          </p>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
