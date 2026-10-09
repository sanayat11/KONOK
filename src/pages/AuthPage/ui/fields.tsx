import React, { useId, useState } from 'react';
import clsx from 'clsx';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useT } from '@/shared/i18n';
import styles from '../AuthPage.module.scss';

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

/** Label + control + hint/error, wired with aria-describedby by the caller. */
const FieldShell: React.FC<FieldShellProps> = ({ id, label, error, hint, className, children }) => (
  <div className={clsx(styles.field, className)}>
    <label htmlFor={id} className={styles.label}>
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${id}-msg`} className={styles.error} role="alert">
        <AlertCircle size={13} /> {error}
      </p>
    ) : (
      hint && (
        <p id={`${id}-msg`} className={styles.hint}>
          {hint}
        </p>
      )
    )}
  </div>
);

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextField: React.FC<TextFieldProps> = ({ label, error, hint, className, id, type = 'text', ...props }) => {
  const { t } = useT();
  const autoId = useId();
  const inputId = id ?? autoId;
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <FieldShell id={inputId} label={label} error={error} hint={hint} className={className}>
      <div className={clsx(styles.inputWrap, error && styles.invalid)}>
        <input
          id={inputId}
          type={isPassword && visible ? 'text' : type}
          className={styles.input}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${inputId}-msg` : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.reveal}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? t('auth.hidePassword') : t('auth.showPassword')}
            aria-pressed={visible}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </FieldShell>
  );
};

const COUNTRY_CODES = [
  { id: 'kg', code: '+996', flag: '🇰🇬' },
  { id: 'ru', code: '+7', flag: '🇷🇺' },
  { id: 'kz', code: '+7', flag: '🇰🇿' },
  { id: 'us', code: '+1', flag: '🇺🇸' },
];

interface PhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/** Country code + number. Value is stored as "+996 700…". */
export const PhoneField: React.FC<PhoneFieldProps> = ({ value, onChange, error }) => {
  const { t } = useT();
  const id = useId();
  const [countryId, setCountryId] = useState(
    () => COUNTRY_CODES.find((c) => value.startsWith(c.code))?.id ?? COUNTRY_CODES[0].id,
  );
  const current = COUNTRY_CODES.find((c) => c.id === countryId) ?? COUNTRY_CODES[0];
  const number = value.startsWith(current.code) ? value.slice(current.code.length).trim() : value;

  return (
    <FieldShell id={id} label={t('auth.phone')} error={error}>
      <div className={clsx(styles.phoneRow, error && styles.invalid)}>
        <select
          className={styles.flagSelect}
          aria-label={t('auth.countryCode')}
          value={current.id}
          onChange={(e) => {
            const next = COUNTRY_CODES.find((c) => c.id === e.target.value) ?? COUNTRY_CODES[0];
            setCountryId(next.id);
            onChange(`${next.code} ${number}`);
          }}
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="700 123 456"
          className={styles.phoneInput}
          value={number}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-msg` : undefined}
          onChange={(e) => onChange(`${current.code} ${e.target.value.replace(/[^\d\s-]/g, '')}`)}
        />
      </div>
    </FieldShell>
  );
};

interface TermsProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export const TermsCheckbox: React.FC<TermsProps> = ({ checked, onChange, error }) => {
  const { t } = useT();
  return (
    <div>
      <label className={clsx(styles.checkbox, error && styles.checkboxInvalid)}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={Boolean(error)} />
        <span>
          {t('auth.termsPrefix')} <a href="#terms">{t('auth.terms')}</a> {t('auth.termsAnd')}{' '}
          <a href="#privacy">{t('auth.privacy')}</a>
        </span>
      </label>
      {error && (
        <p className={styles.error} role="alert">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
};

/** Shared rules (kept identical to the original HTML constraints: phone ≥ 6 digits, password ≥ 6). */
export const validators = {
  required: (value: string) => value.trim().length > 0,
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
  phone: (value: string) => value.replace(/^\+\d+\s*/, '').replace(/\D/g, '').length >= 6,
  password: (value: string) => value.length >= 6,
};
