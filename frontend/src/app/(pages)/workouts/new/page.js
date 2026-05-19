'use client';

import { useContext, useEffect, useState } from 'react';
import { UploadButton } from '@uploadthing/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { RealtimeContext } from '@/context/RealtimeContext';
import { createWorkoutNote } from '@/lib/workoutNotes';
import styles from '../workouts.module.css';

const emptyExercise = () => ({
  id: `${Date.now()}-${Math.random()}`,
  name: '',
  details: '',
  mediaUrl: '',
});

const isVideoUrl = (url = '') => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);

export default function NewWorkoutPage() {
  const { token, isLoading } = useContext(AuthContext);
  const { sendRealtimeEvent } = useContext(RealtimeContext);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  const addExercise = () => {
    setExercises((current) => [...current, emptyExercise()]);
  };

  const updateExercise = (id, field, value) => {
    setExercises((current) =>
      current.map((exercise) => (exercise.id === id ? { ...exercise, [field]: value } : exercise))
    );
  };

  const removeExercise = (id) => {
    setExercises((current) => current.filter((exercise) => exercise.id !== id));
  };

  const handleExerciseMediaComplete = (id, files) => {
    const uploadedFile = files?.[0];
    const mediaUrl = uploadedFile?.serverData?.url || uploadedFile?.url;

    if (!mediaUrl) {
      setError('UploadThing не вернул ссылку на медиа');
      return;
    }

    updateExercise(id, 'mediaUrl', mediaUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const workout = await createWorkoutNote({
        title,
        date,
        note,
        exercises,
      });
      sendRealtimeEvent({
        type: 'TRAINING_UPDATE',
        workoutData: {
          workoutId: workout.id,
          title: workout.title,
          action: 'created',
        },
      });
      router.push(`/workouts/${workout.id}`);
    } catch (err) {
      setError(err.message || 'Не получилось создать тренировку');
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <p className={styles.kicker}>Новая запись</p>
            <h1>Создать тренировку</h1>
            <p>Выбери дату, добавь заметку, упражнения и медиа к упражнениям.</p>
          </div>
          <Link href="/workouts" className="btn btn-outline">
            Назад
          </Link>
        </header>

        <form className={styles.noteForm} onSubmit={handleSubmit}>
          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Название</label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Например: Верх тела"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date">Дата в календаре</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="note">Заметка</label>
            <textarea
              id="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Что планируешь сделать или что получилось на тренировке?"
              rows={5}
            />
          </div>

          <div className={styles.exerciseBox}>
            <div className={styles.exerciseHeader}>
              <h2>Упражнения</h2>
              <button type="button" className={styles.addExerciseBtn} onClick={addExercise}>
                <span aria-hidden="true">+</span>
                Добавить упражнение
              </button>
            </div>

            {exercises.length === 0 ? (
              <p className={styles.exerciseEmpty}>Нажми плюсик, чтобы добавить упражнение к тренировке.</p>
            ) : (
              <div className={styles.exerciseList}>
                {exercises.map((exercise, index) => (
                  <div className={styles.exerciseItem} key={exercise.id}>
                    <div className={styles.exerciseTitle}>
                      <span>Упражнение {index + 1}</span>
                      <button type="button" className={styles.removeExerciseBtn} onClick={() => removeExercise(exercise.id)}>
                        Убрать
                      </button>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label htmlFor={`exerciseName-${exercise.id}`}>Название упражнения</label>
                        <input
                          id={`exerciseName-${exercise.id}`}
                          value={exercise.name}
                          onChange={(event) => updateExercise(exercise.id, 'name', event.target.value)}
                          placeholder="Например: Жим штанги"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor={`exerciseDetails-${exercise.id}`}>Подходы / вес / комментарий</label>
                        <input
                          id={`exerciseDetails-${exercise.id}`}
                          value={exercise.details}
                          onChange={(event) => updateExercise(exercise.id, 'details', event.target.value)}
                          placeholder="80кг x 10, 85кг x 8"
                        />
                      </div>
                    </div>

                    <div className={styles.mediaPanel}>
                      <div>
                        <h3>Медиа упражнения</h3>
                        <p>Фото до 8MB или видео до 64MB.</p>
                      </div>
                      <UploadButton
                        endpoint="exerciseMediaUploader"
                        headers={() => ({
                          Authorization: `Bearer ${token}`,
                        })}
                        onClientUploadComplete={(files) => handleExerciseMediaComplete(exercise.id, files)}
                        onUploadError={(uploadError) => setError(uploadError.message || 'Не получилось загрузить медиа')}
                        content={{
                          button({ ready, isUploading }) {
                            if (!ready) return 'Подготовка...';
                            return isUploading ? 'Загрузка...' : 'Загрузить медиа';
                          },
                          allowedContent() {
                            return '';
                          },
                        }}
                      />
                      {exercise.mediaUrl && (
                        <div className={styles.mediaPreview}>
                          {isVideoUrl(exercise.mediaUrl) ? (
                            <video src={exercise.mediaUrl} controls />
                          ) : (
                            <img src={exercise.mediaUrl} alt={exercise.name || 'Медиа упражнения'} />
                          )}
                          <input
                            value={exercise.mediaUrl}
                            onChange={(event) => updateExercise(exercise.id, 'mediaUrl', event.target.value)}
                            aria-label="Ссылка на медиа"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Создание...' : 'Создать запись'}
            </button>
            <Link href="/workouts" className="btn btn-ghost">
              Отмена
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
