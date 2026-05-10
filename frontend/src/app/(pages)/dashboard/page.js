'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user, token, logout, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/auth/login');
    }
  }, [token, isLoading, router]);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Добро пожаловать, {user.name}!</h1>
        <button onClick={handleLogout} className="btn btn-outline">
          Выйти
        </button>
      </header>

      <div className={styles.content}>
        <section className={styles.card}>
          <h2>Профиль</h2>
          <p>Email: {user.email}</p>
          <Link href="/profile" className="btn btn-primary">
            Редактировать профиль
          </Link>
        </section>

        <section className={styles.card}>
          <h2>Тренировки</h2>
          <p>Отслеживай свои занятия</p>
          <Link href="/workouts" className="btn btn-primary">
            Все тренировки
          </Link>
        </section>

        <section className={styles.card}>
          <h2>Атлас мышц</h2>
          <p>Выбирай мышцы и смотри упражнения</p>
          <Link href="/atlas" className="btn btn-primary">
            Изучить
          </Link>
        </section>

        <section className={styles.card}>
          <h2>Друзья</h2>
          <p>Общайся и тренируйся вместе</p>
          <Link href="/friends" className="btn btn-primary">
            Управление друзьями
          </Link>
        </section>
      </div>
    </div>
  );
}
