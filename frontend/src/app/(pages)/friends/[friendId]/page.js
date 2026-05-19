'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import styles from '../friends.module.css';

export default function FriendDetailsPage() {
  const { token, isLoading } = useContext(AuthContext);
  const params = useParams();
  const router = useRouter();
  const [friend, setFriend] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router]);

  useEffect(() => {
    const loadDiary = async () => {
      if (!token || !params.friendId) return;

      try {
        const data = await fetchAPI(`/api/friends/${params.friendId}/workouts`);
        setFriend(data.friend);
        setWorkouts(data.workouts || []);
        setError('');
      } catch (err) {
        setError(err.message || 'Дневник друга недоступен');
      }
    };

    loadDiary();
  }, [token, params.friendId]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1>{friend?.name || 'Дневник друга'}</h1>
            <p>{friend?.bio || 'Здесь показываются тренировки друга, если он открыл дневник.'}</p>
          </div>
          <Link href="/friends" className="btn btn-outline">
            Назад
          </Link>
        </header>

        {error ? (
          <div className={styles.emptyState}>
            <h3>Дневник недоступен</h3>
            <p>{error}</p>
          </div>
        ) : workouts.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Тренировок пока нет</h3>
            <p>Когда друг добавит публичные тренировки, они появятся здесь.</p>
          </div>
        ) : (
          <div className={styles.friendsList}>
            {workouts.map((workout) => (
              <article className={styles.diaryCard} key={workout.id}>
                <div className={styles.diaryHeader}>
                  <div>
                    <h3>{workout.title}</h3>
                    <p>{new Date(workout.date).toLocaleDateString('ru-RU')}</p>
                  </div>
                  <span className={styles.statusPill}>{workout.exercises.length} упр.</span>
                </div>
                {workout.note && <p className={styles.diaryNote}>{workout.note}</p>}
                <div className={styles.diaryExercises}>
                  {workout.exercises.map((exercise) => (
                    <div className={styles.diaryExercise} key={exercise.id}>
                      <strong>{exercise.name}</strong>
                      <span>{exercise.sets} x {exercise.reps}{exercise.weight ? ` · ${exercise.weight} кг` : ''}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
