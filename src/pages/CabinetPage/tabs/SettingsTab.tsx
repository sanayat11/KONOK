import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, LogOut, ShieldCheck, SlidersHorizontal, Trash2, UserCog } from 'lucide-react';
import type { UserProfile } from '@/entities/types';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { LOCALES, useT, type Locale } from '@/shared/i18n';
import { Modal } from '@/shared/ui/Modal';
import styles from './SettingsTab.module.scss';
import t$ from './tabs.module.scss';

const SETTINGS_KEY = 'konok_settings';
const CURRENCIES = ['kgs', 'usd', 'eur'] as const;
const TIMEZONES = ['bishkek', 'moscow', 'london'] as const;

interface Settings {
  currency: (typeof CURRENCIES)[number];
  timezone: (typeof TIMEZONES)[number];
  notifyMessages: boolean;
  notifyTrips: boolean;
  notifyRecommendations: boolean;
  channelEmail: boolean;
  channelApp: boolean;
}

const DEFAULTS: Settings = {
  currency: 'kgs',
  timezone: 'bishkek',
  notifyMessages: true,
  notifyTrips: true,
  notifyRecommendations: false,
  channelEmail: true,
  channelApp: true,
};

/** Reads saved preferences; older saves stored display strings, which fall back to defaults. */
const loadSettings = (): Settings => {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as Partial<Settings>;
    return {
      ...DEFAULTS,
      ...saved,
      currency: CURRENCIES.includes(saved.currency as Settings['currency']) ? saved.currency! : DEFAULTS.currency,
      timezone: TIMEZONES.includes(saved.timezone as Settings['timezone']) ? saved.timezone! : DEFAULTS.timezone,
    };
  } catch {
    return DEFAULTS;
  }
};

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className={styles.toggleRow}>
    <span>{label}</span>
    <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className={styles.switch} />
  </label>
);

/** Figma "Настройки": general, notifications, security and account panels. Preferences are kept in localStorage. */
export const SettingsTab: React.FC<{ user: UserProfile }> = ({ user }) => {
  const navigate = useNavigate();
  const { t, locale, setLocale } = useT();
  const logout = useAuthStore((s) => s.logout);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [savedAt, setSavedAt] = useState(0);
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    if (!savedAt) return;
    const timer = window.setTimeout(() => setSavedAt(0), 2200);
    return () => window.clearTimeout(timer);
  }, [savedAt]);

  const update = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    setSavedAt(Date.now());
  };

  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={t$.tab}>
      <div className={t$.pageHeader}>
        <div>
          <h1 className={t$.pageTitle}>{t('cabinet.settings.title')}</h1>
          <p className={t$.pageSubtitle}>{t('cabinet.settings.subtitle')}</p>
        </div>
        {savedAt > 0 && (
          <p key={savedAt} className={styles.saved} role="status">
            <CheckCircle2 size={16} /> {t('cabinet.settings.savedLocally')}
          </p>
        )}
      </div>

      <div className={styles.grid}>
        <section className={t$.panel}>
          <h2 className={styles.panelTitle}>
            <SlidersHorizontal size={22} /> {t('cabinet.settings.general')}
          </h2>
          <div className={styles.rows}>
            <label className={styles.row}>
              <span>{t('cabinet.settings.language')}</span>
              <select value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
                {LOCALES.map((l) => (
                  <option key={l.code} value={l.code} lang={l.code}>
                    {l.native}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.row}>
              <span>{t('cabinet.settings.currency')}</span>
              <select value={settings.currency} onChange={(e) => update({ currency: e.target.value as Settings['currency'] })}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`cabinet.settings.currencies.${c}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.row}>
              <span>{t('cabinet.settings.timezone')}</span>
              <select value={settings.timezone} onChange={(e) => update({ timezone: e.target.value as Settings['timezone'] })}>
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {t(`cabinet.settings.timezones.${tz}`)}
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.row}>
              <span>{t('cabinet.settings.accountType')}</span>
              <strong>{user.role === 'tourist' ? t('cabinet.settings.typeGuest') : t('cabinet.settings.typeHost')}</strong>
            </div>
          </div>
        </section>

        <section className={t$.panel}>
          <h2 className={styles.panelTitle}>
            <Bell size={22} /> {t('cabinet.settings.notifications')}
          </h2>
          <div className={styles.rows}>
            <Toggle label={t('cabinet.settings.notifyMessages')} checked={settings.notifyMessages} onChange={(v) => update({ notifyMessages: v })} />
            <Toggle label={t('cabinet.settings.notifyTrips')} checked={settings.notifyTrips} onChange={(v) => update({ notifyTrips: v })} />
            <Toggle
              label={t('cabinet.settings.notifyRecommendations')}
              checked={settings.notifyRecommendations}
              onChange={(v) => update({ notifyRecommendations: v })}
            />
          </div>
          <p className={styles.channelsTitle}>{t('cabinet.settings.channels')}</p>
          <div className={styles.channels}>
            <label>
              <input type="checkbox" checked={settings.channelEmail} onChange={(e) => update({ channelEmail: e.target.checked })} />{' '}
              {t('cabinet.settings.channelEmail')}
            </label>
            <label>
              <input type="checkbox" checked={settings.channelApp} onChange={(e) => update({ channelApp: e.target.checked })} />{' '}
              {t('cabinet.settings.channelApp')}
            </label>
          </div>
        </section>

        <section className={t$.panel}>
          <h2 className={styles.panelTitle}>
            <ShieldCheck size={22} /> {t('cabinet.settings.security')}
          </h2>
          <div className={styles.rows}>
            {[
              { label: t('cabinet.settings.password'), value: '••••••••' },
              { label: t('cabinet.settings.phone'), value: user.phone || '—' },
              { label: t('cabinet.settings.email'), value: user.email || '—' },
            ].map((row) => (
              <div key={row.label} className={styles.row}>
                <span>
                  {row.label}
                  <small>{row.value}</small>
                </span>
                <button type="button" className={styles.linkBtn} onClick={() => setNotice(true)}>
                  {t('cabinet.settings.change')}
                </button>
              </div>
            ))}
          </div>
          {notice && (
            <p className={styles.notice} role="status">
              {t('cabinet.settings.changeUnavailable')}
            </p>
          )}
        </section>

        <section className={t$.panel}>
          <h2 className={styles.panelTitle}>
            <UserCog size={22} /> {t('cabinet.settings.account')}
          </h2>
          <div className={styles.accountActions}>
            <button type="button" className={styles.accountBtn} onClick={signOut}>
              <LogOut size={18} /> {t('cabinet.settings.logout')}
            </button>
            <button type="button" className={`${styles.accountBtn} ${styles.danger}`} onClick={() => setConfirmDelete(true)}>
              <Trash2 size={18} /> {t('cabinet.settings.delete')}
            </button>
          </div>
        </section>
      </div>

      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} title={t('cabinet.settings.deleteTitle')} maxWidth="sm">
        <p className={styles.modalText}>{t('cabinet.settings.deleteText')}</p>
        <div className={styles.modalActions}>
          <button type="button" className={styles.accountBtn} onClick={() => setConfirmDelete(false)}>
            {t('common.cancel')}
          </button>
          <button
            type="button"
            className={`${styles.accountBtn} ${styles.dangerFilled}`}
            onClick={() => {
              try {
                localStorage.removeItem('konok_registered_user');
                localStorage.removeItem(SETTINGS_KEY);
              } catch {
                // ignore
              }
              setConfirmDelete(false);
              signOut();
            }}
          >
            {t('cabinet.settings.deleteConfirm')}
          </button>
        </div>
      </Modal>
    </div>
  );
};
