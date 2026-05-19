'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { RealtimeContext } from '@/context/RealtimeContext';
import { fetchAPI } from '@/lib/api';
import styles from './friends.module.css';

export default function FriendsPage() {
  const { token, isLoading } = useContext(AuthContext);
  const { onlineUsers } = useContext(RealtimeContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const onlineById = useMemo(() => new Map(onlineUsers.map((user) => [user.id, user])), [onlineUsers]);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router]);

  const loadFriends = async (query = search) => {
    if (!token) return;

    const params = query.trim() ? `?search=${encodeURIComponent(query.trim())}` : '';
    const data = await fetchAPI(`/api/friends${params}`);
    setFriends(data.friends || []);
    setSearchResults(data.searchResults || []);
  };

  const loadRequests = async () => {
    if (!token) return;

    const data = await fetchAPI('/api/friends/requests');
    setIncoming(data.incoming || []);
    setOutgoing(data.outgoing || []);
  };

  const refresh = async () => {
    try {
      await Promise.all([loadFriends(), loadRequests()]);
      setError('');
    } catch (err) {
      setError(err.message || 'Не получилось загрузить друзей');
    }
  };

  useEffect(() => {
    refresh();
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) loadFriends(search).catch((err) => setError(err.message || 'Не получилось выполнить поиск'));
    }, 250);

    return () => clearTimeout(timer);
  }, [search, token]);

  const runAction = async (callback, successText) => {
    setIsBusy(true);
    setMessage('');
    setError('');

    try {
      await callback();
      setMessage(successText);
      await refresh();
    } catch (err) {
      setError(err.message || 'Действие не выполнено');
    } finally {
      setIsBusy(false);
    }
  };

  const sendRequest = (userId) => runAction(
    () => fetchAPI('/api/friends/request', {
      method: 'POST',
      body: JSON.stringify({ receiverId: userId }),
    }),
    'Заявка отправлена'
  );

  const acceptRequest = (requestId) => runAction(
    () => fetchAPI(`/api/friends/${requestId}/accept`, { method: 'PUT' }),
    'Заявка принята'
  );

  const rejectRequest = (requestId) => runAction(
    () => fetchAPI(`/api/friends/${requestId}/reject`, { method: 'PUT' }),
    'Заявка отклонена'
  );

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  const renderAvatar = (person) => (
    <div className={styles.friendAvatar}>
      {person.avatar ? <img src={person.avatar} alt={person.name} /> : <span>{person.name?.charAt(0)?.toUpperCase() || 'U'}</span>}
      <span className={`${styles.onlineDot} ${onlineById.has(person.id) ? styles.online : ''}`}></span>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1>Друзья</h1>
            <p>Ищи пользователей, отправляй заявки и открывай дневник друга, если он сделал профиль публичным.</p>
          </div>
        </header>

        <section className={styles.searchPanel}>
          <label htmlFor="friendSearch">Найти пользователя</label>
          <div className={styles.searchRow}>
            <input
              id="friendSearch"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Имя или email"
            />
          </div>
          {message && <div className={styles.message}>{message}</div>}
          {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}
        </section>

        {search.trim() && (
          <section className={styles.section}>
            <h2>Результаты поиска</h2>
            <div className={styles.friendsList}>
              {searchResults.length === 0 ? (
                <div className={styles.emptyState}>
                  <h3>Ничего не найдено</h3>
                  <p>Попробуй другое имя или email.</p>
                </div>
              ) : (
                searchResults.map((person) => (
                  <article className={styles.requestCard} key={person.id}>
                    {renderAvatar(person)}
                    <div className={styles.requestInfo}>
                      <h3>{person.name}</h3>
                      <p className={styles.requestDate}>{person.email}</p>
                    </div>
                    {person.relation === 'friend' ? (
                      <Link href={`/friends/${person.id}`} className={styles.actionBtn}>Открыть</Link>
                    ) : person.relation === 'outgoing_pending' ? (
                      <button className={styles.actionBtn} disabled>Заявка отправлена</button>
                    ) : person.relation === 'incoming_pending' ? (
                      <span className={styles.statusPill}>Ждет ответа</span>
                    ) : (
                      <button className={`${styles.actionBtn} ${styles.acceptBtn}`} onClick={() => sendRequest(person.id)} disabled={isBusy}>
                        Добавить
                      </button>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        )}

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'friends' ? styles.active : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Друзья
            <span className={styles.tabCount}>{friends.length}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'requests' ? styles.active : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Заявки
            <span className={`${styles.tabCount} ${incoming.length ? styles.badge : ''}`}>{incoming.length}</span>
          </button>
        </div>

        {activeTab === 'friends' ? (
          <div className={styles.friendsList}>
            {friends.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>Друзей пока нет</h3>
                <p>Найди пользователя выше и отправь первую заявку.</p>
              </div>
            ) : (
              friends.map((friend) => {
                const online = onlineById.get(friend.id);

                return (
                  <Link href={`/friends/${friend.id}`} className={styles.friendCard} key={friend.id}>
                    {renderAvatar(friend)}
                    <div className={styles.friendInfo}>
                      <h3>{friend.name}</h3>
                      <p className={styles.friendStatus}>
                        {online?.isTraining ? 'тренируется сейчас' : online ? 'в сети' : 'не в сети'}
                        {!friend.canViewDiary ? ' · дневник приватный' : ''}
                      </p>
                    </div>
                    <span className={styles.arrowIcon}>›</span>
                  </Link>
                );
              })
            )}
          </div>
        ) : (
          <div className={styles.requestsList}>
            {incoming.length === 0 && outgoing.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>Заявок пока нет</h3>
                <p>Когда кто-то добавит тебя, заявка появится здесь.</p>
              </div>
            ) : (
              <>
                {incoming.map((request) => (
                  <article className={styles.requestCard} key={request.id}>
                    {renderAvatar(request.sender)}
                    <div className={styles.requestInfo}>
                      <h3>{request.sender.name}</h3>
                      <p className={styles.requestDate}>{request.sender.email}</p>
                    </div>
                    <div className={styles.requestActions}>
                      <button className={`${styles.actionBtn} ${styles.acceptBtn}`} onClick={() => acceptRequest(request.id)} disabled={isBusy}>Принять</button>
                      <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => rejectRequest(request.id)} disabled={isBusy}>Отклонить</button>
                    </div>
                  </article>
                ))}
                {outgoing.map((request) => (
                  <article className={styles.requestCard} key={request.id}>
                    {renderAvatar(request.receiver)}
                    <div className={styles.requestInfo}>
                      <h3>{request.receiver.name}</h3>
                      <p className={styles.requestDate}>Заявка отправлена</p>
                    </div>
                    <span className={styles.statusPill}>ожидание</span>
                  </article>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
