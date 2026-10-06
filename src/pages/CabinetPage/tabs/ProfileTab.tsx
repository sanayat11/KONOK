import React, { useState } from 'react';
import { Camera, Globe, Heart, Pencil, UserRound } from 'lucide-react';
import type { UserProfile } from '@/entities/types';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import styles from './ProfileTab.module.scss';
import t from './tabs.module.scss';

const LEVELS: Record<string, string> = { Native: 'Родной', Fluent: 'Свободно', Basic: 'Базовый' };
const FLAGS: Record<string, string> = {
  Английский: '🇬🇧',
  Русский: '🇷🇺',
  Кыргызский: '🇰🇬',
  Казахский: '🇰🇿',
  Узбекский: '🇺🇿',
  Немецкий: '🇩🇪',
};
const INTEREST_IMAGES: Record<string, string> = {
  Горы: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=120&q=60',
  Природа: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=120&q=60',
  Лошади: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=120&q=60',
  Культура: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=120&q=60',
  Кемпинг: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=120&q=60',
  Кухня: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=120&q=60',
};

/** Figma "Профиль гостя": banner, round avatar, bio, and three info cards. */
export const ProfileTab: React.FC<{ user: UserProfile }> = ({ user }) => {
  const updateUser = useAuthStore((s) => s.updateUser);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [bio, setBio] = useState(user.bio);
  const [first, ...rest] = user.fullName.split(' ');
  const isOwner = user.role !== 'tourist';

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ fullName: fullName.trim() || user.fullName, name: fullName.trim().split(' ')[0] || user.name, bio: bio.trim() });
    setEditing(false);
  };

  return (
    <div className={styles.profile}>
      {isOwner && (
        <div>
          <h1 className={t.pageTitle}>Мой профиль</h1>
          <p className={t.pageSubtitle}>Расскажите о себе и о своей семье, чтобы привлечь больше гостей</p>
        </div>
      )}

      <div className={styles.banner}>
        <img src={user.bannerUrl} alt="" />
      </div>

      <div className={styles.head}>
        <div className={styles.avatarWrap}>
          <img src={user.avatarUrl} alt={user.fullName} className={styles.avatar} />
          <label className={styles.cameraBtn} title="Сменить фото">
            <Camera size={14} />
            <input
              type="file"
              accept="image/*"
              className="visually-hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) updateUser({ avatarUrl: URL.createObjectURL(file) });
              }}
            />
          </label>
        </div>

        {editing ? (
          <form className={styles.editForm} onSubmit={save}>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} aria-label="Имя и фамилия" required />
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} aria-label="О себе" rows={3} />
            <div className={styles.editActions}>
              <button type="submit" className={t.primaryBtn}>
                Сохранить
              </button>
              <button type="button" className={styles.cancelBtn} onClick={() => setEditing(false)}>
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.identity}>
            <h2 className={styles.name}>{user.fullName}</h2>
            <p className={styles.bio}>{user.bio || 'Расскажите о себе — нажмите «Редактировать профиль».'}</p>
          </div>
        )}

        {!editing && (
          <button type="button" className={`${t.primaryBtn} ${styles.editBtn}`} onClick={() => setEditing(true)}>
            <Pencil size={16} /> Редактировать профиль
          </button>
        )}
      </div>

      <div className={t.cards3}>
        <section className={t.panel}>
          <h3 className={t.panelTitle}>
            <UserRound size={26} strokeWidth={1.5} /> Личная информация
          </h3>
          <dl className={styles.infoList}>
            <div>
              <dt>Имя</dt>
              <dd>{first}</dd>
            </div>
            <div>
              <dt>Фамилия</dt>
              <dd>{rest.join(' ') || '—'}</dd>
            </div>
            <div>
              <dt>Страна</dt>
              <dd>{user.country ?? 'Кыргызстан'}</dd>
            </div>
            <div>
              <dt>Дата рождения</dt>
              <dd>{user.birthDate ?? '—'}</dd>
            </div>
          </dl>
        </section>

        <section className={t.panel}>
          <h3 className={t.panelTitle}>
            <Globe size={26} strokeWidth={1.5} /> Языки
          </h3>
          <ul className={styles.langList}>
            {user.languages.map((lang) => (
              <li key={lang.name}>
                <span className={styles.flag} aria-hidden="true">
                  {FLAGS[lang.name] ?? '🏳️'}
                </span>
                <span className={styles.langName}>{lang.name}</span>
                <span className={styles.langLevel}>{LEVELS[lang.level] ?? lang.level}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={t.panel}>
          <h3 className={t.panelTitle}>
            <Heart size={26} strokeWidth={1.5} /> Интересы
          </h3>
          {user.interests?.length ? (
            <ul className={styles.interests}>
              {user.interests.map((interest) => (
                <li key={interest}>
                  {INTEREST_IMAGES[interest] && <img src={INTEREST_IMAGES[interest]} alt="" />}
                  <span>{interest}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.bio}>Интересы пока не указаны.</p>
          )}
        </section>
      </div>
    </div>
  );
};
