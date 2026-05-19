'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, token, logout } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Главная', href: '/dashboard', icon: 'home' },
    { name: 'Атлас', href: '/atlas', icon: 'muscle' },
    { name: 'Упражнения', href: '/exercises', icon: 'workout' },
    { name: 'Тренировки', href: '/workouts', icon: 'workout' },
    { name: 'Друзья', href: '/friends', icon: 'users' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAuthPage || !token) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/dashboard" className={styles.logo}>
            <span className={styles.logoIcon}>GL</span>
            <span className={styles.logoText}>GymLog</span>
          </Link>

          <div className={styles.desktopNav}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
              >
                <NavIcon type={item.icon} />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          {user && (
            <Link href="/profile" className={styles.userButton}>
              <div className={styles.userAvatar}>
                {user.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{user.name.charAt(0).toUpperCase()}</span>}
              </div>
              <span className={styles.userName}>{user.name}</span>
            </Link>
          )}

          <button onClick={handleLogout} className={styles.logoutBtn}>
            Выйти
          </button>

          <button className={styles.mobileMenuBtn} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Открыть меню">
            <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}></span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.mobileNavLink} ${pathname === item.href ? styles.active : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <NavIcon type={item.icon} />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

function NavIcon({ type }) {
  switch (type) {
    case 'home':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'muscle':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case 'workout':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 6.5h11" />
          <path d="M6.5 17.5h11" />
          <path d="M6 20v-2a6 6 0 1 1 12 0v2" />
          <path d="M6 4v2a6 6 0 0 0 12 0V4" />
        </svg>
      );
    case 'users':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    default:
      return null;
  }
}
