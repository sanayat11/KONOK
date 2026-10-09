import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { CalendarDays, Heart, LogOut, MessageSquareText, Repeat, Settings, User } from 'lucide-react';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { useUnreadCount } from '@/entities/chat';
import { mockDemoAccounts } from '@/shared/api/mocks/chatUsers';
import { useT, type TranslationKey } from '@/shared/i18n';
import { Avatar } from '@/shared/ui/Avatar';
import { Logo } from '@/shared/ui/Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useDismiss } from './useDismiss';
import styles from './Header.module.scss';

const roleKey = (role: string): TranslationKey =>
  role === 'tourist' ? 'nav.roleGuest' : role === 'guide' ? 'nav.roleGuide' : 'nav.roleHost';

export interface HeaderProps {
  /** Transparent header laid over the hero photo (home). */
  transparent?: boolean;
}

/** Figma: green bar — logo on the left; "About", language and account actions on the right. */
export const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const navigate = useNavigate();
  const { t } = useT();
  const { isAuthenticated, user, logout, switchAccount } = useAuthStore();
  const unreadMessages = useUnreadCount(user?.id);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const closeUserMenu = useCallback(() => setUserMenuOpen(false), []);
  const userRef = useDismiss(userMenuOpen, closeUserMenu);

  const isOwner = user?.role === 'host' || user?.role === 'guide';
  const messagesLabel = unreadMessages > 0 ? t('nav.messagesUnread', { count: unreadMessages }) : t('nav.messages');

  return (
    <header className={clsx(styles.header, transparent && styles.transparent)}>
      <a href="#main" className="skip-link">
        {t('nav.skipToContent')}
      </a>
      <div className={styles.container}>
        <Logo className={styles.logo} />

        <div className={styles.actions}>
          <Link to="/" className={clsx(styles.outlineBtn, styles.aboutBtn)}>
            {t('nav.about')}
          </Link>

          <LanguageSwitcher />

          {isAuthenticated && user ? (
            <>
              <Link to="/messages" className={styles.iconBtn} aria-label={messagesLabel} title={t('nav.messages')}>
                <MessageSquareText size={24} strokeWidth={1.6} />
                {unreadMessages > 0 && (
                  <span className={styles.badge} aria-hidden="true">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </Link>

              <div className={styles.dropdownWrapper} ref={userRef}>
                <button
                  className={styles.avatarBtn}
                  onClick={() => setUserMenuOpen((v) => !v)}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  aria-label={t('nav.profileMenu')}
                >
                  <Avatar src={user.avatarUrl} name={user.fullName} size={34} className={styles.avatar} />
                </button>

                {userMenuOpen && (
                  <div className={clsx(styles.dropdownMenu, styles.userMenu)} role="menu">
                    <div className={styles.menuUser}>
                      <Avatar src={user.avatarUrl} name={user.fullName} size={38} />
                      <div className={styles.menuUserText}>
                        <div className={styles.menuName}>{user.fullName}</div>
                        <div className={styles.menuRole}>{t(roleKey(user.role))}</div>
                      </div>
                    </div>
                    <div className={styles.divider} />
                    <Link to="/cabinet?tab=profile" role="menuitem" className={styles.dropdownItem} onClick={closeUserMenu}>
                      <User size={16} />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <Link to="/cabinet?tab=trips" role="menuitem" className={styles.dropdownItem} onClick={closeUserMenu}>
                      <CalendarDays size={16} />
                      <span>{t(isOwner ? 'nav.hostBookings' : 'nav.myBookings')}</span>
                    </Link>
                    {!isOwner && (
                      <Link to="/cabinet?tab=favorites" role="menuitem" className={styles.dropdownItem} onClick={closeUserMenu}>
                        <Heart size={16} />
                        <span>{t('nav.favorites')}</span>
                      </Link>
                    )}
                    <Link to="/messages" role="menuitem" className={styles.dropdownItem} onClick={closeUserMenu}>
                      <MessageSquareText size={16} />
                      <span>{t('nav.messages')}</span>
                      {unreadMessages > 0 && <span className={styles.menuCount}>{unreadMessages}</span>}
                    </Link>
                    <Link to="/cabinet?tab=settings" role="menuitem" className={styles.dropdownItem} onClick={closeUserMenu}>
                      <Settings size={16} />
                      <span>{t('nav.settings')}</span>
                    </Link>
                    <div className={styles.divider} />
                    {/* Demo-only: the app runs on mock data, so allow switching between sides of a chat. */}
                    <span className={styles.menuLabel}>{t('nav.demoAccount')}</span>
                    {mockDemoAccounts
                      .filter((account) => account.id !== user.id)
                      .map((account) => (
                        <button
                          key={account.id}
                          type="button"
                          role="menuitem"
                          className={styles.dropdownItem}
                          onClick={() => {
                            switchAccount(account.id);
                            closeUserMenu();
                            navigate('/messages');
                          }}
                        >
                          <Repeat size={16} />
                          <span className={styles.itemText}>
                            {account.fullName} · {t(roleKey(account.role))}
                          </span>
                        </button>
                      ))}
                    <div className={styles.divider} />
                    <button
                      type="button"
                      role="menuitem"
                      className={styles.dropdownItem}
                      onClick={() => {
                        logout();
                        closeUserMenu();
                        navigate('/');
                      }}
                    >
                      <LogOut size={16} />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/auth?mode=login" className={styles.outlineBtn}>
                {t('nav.login')}
              </Link>
              <Link to="/auth?mode=register" className={styles.registerBtn}>
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
