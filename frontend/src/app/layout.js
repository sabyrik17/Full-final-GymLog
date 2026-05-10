import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'GymLog — фитнес‑дневник',
  description: 'Отслеживай тренировки, выбирай упражнения по мышцам и следи за друзьями в реальном времени.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
