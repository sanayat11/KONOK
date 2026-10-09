import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useAuthStore, loadRegisteredUser } from '@/shared/lib/store/useAuthStore';
import { useT } from '@/shared/i18n';
import { AuthCard } from '../ui/AuthCard';
import { TextField, validators } from '../ui/fields';
import styles from '../AuthPage.module.scss';

interface LoginStepProps {
  onDone: () => void;
  onRegister: () => void;
}

type Errors = Partial<Record<'email' | 'password', string>>;

/** Built from the same card and inputs as the registration screens. */
export const LoginStep: React.FC<LoginStepProps> = ({ onDone, onRegister }) => {
  const { t } = useT();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {
      email: !validators.required(email) ? t('auth.errors.required') : !validators.email(email) ? t('auth.errors.email') : undefined,
      password: !validators.password(password) ? t('auth.errors.password') : undefined,
    };
    setErrors(next);
    if (next.email || next.password) return;

    setSubmitting(true);
    // Frontend-only: an account created via registration signs back in by email; otherwise the demo guest.
    const registered = loadRegisteredUser();
    login(registered && registered.email === email.trim() ? registered : undefined);
    onDone();
  };

  return (
    <AuthCard title={t('auth.loginTitle')} subtitle={t('auth.loginSubtitle')}>
      <form className={styles.form} onSubmit={submit} noValidate>
        <TextField
          label={t('auth.email')}
          type="email"
          placeholder={t('auth.emailPlaceholder')}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((v) => ({ ...v, email: undefined }));
          }}
          error={errors.email}
          autoComplete="email"
          autoFocus
        />
        <TextField
          label={t('auth.password')}
          type="password"
          placeholder="••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((v) => ({ ...v, password: undefined }));
          }}
          error={errors.password}
          autoComplete="current-password"
        />
        <button type="submit" className={styles.submit} disabled={submitting}>
          {t('auth.loginSubmit')} <ArrowRight size={16} />
        </button>
        <p className={styles.demoNote}>{t('common.demoNote')}</p>
        <p className={styles.switchText}>
          {t('auth.noAccount')}{' '}
          <button type="button" className={styles.linkBtn} onClick={onRegister}>
            {t('auth.createAccount')}
          </button>
        </p>
      </form>
    </AuthCard>
  );
};
