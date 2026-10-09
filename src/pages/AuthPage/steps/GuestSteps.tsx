import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Camera, Check, Fingerprint, Upload } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { useT } from '@/shared/i18n';
import { AuthCard } from '../ui/AuthCard';
import { PhoneField, TermsCheckbox, TextField, validators } from '../ui/fields';
import styles from '../AuthPage.module.scss';

const splitName = (fullName: string) => {
  const [first = '', ...rest] = fullName.trim().split(/\s+/);
  return { first, last: rest.join(' ') };
};

type AccountErrors = Partial<Record<'first' | 'last' | 'email' | 'phone' | 'password' | 'terms', string>>;

/** Shared account form for guests and hosts (step 1 of both flows). */
export const AccountForm: React.FC<{
  fullName: string;
  email: string;
  phone: string;
  terms: boolean;
  onChange: (patch: { email?: string; phone?: string; terms?: boolean }) => void;
  onSubmit: (fullName: string) => void;
  submitLabel: string;
}> = ({ fullName, email, phone, terms, onChange, onSubmit, submitLabel }) => {
  const { t } = useT();
  const initial = splitName(fullName);
  const [first, setFirst] = useState(initial.first);
  const [last, setLast] = useState(initial.last);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<AccountErrors>({});
  const clear = (key: keyof AccountErrors) => setErrors((v) => ({ ...v, [key]: undefined }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const required = t('auth.errors.required');
    const next: AccountErrors = {
      first: validators.required(first) ? undefined : required,
      last: validators.required(last) ? undefined : required,
      email: !validators.required(email) ? required : validators.email(email) ? undefined : t('auth.errors.email'),
      phone: validators.phone(phone) ? undefined : t('auth.errors.phone'),
      password: validators.password(password) ? undefined : t('auth.errors.password'),
      terms: terms ? undefined : t('auth.errors.terms'),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    onSubmit(`${first.trim()} ${last.trim()}`.trim());
  };

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.twoCols}>
        <TextField
          label={t('auth.firstName')}
          placeholder={t('auth.firstNamePlaceholder')}
          value={first}
          onChange={(e) => {
            setFirst(e.target.value);
            clear('first');
          }}
          error={errors.first}
          autoComplete="given-name"
        />
        <TextField
          label={t('auth.lastName')}
          placeholder={t('auth.lastNamePlaceholder')}
          value={last}
          onChange={(e) => {
            setLast(e.target.value);
            clear('last');
          }}
          error={errors.last}
          autoComplete="family-name"
        />
      </div>
      <TextField
        label={t('auth.email')}
        type="email"
        placeholder={t('auth.emailPlaceholder')}
        value={email}
        onChange={(e) => {
          onChange({ email: e.target.value });
          clear('email');
        }}
        error={errors.email}
        autoComplete="email"
      />
      <PhoneField
        value={phone}
        onChange={(value) => {
          onChange({ phone: value });
          clear('phone');
        }}
        error={errors.phone}
      />
      <TextField
        label={t('auth.password')}
        type="password"
        placeholder="••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          clear('password');
        }}
        error={errors.password}
        hint={t('auth.passwordHint')}
        autoComplete="new-password"
      />
      <TermsCheckbox
        checked={terms}
        onChange={(value) => {
          onChange({ terms: value });
          clear('terms');
        }}
        error={errors.terms}
      />
      <button type="submit" className={styles.submit}>
        {submitLabel} <ArrowRight size={16} />
      </button>
    </form>
  );
};

/** Step 1 — account. */
export const GuestFormStep: React.FC<{ onBack: () => void; onNext: () => void }> = ({ onBack, onNext }) => {
  const { t } = useT();
  const { touristForm, updateTouristForm } = useAuthStore();

  return (
    <AuthCard title={t('auth.guestTitle')} subtitle={t('auth.guestSubtitle')} onBack={onBack}>
      <AccountForm
        fullName={touristForm.fullName}
        email={touristForm.email}
        phone={touristForm.phone}
        terms={touristForm.termsAccepted}
        onChange={({ email, phone, terms }) =>
          updateTouristForm({
            ...(email !== undefined && { email }),
            ...(phone !== undefined && { phone }),
            ...(terms !== undefined && { termsAccepted: terms }),
          })
        }
        onSubmit={(fullName) => {
          updateTouristForm({ fullName });
          onNext();
        }}
        submitLabel={t('common.continue')}
      />
    </AuthCard>
  );
};

const RESEND_SECONDS = 45;

/** Step 2 — 4-digit code with a resend timer. */
export const GuestOtpStep: React.FC<{ onBack: () => void; onNext: () => void }> = ({ onBack, onNext }) => {
  const { t } = useT();
  const { touristForm, updateTouristForm } = useAuthStore();
  const code = touristForm.otpCode;
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [error, setError] = useState<string>();

  // Focus the first box when the step opens.
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const setDigit = (index: number, digit: string) => {
    const next = [...code];
    next[index] = digit;
    updateTouristForm({ otpCode: next });
    setError(undefined);
    if (digit && index < code.length - 1) inputs.current[index + 1]?.focus();
  };

  const complete = code.every((d) => /^\d$/.test(d));
  const maskedPhone = touristForm.phone.replace(/\d(?=(?:\D*\d){2})/g, '•');

  return (
    <AuthCard
      title={t('auth.otpTitle')}
      subtitle={t('auth.otpSubtitle', { phone: maskedPhone })}
      onBack={onBack}
     
    >
      <form
        className={styles.form}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (complete) onNext();
          else setError(t('auth.errors.otp'));
        }}
      >
        <div
          className={clsx(styles.otp, error && styles.otpInvalid)}
          onPaste={(e) => {
            const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4).split('');
            if (digits.length === 4) {
              e.preventDefault();
              updateTouristForm({ otpCode: digits });
              setError(undefined);
              inputs.current[3]?.focus();
            }
          }}
        >
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el;
              }}
              className={clsx(styles.otpBox, digit && styles.otpFilled)}
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={digit}
              aria-label={t('auth.otpDigit', { index: index + 1 })}
              aria-invalid={Boolean(error)}
              onChange={(e) => setDigit(index, e.target.value.replace(/\D/g, '').slice(-1))}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !digit && index > 0) inputs.current[index - 1]?.focus();
                if (e.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus();
                if (e.key === 'ArrowRight' && index < code.length - 1) inputs.current[index + 1]?.focus();
              }}
            />
          ))}
        </div>
        {error && (
          <p className={clsx(styles.error, styles.center)} role="alert">
            <AlertCircle size={13} /> {error}
          </p>
        )}

        <div className={styles.resend}>
          <span>{t('auth.otpNoCode')}</span>
          {secondsLeft > 0 ? (
            <span className={styles.muted}>
              {t('auth.otpResendIn', { time: `0:${String(secondsLeft).padStart(2, '0')}` })}
            </span>
          ) : (
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => {
                updateTouristForm({ otpCode: ['', '', '', ''] });
                setSecondsLeft(RESEND_SECONDS);
                inputs.current[0]?.focus();
              }}
            >
              {t('auth.otpResend')}
            </button>
          )}
        </div>

        <button type="submit" className={styles.submit}>
          {t('auth.otpConfirm')}
        </button>
        <p className={styles.demoNote}>{t('auth.otpDemo')}</p>
      </form>
    </AuthCard>
  );
};

interface UploadBoxProps {
  icon: React.ReactNode;
  title: string;
  file: File | null;
  onFile: (file: File | null) => void;
  invalid?: boolean;
}

const UploadBox: React.FC<UploadBoxProps> = ({ icon, title, file, onFile, invalid }) => {
  const { t } = useT();
  return (
    <label className={clsx(styles.dropzone, file && styles.dropzoneDone, invalid && styles.dropzoneInvalid)}>
      <span className={styles.dropzoneIcon}>{file ? <Check size={18} /> : icon}</span>
      <span className={styles.dropzoneText}>
        <strong>{title}</strong>
        <small>{file ? file.name : t('auth.uploadHint')}</small>
      </span>
      <span className={styles.uploadBtn}>
        <Upload size={14} /> {t('auth.upload')}
      </span>
      <input type="file" accept="image/*,.pdf" onChange={(e) => onFile(e.target.files?.[0] ?? null)} className="visually-hidden" />
    </label>
  );
};

/** Step 3 — passport scan + selfie. */
export const GuestPassportStep: React.FC<{ onBack: () => void; onDone: () => void }> = ({ onBack, onDone }) => {
  const { t } = useT();
  const [passport, setPassport] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [tried, setTried] = useState(false);

  return (
    <AuthCard title={t('auth.idTitle')} subtitle={t('auth.idSubtitle')} onBack={onBack}>
      <form
        className={styles.form}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          setTried(true);
          if (passport && selfie && confirmed) onDone();
        }}
      >
        <UploadBox icon={<Fingerprint size={18} />} title={t('auth.idPassport')} file={passport} onFile={setPassport} invalid={tried && !passport} />
        <UploadBox icon={<Camera size={18} />} title={t('auth.idSelfie')} file={selfie} onFile={setSelfie} invalid={tried && !selfie} />
        <label className={clsx(styles.checkbox, tried && !confirmed && styles.checkboxInvalid)}>
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          <span>{t('auth.idConfirm')}</span>
        </label>
        <button type="submit" className={styles.submit}>
          {t('auth.idSubmit')}
        </button>
        <p className={styles.demoNote}>{t('auth.filesNote')}</p>
      </form>
    </AuthCard>
  );
};
