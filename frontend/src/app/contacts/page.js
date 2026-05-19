import Link from 'next/link';

export default function ContactsPage() {
  return (
    <main className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
      <section className="card">
        <h1>Контакты</h1>
        <p>
          По вопросам проекта GymLog можно написать на email@example.com.
          Здесь можно позже подключить форму обратной связи.
        </p>
        <div className="flex gap-md">
          <Link href="/" className="btn btn-primary">
            На главную
          </Link>
          <Link href="/login" className="btn btn-outline">
            Войти
          </Link>
        </div>
      </section>
    </main>
  );
}
