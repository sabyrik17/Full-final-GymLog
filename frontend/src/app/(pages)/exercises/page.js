'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import styles from './exercises.module.css';

const initialForm = {
  name: '',
  description: '',
  difficulty: 'beginner',
  type: 'compound',
  equipment: 'bodyweight',
  mediaUrl: '',
  videoUrl: '',
};

const labels = {
  beginner: 'начальный',
  intermediate: 'средний',
  advanced: 'сложный',
  compound: 'базовое',
  isolation: 'изолирующее',
  cardio: 'кардио',
  stretching: 'растяжка',
  barbell: 'штанга',
  dumbbell: 'гантели',
  cable: 'кроссовер',
  machine: 'тренажер',
  bodyweight: 'свой вес',
  kettlebell: 'гиря',
  bands: 'резинки',
};

const isVideoUrl = (url = '') => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);

export default function ExercisesPage() {
  const { user, token, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const [exercises, setExercises] = useState([]);
  const [filters, setFilters] = useState({ q: '', difficulty: 'all', equipment: 'all', type: 'all' });
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !token) router.push('/login');
  }, [token, isLoading, router]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  const loadExercises = async () => {
    if (!token) return;
    try {
      const data = await fetchAPI(`/api/exercises${query ? `?${query}` : ''}`);
      setExercises(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Не получилось загрузить упражнения');
    }
  };

  useEffect(() => {
    loadExercises();
  }, [query, token]);

  if (isLoading) return <div className={styles.loading}>Загрузка...</div>;

  const updateFilter = (field, value) => setFilters((current) => ({ ...current, [field]: value }));
  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const startEdit = (exercise) => {
    setEditingId(exercise.id);
    setForm({
      name: exercise.name || '',
      description: exercise.description || '',
      difficulty: exercise.difficulty || 'beginner',
      type: exercise.type || 'compound',
      equipment: exercise.equipment || 'bodyweight',
      mediaUrl: exercise.mediaUrl || '',
      videoUrl: exercise.videoUrl || '',
    });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      if (editingId) {
        await fetchAPI(`/api/exercises/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
        setMessage('Упражнение обновлено');
      } else {
        await fetchAPI('/api/exercises', { method: 'POST', body: JSON.stringify(form) });
        setMessage('Упражнение создано');
      }

      resetForm();
      await loadExercises();
    } catch (err) {
      setError(err.message || 'Не получилось сохранить упражнение');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (exercise) => {
    try {
      await fetchAPI(`/api/exercises/${exercise.id}`, { method: 'DELETE' });
      setMessage('Упражнение удалено');
      await loadExercises();
    } catch (err) {
      setError(err.message || 'Удалять можно только свои упражнения');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Упражнения</h1>
          <p>Создавай свои упражнения, редактируй их и фильтруй список по названию, сложности, типу и оборудованию.</p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.panel}>
            <h2>{editingId ? 'Редактировать' : 'Новое упражнение'}</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              {message && <div className={styles.message}>{message}</div>}
              {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}

              <div className={styles.formGroup}>
                <label htmlFor="name">Название</label>
                <input id="name" value={form.name} onChange={(event) => updateForm('name', event.target.value)} required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Описание</label>
                <textarea id="description" value={form.description} onChange={(event) => updateForm('description', event.target.value)} rows={4} required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="difficulty">Сложность</label>
                <select id="difficulty" value={form.difficulty} onChange={(event) => updateForm('difficulty', event.target.value)}>
                  <option value="beginner">Начальный</option>
                  <option value="intermediate">Средний</option>
                  <option value="advanced">Сложный</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="type">Тип</label>
                <select id="type" value={form.type} onChange={(event) => updateForm('type', event.target.value)}>
                  <option value="compound">Базовое</option>
                  <option value="isolation">Изолирующее</option>
                  <option value="cardio">Кардио</option>
                  <option value="stretching">Растяжка</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="equipment">Оборудование</label>
                <select id="equipment" value={form.equipment} onChange={(event) => updateForm('equipment', event.target.value)}>
                  <option value="bodyweight">Свой вес</option>
                  <option value="barbell">Штанга</option>
                  <option value="dumbbell">Гантели</option>
                  <option value="cable">Кроссовер</option>
                  <option value="machine">Тренажер</option>
                  <option value="kettlebell">Гиря</option>
                  <option value="bands">Резинки</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mediaUrl">Media URL</label>
                <input id="mediaUrl" value={form.mediaUrl} onChange={(event) => updateForm('mediaUrl', event.target.value)} />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Сохранение...' : editingId ? 'Сохранить' : 'Создать'}
                </button>
                {editingId && <button type="button" className={styles.smallBtn} onClick={resetForm}>Отмена</button>}
              </div>
            </form>
          </aside>

          <section>
            <div className={styles.filters}>
              <div className={styles.formGroup}>
                <label htmlFor="search">Поиск</label>
                <input id="search" value={filters.q} onChange={(event) => updateFilter('q', event.target.value)} placeholder="Название или описание" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="filterDifficulty">Сложность</label>
                <select id="filterDifficulty" value={filters.difficulty} onChange={(event) => updateFilter('difficulty', event.target.value)}>
                  <option value="all">Все</option>
                  <option value="beginner">Начальный</option>
                  <option value="intermediate">Средний</option>
                  <option value="advanced">Сложный</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="filterEquipment">Оборудование</label>
                <select id="filterEquipment" value={filters.equipment} onChange={(event) => updateFilter('equipment', event.target.value)}>
                  <option value="all">Все</option>
                  <option value="bodyweight">Свой вес</option>
                  <option value="barbell">Штанга</option>
                  <option value="dumbbell">Гантели</option>
                  <option value="machine">Тренажер</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="filterType">Тип</label>
                <select id="filterType" value={filters.type} onChange={(event) => updateFilter('type', event.target.value)}>
                  <option value="all">Все</option>
                  <option value="compound">Базовое</option>
                  <option value="isolation">Изолирующее</option>
                  <option value="cardio">Кардио</option>
                  <option value="stretching">Растяжка</option>
                </select>
              </div>
            </div>

            <div className={styles.list}>
              {exercises.length === 0 ? (
                <div className={styles.empty}>По этим фильтрам упражнений пока нет.</div>
              ) : (
                exercises.map((exercise) => {
                  const canEdit = exercise.createdBy?.toString?.() === user?.id || exercise.createdBy === user?.id;

                  return (
                    <article className={styles.exerciseCard} key={exercise.id}>
                      <div className={styles.cardHeader}>
                        <h3>{exercise.name}</h3>
                        <p>{exercise.description}</p>
                      </div>

                      <div className={styles.tags}>
                        <span className={styles.tag}>{labels[exercise.difficulty] || exercise.difficulty}</span>
                        <span className={styles.tag}>{labels[exercise.type] || exercise.type}</span>
                        <span className={styles.tag}>{labels[exercise.equipment] || exercise.equipment}</span>
                      </div>

                      {exercise.mediaUrl && (
                        <div className={styles.mediaPreview}>
                          {isVideoUrl(exercise.mediaUrl) ? <video src={exercise.mediaUrl} controls /> : <img src={exercise.mediaUrl} alt={exercise.name} />}
                        </div>
                      )}

                      {canEdit && (
                        <div className={styles.cardActions}>
                          <button type="button" className={styles.smallBtn} onClick={() => startEdit(exercise)}>Изменить</button>
                          <button type="button" className={styles.dangerBtn} onClick={() => handleDelete(exercise)}>Удалить</button>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
