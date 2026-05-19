'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { AuthContext } from './AuthContext';

export const RealtimeContext = createContext({
  isConnected: false,
  onlineUsers: [],
  liveEvents: [],
  sendRealtimeEvent: () => false,
});

const getWebSocketUrl = () => {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }

  return API_BASE_URL.replace(/^http/, 'ws');
};

const eventText = (message) => {
  const title = message.data?.title || message.data?.workout?.title || 'тренировку';

  if (message.status === 'START') return `начал тренировку: ${title}`;
  if (message.status === 'END') return 'завершил тренировку';
  return message.data?.action === 'created' ? `создал тренировку: ${title}` : `обновил тренировку: ${title}`;
};

export function RealtimeProvider({ children }) {
  const { user, token } = useContext(AuthContext);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    if (!user?.id || !token) {
      setIsConnected(false);
      setOnlineUsers([]);
      socketRef.current?.close();
      socketRef.current = null;
      return;
    }

    const socket = new WebSocket(getWebSocketUrl());
    socketRef.current = socket;

    socket.addEventListener('open', () => {
      setIsConnected(true);
      socket.send(
        JSON.stringify({
          type: 'AUTH',
          token,
          userId: user.id,
          userName: user.name,
        })
      );
    });

    socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === 'ONLINE_USERS') {
          setOnlineUsers(Array.isArray(message.users) ? message.users : []);
        }

        if (message.type === 'TRAINING_STATUS') {
          setLiveEvents((current) => [
            {
              id: `${Date.now()}-${Math.random()}`,
              userId: message.userId,
              userName: message.userName || 'User',
              text: eventText(message),
              createdAt: message.createdAt || new Date().toISOString(),
            },
            ...current,
          ].slice(0, 8));
        }
      } catch (error) {
        console.warn('Invalid realtime message', error);
      }
    });

    socket.addEventListener('close', () => {
      setIsConnected(false);
    });

    socket.addEventListener('error', () => {
      setIsConnected(false);
    });

    return () => {
      socket.close();
    };
  }, [user?.id, user?.name, token]);

  const sendRealtimeEvent = useCallback((message) => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    socket.send(JSON.stringify(message));
    return true;
  }, []);

  const value = useMemo(
    () => ({
      isConnected,
      onlineUsers,
      liveEvents,
      sendRealtimeEvent,
    }),
    [isConnected, onlineUsers, liveEvents, sendRealtimeEvent]
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}
