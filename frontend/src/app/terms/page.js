import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
      <section className="card">
        <h1>Условия использования</h1>
        <p>
          Используйте GymLog для ведения тренировок, просмотра упражнений и общения с друзьями.
          Не публикуйте чужие персональные данные и следите за безопасностью тренировок.
        </p>
        <p>
          Это базовая страница условий, чтобы переходы на сайте работали корректно.
        </p>
        <Link href="/register" className="btn btn-primary">
          Вернуться к регистрации
        </Link>
      </section>
    </main>
  );
}
