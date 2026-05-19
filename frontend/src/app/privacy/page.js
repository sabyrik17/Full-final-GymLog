import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
      <section className="card">
        <h1>Политика конфиденциальности</h1>
        <p>
          GymLog хранит данные аккаунта и тренировок только для работы личного дневника,
          статистики и социальных функций внутри приложения.
        </p>
        <p>
          В демо-версии проекта эта страница служит понятной точкой перехода для кнопок
          и ссылок. Подробные юридические условия можно расширить перед публикацией.
        </p>
        <Link href="/" className="btn btn-primary">
          На главную
        </Link>
      </section>
    </main>
  );
}
