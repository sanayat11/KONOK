import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useAuthStore, loadRegisteredUser } from '@/shared/lib/store/useAuthStore';
import { AuthCard } from '../ui/AuthCard';
import { TextField } from '../ui/fields';
import styles from '../AuthPage.module.scss';

interface LoginStepProps {
  onDone: () => void;
  onRegister: () => void;
}

/** Not in Figma; built from the same card/inputs as the registration screens. */
export const LoginStep: React.FC<LoginStepProps> = ({ onDone, onRegister }) => {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthCard title="Вход в аккаунт" subtitle="Рады видеть вас снова в Конок">
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          // Frontend-only: an account created via registration signs back in by email; otherwise the demo guest.
          const registered = loadRegisteredUser();
          login(registered && registered.email === email.trim() ? registered : undefined);
          onDone();
        }}
      >
        <TextField label="Email" type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <TextField label="Пароль" type="password" placeholder="··········" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="current-password" />
        <button type="submit" className={styles.submit}>
          Войти <ArrowRight size={22} />
        </button>
        <p className={styles.switchText}>
          Нет аккаунта?{' '}
          <button type="button" className={styles.linkBtn} onClick={onRegister}>
            Зарегистрироваться
          </button>
        </p>
      </form>
    </AuthCard>
  );
};
