import React, { useEffect, useState } from 'react';
import { Camera, CheckCircle2, Globe, MapPinned, Pencil, UserRound } from 'lucide-react';
import clsx from 'clsx';
import type { UserProfile } from '@/entities/types';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { useT } from '@/shared/i18n';
import { IMAGES } from '@/shared/lib/images';
import { LANGUAGE_FLAGS, languageCode, languageKey } from '@/shared/lib/taxonomy';
import { Avatar } from '@/shared/ui/Avatar';
import { InterestsSection } from './InterestsSection';
import styles from './ProfileTab.module.scss';
import t$ from './tabs.module.scss';

const LEVELS = ['Native', 'Fluent', 'Basic'] as const;

/** Own profile: banner, identity, inline editing and info cards. */
export const ProfileTab: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { t } = useT();
  const updateUser = useAuthStore((s) => s.updateUser);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [bio, setBio] = useState(user.bio);
  const [nameError, setNameError] = useState<string>();
  const [saved, setSaved] = useState(false);
  const [first, ...rest] = user.fullName.split(' ');
  const isOwner = user.role !== 'tourist';

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 2600);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const startEditing = () => {
    setFullName(user.fullName);
    setBio(user.bio);
    setNameError(undefined);
    setEditing(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const name = fullName.trim();
    if (!name) {
      setNameError(t('cabinet.profile.nameRequired'));
      return;
    }
    updateUser({ fullName: name, name: name.split(' ')[0], bio: bio.trim() });
    setEditing(false);
    setSaved(true);
  };

  return (
    <div className={t$.tab}>
      <div className={t$.pageHeader}>
        <div>
          <h1 className={t$.pageTitle}>{t('cabinet.profile.title')}</h1>
          <p className={t$.pageSubtitle}>
            {isOwner ? t('cabinet.profile.hostSubtitle') : t('cabinet.profile.guestSubtitle')}
          </p>
        </div>
      </div>

      <section className={styles.hero}>
        <div className={styles.banner}>
          <img src={user.bannerUrl || IMAGES.defaultBanner} alt="" />
        </div>

        <div className={styles.head}>
          <div className={styles.avatarWrap}>
            <Avatar src={user.avatarUrl} name={user.fullName} size={96} className={styles.avatar} />
            <label className={styles.cameraBtn} title={t('cabinet.profile.changePhoto')}>
              <Camera size={14} />
              <input
                type="file"
                accept="image/*"
                className="visually-hidden"
                aria-label={t('cabinet.profile.changePhoto')}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) updateUser({ avatarUrl: URL.createObjectURL(file) });
                }}
              />
            </label>
          </div>

          {editing ? (
            <form className={styles.editForm} onSubmit={save} noValidate>
              <label className={styles.editLabel}>
                <span>{t('cabinet.profile.fullName')}</span>
                <input
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setNameError(undefined);
                  }}
                  aria-invalid={Boolean(nameError)}
                  className={clsx(nameError && styles.invalid)}
                  autoFocus
                />
                {nameError && <small className={styles.error}>{nameError}</small>}
              </label>
              <label className={styles.editLabel}>
                <span>{t('cabinet.profile.bio')}</span>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
              </label>
              <div className={styles.editActions}>
                <button type="submit" className={t$.primaryBtn}>
                  {t('common.save')}
                </button>
                <button type="button" className={t$.secondaryBtn} onClick={() => setEditing(false)}>
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.identity}>
              <h2 className={styles.name}>{user.fullName}</h2>
              <p className={styles.memberSince}>{t('cabinet.profile.memberSince', { date: user.memberSince })}</p>
              <p className={clsx(styles.bio, !user.bio && styles.bioEmpty)}>{user.bio || t('cabinet.profile.bioEmpty')}</p>
            </div>
          )}

          {!editing && (
            <button type="button" className={clsx(t$.secondaryBtn, styles.editBtn)} onClick={startEditing}>
              <Pencil size={14} /> {t('cabinet.profile.editProfile')}
            </button>
          )}
        </div>

        {saved && (
          <p className={styles.toast} role="status">
            <CheckCircle2 size={16} /> {t('common.saved')}
          </p>
        )}
      </section>

      {!isOwner && (user.tripsCount > 0 || user.daysTravelled > 0) && (
        <div className={styles.stats}>
          <div>
            <strong>{user.tripsCount}</strong>
            <span>{t('cabinet.profile.trips')}</span>
          </div>
          <div>
            <strong>{user.daysTravelled}</strong>
            <span>{t('cabinet.profile.days')}</span>
          </div>
          <div>
            <strong>{user.visitedRegions.length}</strong>
            <span>
              <MapPinned size={12} /> {t('cabinet.profile.regions')}
            </span>
          </div>
        </div>
      )}

      <div className={styles.cards2}>
        <section className={t$.panel}>
          <h3 className={t$.panelTitle}>
            <UserRound size={17} /> {t('cabinet.profile.personal')}
          </h3>
          <dl className={styles.infoList}>
            <div>
              <dt>{t('cabinet.profile.firstName')}</dt>
              <dd>{first}</dd>
            </div>
            <div>
              <dt>{t('cabinet.profile.lastName')}</dt>
              <dd>{rest.join(' ') || '—'}</dd>
            </div>
            <div>
              <dt>{t('cabinet.profile.country')}</dt>
              <dd>{user.country ?? t('cabinet.profile.defaultCountry')}</dd>
            </div>
            <div>
              <dt>{t('cabinet.profile.birthDate')}</dt>
              <dd>{user.birthDate ?? '—'}</dd>
            </div>
          </dl>
        </section>

        <section className={t$.panel}>
          <h3 className={t$.panelTitle}>
            <Globe size={17} /> {t('cabinet.profile.languages')}
          </h3>
          <ul className={styles.langList}>
            {user.languages.map((lang) => {
              const code = languageCode(lang.name);
              const level = (LEVELS as readonly string[]).includes(lang.level)
                ? t(`cabinet.profile.levels.${lang.level as (typeof LEVELS)[number]}`)
                : lang.level;
              return (
                <li key={lang.name}>
                  <span className={styles.flag} aria-hidden="true">
                    {code ? LANGUAGE_FLAGS[code] : '🏳️'}
                  </span>
                  <span className={styles.langName}>{code ? t(languageKey(code)) : lang.name}</span>
                  <span className={styles.langLevel}>{level}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <InterestsSection user={user} />
    </div>
  );
};
