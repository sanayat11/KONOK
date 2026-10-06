import React from 'react';
import clsx from 'clsx';
import styles from '../AuthPage.module.scss';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/** Figma input: bold 20px label over a 35px outlined box. */
export const TextField: React.FC<TextFieldProps> = ({ label, className, id, ...props }) => {
  const inputId = id ?? `f-${label}`;
  return (
    <div className={clsx(styles.field, className)}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input id={inputId} className={styles.input} {...props} />
    </div>
  );
};

const COUNTRY_CODES = [
  { code: '+996', flag: '🇰🇬' },
  { code: '+7', flag: '🇷🇺' },
  { code: '+7 ', flag: '🇰🇿' },
  { code: '+1', flag: '🇺🇸' },
];

interface PhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/** Figma phone field: flag dropdown + "+code number" box. Value is stored as "+996 700…". */
export const PhoneField: React.FC<PhoneFieldProps> = ({ value, onChange }) => {
  const current = COUNTRY_CODES.find((c) => value.startsWith(c.code.trim())) ?? COUNTRY_CODES[0];
  const number = value.slice(current.code.trim().length).trim();

  return (
    <div className={styles.field}>
      <label htmlFor="f-phone" className={styles.label}>
        Телефон
      </label>
      <div className={styles.phoneRow}>
        <select
          className={clsx(styles.input, styles.flagSelect)}
          aria-label="Код страны"
          value={current.code}
          onChange={(e) => onChange(`${e.target.value.trim()} ${number}`)}
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.flag} value={c.code}>
              {c.flag} {c.code.trim()}
            </option>
          ))}
        </select>
        <div className={clsx(styles.input, styles.phoneBox)}>
          <span>{current.code.trim()}</span>
          <input
            id="f-phone"
            type="tel"
            inputMode="tel"
            placeholder="number"
            value={number}
            onChange={(e) => onChange(`${current.code.trim()} ${e.target.value.replace(/[^\d\s-]/g, '')}`)}
            pattern="[\d\s-]{6,}"
            title="Не меньше 6 цифр"
            required
          />
        </div>
      </div>
    </div>
  );
};

interface TermsProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const TermsCheckbox: React.FC<TermsProps> = ({ checked, onChange }) => (
  <label className={styles.checkbox}>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} required />
    <span>
      Я принимаю <a href="#terms">Условия использования</a> и <a href="#privacy">Политику конфиденциальности</a>
    </span>
  </label>
);
