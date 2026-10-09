import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Baby,
  Camera,
  Car,
  Check,
  CheckCircle2,
  Compass,
  Heart,
  House,
  Landmark,
  Leaf,
  Mountain,
  Pencil,
  Tent,
  UtensilsCrossed,
  Waves,
} from 'lucide-react';
import type { UserProfile } from '@/entities/types';
import { useT } from '@/shared/i18n';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { INTEREST_CODES, interestCodes, type InterestCode } from '@/shared/lib/taxonomy';
import { HorseIcon } from '@/shared/ui/HorseIcon';
import styles from './InterestsSection.module.scss';
import t$ from './tabs.module.scss';

const ICONS: Record<InterestCode, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  hiking: Mountain,
  lakes: Waves,
  heritage: Landmark,
  traditions: Tent,
  food: UtensilsCrossed,
  horses: HorseIcon,
  adventure: Compass,
  family: Baby,
  photography: Camera,
  wellness: Leaf,
  roadtrips: Car,
  village: House,
};

/** "Мои интересы": multi-select travel interests, saved to the profile. */
export const InterestsSection: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { t } = useT();
  const updateUser = useAuthStore((s) => s.updateUser);
  const saved = interestCodes(user.interests);
  const [editing, setEditing] = useState(false);
  const [selection, setSelection] = useState<InterestCode[]>(saved);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!justSaved) return;
    const timer = window.setTimeout(() => setJustSaved(false), 2600);
    return () => window.clearTimeout(timer);
  }, [justSaved]);

  const toggle = (code: InterestCode) =>
    setSelection((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));

  const startEditing = () => {
    setSelection(saved);
    setEditing(true);
  };

  const save = () => {
    // Keep the canonical order so the profile reads the same everywhere.
    updateUser({ interests: INTEREST_CODES.filter((c) => selection.includes(c)) });
    setEditing(false);
    setJustSaved(true);
  };

  return (
    <section className={clsx(t$.panel, styles.section)} aria-labelledby="interests-title">
      <div className={styles.head}>
        <div>
          <h2 id="interests-title" className={styles.title}>
            <Heart size={18} aria-hidden="true" /> {t('interests.title')}
          </h2>
          <p className={styles.subtitle}>{editing ? t('interests.editHint') : t('interests.subtitle')}</p>
        </div>
        {!editing && (
          <button type="button" className={t$.secondaryBtn} onClick={startEditing}>
            <Pencil size={14} aria-hidden="true" /> {saved.length ? t('interests.edit') : t('interests.choose')}
          </button>
        )}
      </div>

      {editing ? (
        <>
          <div className={styles.grid} role="group" aria-label={t('interests.title')}>
            {INTEREST_CODES.map((code, i) => {
              const Icon = ICONS[code];
              const on = selection.includes(code);
              return (
                <button
                  key={code}
                  type="button"
                  className={clsx(styles.option, on && styles.optionOn)}
                  aria-pressed={on}
                  onClick={() => toggle(code)}
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  <span className={styles.icon}>
                    <Icon size={22} strokeWidth={1.7} />
                  </span>
                  <span className={styles.label}>{t(`interests.names.${code}`)}</span>
                  <span className={styles.check} aria-hidden="true">
                    <Check size={13} strokeWidth={3} />
                  </span>
                </button>
              );
            })}
          </div>
          <div className={styles.footer}>
            <span className={styles.count} aria-live="polite">
              {t('interests.selected', { count: selection.length })}
            </span>
            <div className={styles.actions}>
              <button type="button" className={t$.secondaryBtn} onClick={() => setEditing(false)}>
                {t('common.cancel')}
              </button>
              <button type="button" className={t$.primaryBtn} onClick={save}>
                {t('common.save')}
              </button>
            </div>
          </div>
        </>
      ) : saved.length ? (
        <ul className={styles.chips}>
          {saved.map((code, i) => {
            const Icon = ICONS[code];
            return (
              <li key={code} className={styles.chip} style={{ animationDelay: `${i * 40}ms` }}>
                <Icon size={16} strokeWidth={1.8} />
                {t(`interests.names.${code}`)}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.empty}>{t('interests.empty')}</p>
      )}

      {justSaved && (
        <p className={styles.toast} role="status">
          <CheckCircle2 size={16} aria-hidden="true" /> {t('interests.saved')}
        </p>
      )}
    </section>
  );
};
