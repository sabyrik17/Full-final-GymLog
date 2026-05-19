import '../styles/globals.css';
import '@uploadthing/react/styles.css';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { AuthProvider } from '../context/AuthContext';
import { RealtimeProvider } from '../context/RealtimeContext';
import Navbar from '../components/Navbar';
import { ourFileRouter } from './api/uploadthing/core';

export const metadata = {
  title: 'GymLog - fitness diary',
  description: 'Track workouts, manage exercises, and follow fitness progress.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <AuthProvider>
          <RealtimeProvider>
            <Navbar />
            <main>{children}</main>
          </RealtimeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
