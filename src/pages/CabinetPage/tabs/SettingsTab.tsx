import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, ShieldCheck, SlidersHorizontal, Trash2, UserCog } from 'lucide-react';
import type { UserProfile } from '@/entities/types';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { Modal } from '@/shared/ui/Modal';
import styles from './SettingsTab.module.scss';
import t from './tabs.module.scss';

const SETTINGS_KEY = 'konok_settings';

interface Settings {
  language: string;
  currency: string;
  timezone: string;
  notifyMessages: boolean;
  notifyTrips: boolean;
  notifyRecommendations: boolean;
  channelEmail: boolean;
  channelApp: boolean;
}

const DEFAULTS: Settings = {
  language: 'Русский',
  currency: 'KGS-Кыргызский сом',
  timezone: 'Бишкек (GMT+6)',
  notifyMessages: true,
  notifyTrips: true,
  notifyRecommendations: false,
  channelEmail: true,
  channelApp: true,
};

const loadSettings = (): Settings => {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') };
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
  const logout = useAuthStore((s) => s.logout);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const update = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.settings}>
      <div>
        <h1 className={t.pageTitle}>Настройки</h1>
        <p className={t.pageSubtitle}>Управляйте аккаунтом, уведомлениями и конфиденциальностью.</p>
      </div>

      <div className={styles.grid}>
        <section className={t.panel}>
          <h2 className={styles.panelTitle}>
            <SlidersHorizontal size={24} /> Основные настройки
          </h2>
          <div className={styles.rows}>
            <label className={styles.row}>
              <span>Язык интерфейса</span>
              <select value={settings.language} onChange={(e) => update({ language: e.target.value })}>
                <option>Русский</option>
                <option>Кыргызча</option>
                <option>English</option>
              </select>
            </label>
            <label className={styles.row}>
              <span>Валюта</span>
              <select value={settings.currency} onChange={(e) => update({ currency: e.target.value })}>
                <option>KGS-Кыргызский сом</option>
                <option>USD-Доллар США</option>
                <option>EUR-Евро</option>
              </select>
            </label>
            <label className={styles.row}>
              <span>Часовой пояс</span>
              <select value={settings.timezone} onChange={(e) => update({ timezone: e.target.value })}>
                <option>Бишкек (GMT+6)</option>
                <option>Москва (GMT+3)</option>
                <option>Лондон (GMT+0)</option>
              </select>
            </label>
            <div className={styles.row}>
              <span>Тип аккаунта</span>
              <strong>{user.role === 'tourist' ? 'Конок (гость)' : 'Хозяин'}</strong>
            </div>
          </div>
        </section>

        <section className={t.panel}>
          <h2 className={styles.panelTitle}>
            <Bell size={24} /> Уведомления
          </h2>
          <div className={styles.rows}>
            <Toggle label="Сообщения" checked={settings.notifyMessages} onChange={(v) => update({ notifyMessages: v })} />
            <Toggle label="Напоминания о поездках" checked={settings.notifyTrips} onChange={(v) => update({ notifyTrips: v })} />
            <Toggle label="Рекомендации" checked={settings.notifyRecommendations} onChange={(v) => update({ notifyRecommendations: v })} />
          </div>
          <p className={styles.channelsTitle}>Получать уведомления через</p>
          <div className={styles.channels}>
            <label>
              <input type="checkbox" checked={settings.channelEmail} onChange={(e) => update({ channelEmail: e.target.checked })} /> Email
            </label>
            <label>
              <input type="checkbox" checked={settings.channelApp} onChange={(e) => update({ channelApp: e.target.checked })} /> В приложении
            </label>
          </div>
        </section>

        <section className={t.panel}>
          <h2 className={styles.panelTitle}>
            <ShieldCheck size={24} /> Безопасность
          </h2>
          <div className={styles.rows}>
            <div className={styles.row}>
              <span>
                Пароль
                <small>Последнее изменение: 12 сен 2026</small>
              </span>
              <button type="button" className={styles.linkBtn}>
                Изменить
              </button>
            </div>
            <div className={styles.row}>
              <span>
                Номер телефона
                <small>{user.phone || '—'}</small>
              </span>
              <button type="button" className={styles.linkBtn}>
                Изменить
              </button>
            </div>
            <div className={styles.row}>
              <span>
                Email
                <small>{user.email || '—'}</small>
              </span>
              <button type="button" className={styles.linkBtn}>
                Изменить
              </button>
            </div>
          </div>
        </section>

        <section className={t.panel}>
          <h2 className={styles.panelTitle}>
            <UserCog size={24} /> Управление аккаунтом
          </h2>
          <div className={styles.accountActions}>
            <button type="button" className={styles.accountBtn} onClick={signOut}>
              <LogOut size={20} /> Выйти из аккаунта
            </button>
            <button type="button" className={`${styles.accountBtn} ${styles.danger}`} onClick={() => setConfirmDelete(true)}>
              <Trash2 size={20} /> Удалить аккаунт
            </button>
          </div>
        </section>
      </div>

      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} title="Удалить аккаунт?" maxWidth="sm">
        <p className={styles.modalText}>Это демо-версия: аккаунт будет удалён только с этого устройства, и вы выйдете из системы.</p>
        <div className={styles.modalActions}>
          <button type="button" className={styles.accountBtn} onClick={() => setConfirmDelete(false)}>
            Отмена
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
            Удалить
          </button>
        </div>
      </Modal>
    </div>
  );
};
