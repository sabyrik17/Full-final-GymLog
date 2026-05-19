'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import { readWorkoutNotes } from '@/lib/workoutNotes';
import styles from './workouts.module.css';

export default function WorkoutsPage() {
  const { token, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router]);

  useEffect(() => {
    if (!isLoading && token) {
      readWorkoutNotes()
        .then(setWorkouts)
        .catch(() => setError('Не получилось загрузить тренировки. Проверь backend.'));
    }
  }, [token, isLoading]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  const monthCount = workouts.filter((workout) => {
    const workoutDate = new Date(workout.date);
    const now = new Date();
    return workoutDate.getMonth() === now.getMonth() && workoutDate.getFullYear() === now.getFullYear();
  }).length;
  const exerciseCount = workouts.reduce((total, workout) => total + (workout.exercises?.length || 0), 0);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <p className={styles.kicker}>Календарь тренировок</p>
            <h1>Мои записи</h1>
            <p>Создавай тренировку как заметку на дату. Внутри записи можно добавлять упражнения через плюсик и менять их позже.</p>
          </div>
          <Link href="/workouts/new" className="btn btn-primary">
            Новая запись
          </Link>
        </header>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{workouts.length}</span>
            <span className={styles.statLabel}>Всего записей</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{monthCount}</span>
            <span className={styles.statLabel}>В этом месяце</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{exerciseCount}</span>
            <span className={styles.statLabel}>Упражнений</span>
          </div>
        </div>

        <div className={styles.workoutsList}>
          {error ? (
            <div className={styles.emptyState}>
              <h3>Ошибка загрузки</h3>
              <p>{error}</p>
            </div>
          ) : workouts.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>Пока нет записей</h3>
              <p>Создай первую тренировку, и она появится здесь в календарном списке.</p>
              <Link href="/workouts/new" className="btn btn-primary">
                Создать запись
              </Link>
            </div>
          ) : (
            workouts.map((workout) => {
              const date = new Date(workout.date);
              const exercises = workout.exercises || [];
              const firstExercise = exercises[0];
              const extraCount = Math.max(exercises.length - 1, 0);

              return (
                <Link key={workout.id} href={`/workouts/${workout.id}`} className={styles.workoutCard}>
                  <div className={styles.dateBadge}>
                    <span>{date.toLocaleDateString('ru-RU', { day: '2-digit' })}</span>
                    <small>{date.toLocaleDateString('ru-RU', { month: 'short' })}</small>
                  </div>
                  <div className={styles.workoutInfo}>
                    <div className={styles.workoutHeader}>
                      <h3>{workout.title}</h3>
                    </div>
                    <div className={styles.workoutMeta}>
                      <span>{date.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric' })}</span>
                      {firstExercise && (
                        <span>
                          {firstExercise.name || 'Упражнение'}
                          {extraCount > 0 ? ` +${extraCount}` : ''}
                        </span>
                      )}
                    </div>
                    {workout.note && <p className={styles.notePreview}>{workout.note}</p>}
                  </div>
                  <span className={styles.openLabel}>Изменить</span>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
