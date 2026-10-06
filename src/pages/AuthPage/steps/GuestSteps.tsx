import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Camera, Fingerprint } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { AuthCard } from '../ui/AuthCard';
import { PhoneField, TermsCheckbox, TextField } from '../ui/fields';
import styles from '../AuthPage.module.scss';

const splitName = (fullName: string) => {
  const [first = '', ...rest] = fullName.trim().split(/\s+/);
  return { first, last: rest.join(' ') };
};

/** Step 1 — "Регистрация гостя". */
export const GuestFormStep: React.FC<{ onBack: () => void; onNext: () => void }> = ({ onBack, onNext }) => {
  const { touristForm, updateTouristForm } = useAuthStore();
  const initial = splitName(touristForm.fullName);
  const [first, setFirst] = useState(initial.first);
  const [last, setLast] = useState(initial.last);
  const [password, setPassword] = useState('');

  return (
    <AuthCard title="Регистрация гостя" subtitle="Создайте аккаунт, чтобы начать планировать свое путешествие по Кыргызстану" onBack={onBack}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          updateTouristForm({ fullName: `${first.trim()} ${last.trim()}`.trim() });
          onNext();
        }}
      >
        <TextField label="Имя" placeholder="Ваше имя" value={first} onChange={(e) => setFirst(e.target.value)} required autoComplete="given-name" />
        <TextField label="Фамилия" placeholder="Ваша фамилия" value={last} onChange={(e) => setLast(e.target.value)} required autoComplete="family-name" />
        <TextField label="Email" type="email" placeholder="example@email.com" value={touristForm.email} onChange={(e) => updateTouristForm({ email: e.target.value })} required autoComplete="email" />
        <PhoneField value={touristForm.phone} onChange={(phone) => updateTouristForm({ phone })} />
        <TextField label="Пароль" type="password" placeholder="··········" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
        <TermsCheckbox checked={touristForm.termsAccepted} onChange={(termsAccepted) => updateTouristForm({ termsAccepted })} />
        <button type="submit" className={styles.submit}>
          Продолжить <ArrowRight size={22} />
        </button>
      </form>
    </AuthCard>
  );
};

const RESEND_SECONDS = 45;

/** Step 2 — "Подтвердите контакт": 4-digit code with a resend timer. */
export const GuestOtpStep: React.FC<{ onBack: () => void; onNext: () => void }> = ({ onBack, onNext }) => {
  const { touristForm, updateTouristForm } = useAuthStore();
  const code = touristForm.otpCode;
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const setDigit = (index: number, digit: string) => {
    const next = [...code];
    next[index] = digit;
    updateTouristForm({ otpCode: next });
    if (digit && index < code.length - 1) inputs.current[index + 1]?.focus();
  };

  const complete = code.every((d) => /^\d$/.test(d));
  const maskedPhone = touristForm.phone.replace(/\d(?=(?:\D*\d){2})/g, '·');

  return (
    <AuthCard title="Подтвердите контакт" subtitle={`Мы отправили код на ваш номер телефона ${maskedPhone}`} onBack={onBack}>
      <form
        className={clsx(styles.form, styles.formTall)}
        onSubmit={(e) => {
          e.preventDefault();
          if (complete) onNext();
        }}
      >
        <div className={styles.otp} onPaste={(e) => {
          const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4).split('');
          if (digits.length === 4) {
            e.preventDefault();
            updateTouristForm({ otpCode: digits });
          }
        }}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el;
              }}
              className={styles.otpBox}
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={digit}
              aria-label={`Цифра ${index + 1}`}
              onChange={(e) => setDigit(index, e.target.value.replace(/\D/g, '').slice(-1))}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !digit && index > 0) inputs.current[index - 1]?.focus();
              }}
            />
          ))}
        </div>

        <div className={styles.resend}>
          <p>Не получили код?</p>
          {secondsLeft > 0 ? (
            <p>
              <span className={styles.muted}>Отправить снова</span>
              <br />
              через 00:{String(secondsLeft).padStart(2, '0')}
            </p>
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
              Отправить снова
            </button>
          )}
        </div>

        <button type="submit" className={styles.submit} disabled={!complete}>
          Подтвердить
        </button>
      </form>
    </AuthCard>
  );
};

interface UploadBoxProps {
  icon: React.ReactNode;
  title: string;
  file: File | null;
  onFile: (file: File | null) => void;
}

/** Figma dashed upload zone with a red "Загрузить файл" button. */
const UploadBox: React.FC<UploadBoxProps> = ({ icon, title, file, onFile }) => (
  <div className={clsx(styles.dropzone, file && styles.dropzoneDone)}>
    <div className={styles.dropzoneHead}>
      {icon}
      <span>{title}</span>
    </div>
    <label className={styles.uploadBtn}>
      {file ? `✓ ${file.name}` : 'Загрузить файл'}
      <input type="file" accept="image/*,.pdf" onChange={(e) => onFile(e.target.files?.[0] ?? null)} className="visually-hidden" />
    </label>
  </div>
);

/** Step 3 — "Подтвердите личность": passport scan + selfie. */
export const GuestPassportStep: React.FC<{ onBack: () => void; onDone: () => void }> = ({ onBack, onDone }) => {
  const [passport, setPassport] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <AuthCard title="Подтвердите личность" subtitle="Для обеспечения безопасности Конок, пожалуйста, загрузите скан вашего паспорта и селфи с паспортом." onBack={onBack}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          if (passport && selfie && confirmed) onDone();
        }}
      >
        <UploadBox icon={<Fingerprint size={44} strokeWidth={1.3} />} title="1. Скан паспорта (главный разворот)" file={passport} onFile={setPassport} />
        <UploadBox icon={<Camera size={44} strokeWidth={1.3} />} title="2. Селфи с паспортом" file={selfie} onFile={setSelfie} />
        <label className={styles.checkbox}>
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} required />
          <span>Я подтверждаю, что загруженные документы являются достоверными и действительными</span>
        </label>
        <button type="submit" className={styles.submit} disabled={!passport || !selfie || !confirmed}>
          Подтвердить и отправить
        </button>
      </form>
    </AuthCard>
  );
};
