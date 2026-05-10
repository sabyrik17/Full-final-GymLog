'use client';

import Link from 'next/link';
import styles from './landing.module.css';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <h1>💪 GymLog</h1>
          </div>
          <div className={styles.navLinks}>
            <Link href="#features">Функции</Link>
            <Link href="#how-it-works">Как это работает</Link>
            <Link href="/auth/login" className="btn btn-primary">
              Начать
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2>Веди свой фитнес‑дневник</h2>
          <p>
            GymLog — это твой фитнес‑помощник. Выбирай мышцу на интерактивной схеме тела, смотри лучшие упражнения. 
            Записывай тренировки в свой дневник, следи за результатами. Так же сморти как занимаются твои друзья.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/auth/register" className="btn btn-primary">
              Начать бесплатно
            </Link>
            <Link href="#features" className="btn btn-outline">
              Узнать больше
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.placeholder}>🏋️</div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <h2>Основные возможности</h2>
        
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔍</div>
            <h3>Атлас мышц</h3>
            <p>
              Интерактивная схема тела (спереди и сзади). Нажимай на любую мышцу и смотри лучшие упражнения с деталями.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📔</div>
            <h3>Дневник тренировок</h3>
            <p>
              Записывай каждую тренировку с подходами, повторениями и весом. Автоматически отслеживай личные рекорды.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>👥</div>
            <h3>Социальные функции</h3>
            <p>
              Добавляй друзей и регулируй видимость дневника. Тренируйтесь вместе и делитесь результатами.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Статистика</h3>
            <p>
              Отслеживай личные рекорды, частоту тренировок и прогресс. Аналитика для роста результатов.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={styles.howItWorks}>
        <h2>Как это работает</h2>
        
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Создай аккаунт</h3>
            <p>Зарегистрируйся по email.</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Исследуй упражнения</h3>
            <p>Выбирай мышцы на атласе и смотри лучшие упражнения по сложности и оборудованию.</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Записывай тренировки</h3>
            <p>Добавляй упражнения, подходы, повторения и вес. Отслеживай прогресс автоматически.</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3>Подключай друзей</h3>
            <p>Добавляй друзей, делись дневником и смотри их тренировку в реальном времени.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2024 GymLog. Все права защищены.</p>
          <div className={styles.footerLinks}>
            <a href="#">Конфиденциальность</a>
            <a href="#">Условия</a>
            <a href="#">Контакты</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
