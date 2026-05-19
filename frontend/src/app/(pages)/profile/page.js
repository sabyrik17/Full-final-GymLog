'use client';

import { useContext, useEffect, useState } from 'react';
import { UploadButton } from '@uploadthing/react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import styles from './profile.module.css';

const toNullableNumber = (value) => {
  if (value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export default function ProfilePage() {
  const { user, token, isLoading, logout, updateUser } = useContext(AuthContext);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    weight: '',
    height: '',
    bio: '',
    isPublic: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }

    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        weight: user.weight?.toString() || '',
        height: user.height?.toString() || '',
        bio: user.bio || '',
        isPublic: Boolean(user.isPublic),
      });
    }
  }, [token, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const saveProfile = async (extra = {}) => {
    const updated = await fetchAPI('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({
        name: formData.name,
        weight: toNullableNumber(formData.weight),
        height: toNullableNumber(formData.height),
        bio: formData.bio,
        isPublic: formData.isPublic,
        ...extra,
      }),
    });

    updateUser(updated);
    return updated;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await saveProfile();
      setMessage({ type: 'success', text: 'Профиль сохранен' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Не получилось сохранить профиль' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarComplete = async (files) => {
    const uploadedFile = files?.[0];
    const avatarUrl = uploadedFile?.serverData?.url || uploadedFile?.url;

    if (!avatarUrl) {
      setMessage({ type: 'error', text: 'UploadThing не вернул ссылку на файл' });
      return;
    }

    try {
      const updated = await saveProfile({ avatar: avatarUrl });
      setMessage({ type: 'success', text: 'Аватар обновлен' });
      setFormData((prev) => ({
        ...prev,
        name: updated.name || prev.name,
        email: updated.email || prev.email,
      }));
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Аватар загружен, но не сохранился в профиле' });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>Профиль</h1>
        <p className={styles.subtitle}>Настройки аккаунта, аватар и приватность дневника</p>

        <div className={styles.content}>
          <section className={styles.avatarSection}>
            <div className={styles.avatarPreview}>
              <div className={styles.avatarLarge}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <UploadButton
                endpoint="avatarUploader"
                headers={() => ({
                  Authorization: `Bearer ${token}`,
                })}
                onClientUploadComplete={handleAvatarComplete}
                onUploadError={(error) => {
                  setMessage({ type: 'error', text: error.message || 'Не получилось загрузить фото' });
                }}
                content={{
                  button({ ready, isUploading }) {
                    if (!ready) return 'Подготовка...';
                    return isUploading ? 'Загрузка...' : 'Загрузить фото';
                  },
                  allowedContent() {
                    return 'Картинка до 2MB';
                  },
                }}
                appearance={{
                  button: {
                    minHeight: '2.5rem',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                    fontWeight: 800,
                    padding: '0 var(--spacing-md)',
                  },
                  allowedContent: {
                    color: 'var(--text-tertiary)',
                    fontSize: '0.75rem',
                  },
                }}
              />
            </div>

            <div className={styles.avatarInfo}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </section>

          <section className={styles.formSection}>
            <form onSubmit={handleSubmit}>
              {message && <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>}

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Имя</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ваше имя"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} disabled />
                  <span className={styles.hint}>Email нельзя изменить</span>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="weight">
                    Вес <span className={styles.unit}>(кг)</span>
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="75"
                    min="20"
                    max="500"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="height">
                    Рост <span className={styles.unit}>(см)</span>
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="175"
                    min="100"
                    max="250"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bio">О себе</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Расскажи о своих целях..."
                  rows={4}
                  maxLength={500}
                />
                <span className={styles.hint}>{formData.bio.length}/500</span>
              </div>

              <div className={styles.toggleGroup}>
                <div className={styles.toggleInfo}>
                  <h4>Публичный дневник</h4>
                  <p>Разрешить друзьям видеть твои тренировки, когда будет подключен раздел друзей</p>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <span className={styles.spinnerSmall}></span>
                      Сохранение...
                    </>
                  ) : (
                    'Сохранить изменения'
                  )}
                </button>
              </div>
            </form>
          </section>

          <section className={styles.dangerZone}>
            <h3>Выход</h3>
            <p>Завершить текущую сессию и вернуться на стартовую страницу.</p>
            <button
              className={styles.dangerBtn}
              onClick={() => {
                logout();
                router.push('/');
              }}
            >
              Выйти из аккаунта
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
