import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <main className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
      <section className="card">
        <h1>Восстановление пароля</h1>
        <p>
          Форма восстановления ещё не подключена к серверу, но кнопка теперь ведёт на
          отдельную рабочую страницу вместо неправильного адреса.
        </p>
        <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="your@email.com" />
          </div>
          <div className="flex gap-md">
            <button type="button" className="btn btn-primary">
              Отправить ссылку
            </button>
            <Link href="/login" className="btn btn-outline">
              Назад ко входу
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
