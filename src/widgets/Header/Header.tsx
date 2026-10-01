import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, User, LogOut, ChevronDown, Bookmark, Compass } from 'lucide-react';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { favorites } = useFavoritesStore();
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('RU');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>KӨNӨK</span>
          <span className={styles.logoBadge}>KG</span>
        </Link>

        {/* Right Action Bar */}
        <div className={styles.actions}>
          <Link to="/" className={styles.navLink}>
            О нас
          </Link>

          {/* Language Switcher */}
          <div className={styles.langWrapper}>
            <button
              className={styles.langButton}
              onClick={() => setLangOpen(!langOpen)}
              type="button"
            >
              <Globe size={16} />
              <span>{currentLang}</span>
              <ChevronDown size={14} className={langOpen ? styles.rotate : ''} />
            </button>
            {langOpen && (
              <div className={styles.dropdownMenu}>
                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    setCurrentLang('RU');
                    setLangOpen(false);
                  }}
                >
                  Русский (RU)
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    setCurrentLang('KG');
                    setLangOpen(false);
                  }}
                >
                  Кыргызча (KG)
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    setCurrentLang('EN');
                    setLangOpen(false);
                  }}
                >
                  English (EN)
                </button>
              </div>
            )}
          </div>

          {/* Favorites shortcut */}
          <Link to="/cabinet?tab=favorites" className={styles.favBadgeBtn} title="Избранное">
            <Bookmark size={18} />
            {favorites.length > 0 && (
              <span className={styles.favCount}>{favorites.length}</span>
            )}
          </Link>

          {/* User Auth Buttons */}
          {isAuthenticated && user ? (
            <div className={styles.userMenuWrapper}>
              <button
                className={styles.userButton}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                type="button"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className={styles.userAvatar}
                />
                <span className={styles.userName}>{user.fullName}</span>
                <ChevronDown size={14} />
              </button>

              {userMenuOpen && (
                <div className={styles.dropdownMenu}>
                  <Link
                    to="/cabinet?tab=profile"
                    className={styles.dropdownItem}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={16} />
                    <span>Профиль</span>
                  </Link>
                  <Link
                    to="/cabinet?tab=trips"
                    className={styles.dropdownItem}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Compass size={16} />
                    <span>Мои путешествия</span>
                  </Link>
                  <Link
                    to="/cabinet?tab=favorites"
                    className={styles.dropdownItem}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Bookmark size={16} />
                    <span>Избранное</span>
                  </Link>
                  <div className={styles.divider} />
                  <button
                    className={styles.dropdownItem}
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      navigate('/');
                    }}
                  >
                    <LogOut size={16} />
                    <span>Выйти</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authGroup}>
              <Link to="/auth?mode=login" className={styles.loginBtn}>
                Войти
              </Link>
              <Link to="/auth?mode=register" className={styles.registerBtn}>
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
