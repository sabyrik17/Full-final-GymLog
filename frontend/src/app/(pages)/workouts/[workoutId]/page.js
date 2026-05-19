'use client';

import { useContext, useEffect, useState } from 'react';
import { UploadButton } from '@uploadthing/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { RealtimeContext } from '@/context/RealtimeContext';
import { deleteWorkoutNote, getWorkoutNote, updateWorkoutNote } from '@/lib/workoutNotes';
import styles from '../workouts.module.css';

const emptyExercise = () => ({
  id: `${Date.now()}-${Math.random()}`,
  name: '',
  details: '',
  mediaUrl: '',
});

const isVideoUrl = (url = '') => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);

export default function WorkoutDetailsPage() {
  const { token, isLoading } = useContext(AuthContext);
  const { sendRealtimeEvent } = useContext(RealtimeContext);
  const router = useRouter();
  const params = useParams();
  const [workout, setWorkout] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [exercises, setExercises] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router]);

  useEffect(() => {
    if (isLoading || !token) return;

    getWorkoutNote(params.workoutId)
      .then((currentWorkout) => {
        setWorkout(currentWorkout);

        if (currentWorkout) {
          setTitle(currentWorkout.title);
          setDate(new Date(currentWorkout.date).toISOString().slice(0, 10));
          setNote(currentWorkout.note || '');
          setExercises(currentWorkout.exercises || []);
        }
      })
      .catch(() => {
        setWorkout(null);
        setError('Запись не найдена или backend недоступен.');
      });
  }, [params.workoutId, token, isLoading]);

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
    setMessage('');
  };

  const updateExercise = (id, field, value) => {
    setExercises((current) =>
      current.map((exercise) => (exercise.id === id ? { ...exercise, [field]: value } : exercise))
    );
    setMessage('');
  };

  const removeExercise = (id) => {
    setExercises((current) => current.filter((exercise) => exercise.id !== id));
    setMessage('');
  };

  const handleExerciseMediaComplete = (id, files) => {
    const uploadedFile = files?.[0];
    const mediaUrl = uploadedFile?.serverData?.url || uploadedFile?.url;

    if (!mediaUrl) {
      setError('UploadThing не вернул ссылку на медиа');
      return;
    }

    updateExercise(id, 'mediaUrl', mediaUrl);
    setMessage('Медиа загружено. Нажми сохранить, чтобы привязать его к упражнению.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const updated = await updateWorkoutNote(params.workoutId, {
        title,
        date,
        note,
        exercises,
      });
      setWorkout(updated);
      setExercises(updated?.exercises || []);
      setMessage('Изменения сохранены');
      sendRealtimeEvent({
        type: 'TRAINING_UPDATE',
        workoutData: {
          workoutId: updated.id,
          title: updated.title,
          action: 'updated',
        },
      });
    } catch (err) {
      setError(err.message || 'Не получилось сохранить изменения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    await deleteWorkoutNote(params.workoutId);
    router.push('/workouts');
  };

  if (!workout) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <h3>Запись не найдена</h3>
            <p>Она могла быть удалена или создана в другом браузере.</p>
            <Link href="/workouts" className="btn btn-primary">
              К календарю тренировок
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <p className={styles.kicker}>Редактирование</p>
            <h1>{workout.title}</h1>
            <p>{new Date(workout.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <Link href="/workouts" className="btn btn-outline">
            Назад
          </Link>
        </header>

        <form className={styles.noteForm} onSubmit={handleSubmit}>
          {message && <p className={styles.successMessage}>{message}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Название</label>
              <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="date">Дата</label>
              <input id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="note">Заметка</label>
            <textarea id="note" value={note} onChange={(event) => setNote(event.target.value)} rows={6} />
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
              <p className={styles.exerciseEmpty}>В этой записи пока нет упражнения. Нажми плюсик, чтобы добавить.</p>
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
                          placeholder="Например: Приседания"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor={`exerciseDetails-${exercise.id}`}>Подходы / вес / комментарий</label>
                        <input
                          id={`exerciseDetails-${exercise.id}`}
                          value={exercise.details}
                          onChange={(event) => updateExercise(exercise.id, 'details', event.target.value)}
                          placeholder="3 подхода, 60кг x 10"
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
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
              Удалить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
