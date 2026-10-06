import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Bookmark,
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  Globe,
  LogOut,
  MessageSquareText,
  Repeat,
  Settings,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { useUnreadCount } from '@/entities/chat';
import { mockDemoAccounts } from '@/shared/api/mocks/chatUsers';
import { Logo } from '@/shared/ui/Logo';
import styles from './Header.module.scss';

const LANGUAGES = [
  { code: 'RU', label: 'Русский (RU)' },
  { code: 'KG', label: 'Кыргызча (KG)' },
  { code: 'EN', label: 'English (EN)' },
];

/** Closes a dropdown on outside click / Escape. */
const useDismiss = (open: boolean, close: () => void) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);
  return ref;
};

export interface HeaderProps {
  /** Transparent header laid over the hero photo (home, auth). */
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, switchAccount } = useAuthStore();
  const unreadMessages = useUnreadCount(user?.id);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('RU');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langRef = useDismiss(langOpen, () => setLangOpen(false));
  const userRef = useDismiss(userMenuOpen, () => setUserMenuOpen(false));

  const isOwner = user?.role === 'host' || user?.role === 'guide';
  const closeMenu = () => setUserMenuOpen(false);

  return (
    <header className={clsx(styles.header, transparent && styles.transparent)}>
      <div className={styles.container}>
        <Logo className={styles.logo} />

        <div className={styles.actions}>
          <Link to="/" className={clsx(styles.outlineBtn, styles.aboutBtn)}>
            О нас
          </Link>

          <div className={styles.dropdownWrapper} ref={langRef}>
            <button
              className={styles.langButton}
              onClick={() => setLangOpen((v) => !v)}
              type="button"
              aria-haspopup="menu"
              aria-expanded={langOpen}
            >
              <Globe size={25} strokeWidth={1.6} />
              <span>{currentLang}</span>
              <ChevronDown size={15} className={clsx(styles.chevron, langOpen && styles.rotate)} />
            </button>
            {langOpen && (
              <div className={styles.dropdownMenu} role="menu">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    role="menuitem"
                    className={clsx(styles.dropdownItem, lang.code === currentLang && styles.itemActive)}
                    onClick={() => {
                      setCurrentLang(lang.code);
                      setLangOpen(false);
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated && user ? (
            <>
              <Link
                to="/messages"
                className={styles.iconBtn}
                aria-label={unreadMessages > 0 ? `Сообщения, непрочитанных: ${unreadMessages}` : 'Сообщения'}
                title="Сообщения"
              >
                <MessageSquareText size={30} strokeWidth={1.6} />
                {unreadMessages > 0 && (
                  <span className={styles.badge}>{unreadMessages > 9 ? '9+' : unreadMessages}</span>
                )}
              </Link>

              <div className={styles.dropdownWrapper} ref={userRef}>
                <button
                  className={styles.iconBtn}
                  onClick={() => setUserMenuOpen((v) => !v)}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  aria-label="Меню профиля"
                >
                  <CircleUserRound size={40} strokeWidth={1.5} />
                </button>

                {userMenuOpen && (
                  <div className={clsx(styles.dropdownMenu, styles.userMenu)} role="menu">
                    <div className={styles.menuUser}>
                      <img src={user.avatarUrl} alt="" className={styles.menuAvatar} />
                      <div>
                        <div className={styles.menuName}>{user.fullName}</div>
                        <div className={styles.menuRole}>{isOwner ? 'Хозяин' : 'Конок (гость)'}</div>
                      </div>
                    </div>
                    <div className={styles.divider} />
                    <Link to="/cabinet?tab=profile" className={styles.dropdownItem} onClick={closeMenu}>
                      <User size={18} />
                      <span>Профиль</span>
                    </Link>
                    <Link to="/cabinet?tab=trips" className={styles.dropdownItem} onClick={closeMenu}>
                      <CalendarDays size={18} />
                      <span>{isOwner ? 'Бронирование' : 'Мои бронирования'}</span>
                    </Link>
                    {!isOwner && (
                      <Link to="/cabinet?tab=favorites" className={styles.dropdownItem} onClick={closeMenu}>
                        <Bookmark size={18} />
                        <span>Избранное</span>
                      </Link>
                    )}
                    <Link to="/messages" className={styles.dropdownItem} onClick={closeMenu}>
                      <MessageSquareText size={18} />
                      <span>Сообщения</span>
                      {unreadMessages > 0 && <span className={styles.menuCount}>{unreadMessages}</span>}
                    </Link>
                    <Link to="/cabinet?tab=settings" className={styles.dropdownItem} onClick={closeMenu}>
                      <Settings size={18} />
                      <span>Настройки</span>
                    </Link>
                    <div className={styles.divider} />
                    {/* Demo-only: the app runs on mock data, so allow switching between sides of a chat. */}
                    <span className={styles.menuLabel}>Демо-аккаунт</span>
                    {mockDemoAccounts
                      .filter((account) => account.id !== user.id)
                      .map((account) => (
                        <button
                          key={account.id}
                          type="button"
                          className={styles.dropdownItem}
                          onClick={() => {
                            switchAccount(account.id);
                            closeMenu();
                            navigate('/messages');
                          }}
                        >
                          <Repeat size={18} />
                          <span>
                            {account.fullName} · {account.role === 'tourist' ? 'гость' : 'хозяин'}
                          </span>
                        </button>
                      ))}
                    <div className={styles.divider} />
                    <button
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => {
                        logout();
                        closeMenu();
                        navigate('/');
                      }}
                    >
                      <LogOut size={18} />
                      <span>Выйти</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/auth?mode=login" className={clsx(styles.outlineBtn, styles.loginBtn)}>
                Войти
              </Link>
              <Link to="/auth?mode=register" className={styles.registerBtn}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
