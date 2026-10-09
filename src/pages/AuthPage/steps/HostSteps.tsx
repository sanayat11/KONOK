import React, { useState } from 'react';
import { AlertCircle, Camera, Check, ChevronDown, LockKeyhole, Minus, PlayCircle, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { useT, type TranslationKey } from '@/shared/i18n';
import { LANGUAGE_CODES, languageCode, languageKey } from '@/shared/lib/taxonomy';
import { AuthCard } from '../ui/AuthCard';
import { TextField, validators } from '../ui/fields';
import { AccountForm } from './GuestSteps';
import styles from '../AuthPage.module.scss';

const TOTAL = 4;

interface StepProps {
  onBack: () => void;
  onNext: () => void;
}

/** Bottom "Back / Continue" pair used on host steps 2–4. */
const StepActions: React.FC<{ onBack: () => void; nextLabel?: string }> = ({ onBack, nextLabel }) => {
  const { t } = useT();
  return (
    <div className={styles.stepActions}>
      <button type="button" className={styles.secondaryBtn} onClick={onBack}>
        {t('common.back')}
      </button>
      <button type="submit" className={styles.submit}>
        {nextLabel ?? t('common.continue')}
      </button>
    </div>
  );
};

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <p className={styles.error} role="alert">
      <AlertCircle size={13} /> {message}
    </p>
  ) : null;

/** Step 1 — account (same form as guests). */
export const HostAccountStep: React.FC<StepProps> = ({ onBack, onNext }) => {
  const { t } = useT();
  const { hostForm, updateHostForm } = useAuthStore();
  const [terms, setTerms] = useState(false);

  return (
    <AuthCard title={t('auth.hostTitle')} subtitle={t('auth.hostSubtitle')} onBack={onBack} step={{ current: 1, total: TOTAL }}>
      <AccountForm
        fullName={hostForm.fullName}
        email={hostForm.email}
        phone={hostForm.phone}
        terms={terms}
        onChange={({ email, phone, terms: accepted }) => {
          if (email !== undefined) updateHostForm({ email });
          if (phone !== undefined) updateHostForm({ phone });
          if (accepted !== undefined) setTerms(accepted);
        }}
        onSubmit={(fullName) => {
          updateHostForm({ fullName });
          onNext();
        }}
        submitLabel={t('common.continue')}
      />
    </AuthCard>
  );
};

const REGIONS = ['issykKul', 'naryn', 'chuy', 'talas', 'osh', 'jalalAbad', 'batken', 'bishkek'] as const;

type AboutErrors = Partial<Record<'about' | 'locality' | 'languages' | 'email', string>>;

/** Step 2 — about you. */
export const HostAboutStep: React.FC<StepProps> = ({ onBack, onNext }) => {
  const { t } = useT();
  const { hostForm, updateHostForm } = useAuthStore();
  const [video, setVideo] = useState<File | null>(null);
  const [errors, setErrors] = useState<AboutErrors>({});
  const selected = hostForm.languages.map(languageCode).filter((c): c is NonNullable<typeof c> => c !== null);
  const available = LANGUAGE_CODES.filter((code) => !selected.includes(code));
  const clear = (key: keyof AboutErrors) => setErrors((v) => ({ ...v, [key]: undefined }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const required = t('auth.errors.required');
    const next: AboutErrors = {
      about: validators.required(hostForm.about) ? undefined : required,
      locality: validators.required(hostForm.locality) ? undefined : required,
      languages: selected.length > 0 ? undefined : required,
      email: validators.email(hostForm.email) ? undefined : t('auth.errors.email'),
    };
    setErrors(next);
    if (!Object.values(next).some(Boolean)) onNext();
  };

  return (
    <AuthCard title={t('auth.aboutTitle')} subtitle={t('auth.aboutSubtitle')} onBack={onBack} step={{ current: 2, total: TOTAL }} wide>
      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.aboutRow}>
          <label className={styles.avatarPicker} title={t('auth.changePhoto')}>
            <img src={hostForm.avatarUrl} alt={t('auth.photo')} />
            <span className={styles.avatarBadge}>
              <Camera size={14} />
            </span>
            <input
              type="file"
              accept="image/*"
              className="visually-hidden"
              aria-label={t('auth.changePhoto')}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) updateHostForm({ avatarUrl: URL.createObjectURL(file) });
              }}
            />
          </label>
          <div className={styles.field}>
            <label htmlFor="host-about" className={styles.label}>
              {t('auth.about')}
            </label>
            <textarea
              id="host-about"
              className={clsx(styles.textarea, errors.about && styles.invalid)}
              placeholder={t('auth.aboutPlaceholder')}
              value={hostForm.about}
              onChange={(e) => {
                updateHostForm({ about: e.target.value });
                clear('about');
              }}
              aria-invalid={Boolean(errors.about)}
              rows={4}
            />
            <FieldError message={errors.about} />
          </div>
        </div>

        <div className={styles.twoCols}>
          <div className={styles.field}>
            <label htmlFor="host-region" className={styles.label}>
              {t('auth.region')}
            </label>
            <div className={styles.selectWrap}>
              <select
                id="host-region"
                className={styles.input}
                value={hostForm.region}
                onChange={(e) => updateHostForm({ region: e.target.value })}
              >
                {!(REGIONS as readonly string[]).includes(hostForm.region) && (
                  <option value={hostForm.region}>{hostForm.region}</option>
                )}
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {t(`auth.regions.${r}`)}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className={styles.selectChevron} />
            </div>
          </div>
          <TextField
            id="host-locality"
            label={t('auth.locality')}
            value={hostForm.locality}
            onChange={(e) => {
              updateHostForm({ locality: e.target.value });
              clear('locality');
            }}
            error={errors.locality}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label} id="host-langs">
            {t('auth.languages')}
          </span>
          <div className={clsx(styles.chipsBox, errors.languages && styles.invalid)} role="group" aria-labelledby="host-langs">
            {selected.map((code) => (
              <span key={code} className={styles.langChip}>
                {t(languageKey(code))}
                <button
                  type="button"
                  aria-label={t('auth.removeLanguage', { name: t(languageKey(code)) })}
                  onClick={() => updateHostForm({ languages: selected.filter((l) => l !== code) })}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {available.length > 0 && (
              <select
                className={styles.chipSelect}
                aria-label={t('auth.addLanguage')}
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    updateHostForm({ languages: [...selected, e.target.value] });
                    clear('languages');
                  }
                }}
              >
                <option value="">{t('auth.addLanguage')}</option>
                {available.map((code) => (
                  <option key={code} value={code}>
                    {t(languageKey(code))}
                  </option>
                ))}
              </select>
            )}
          </div>
          <FieldError message={errors.languages} />
        </div>

        <div className={styles.twoCols}>
          <TextField
            id="host-email"
            label={t('auth.email')}
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            value={hostForm.email}
            onChange={(e) => {
              updateHostForm({ email: e.target.value });
              clear('email');
            }}
            error={errors.email}
          />
          <TextField
            id="host-address"
            label={`${t('auth.address')} (${t('auth.optional')})`}
            value={hostForm.address}
            onChange={(e) => updateHostForm({ address: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>
            {t('auth.video')} <span className={styles.muted}>({t('auth.optional')})</span>
          </span>
          <label className={clsx(styles.dropzone, video && styles.dropzoneDone)}>
            <span className={styles.dropzoneIcon}>{video ? <Check size={18} /> : <PlayCircle size={18} />}</span>
            <span className={styles.dropzoneText}>
              <strong>{video ? video.name : t('auth.videoUpload')}</strong>
              <small>{t('auth.videoHint')}</small>
            </span>
            <input type="file" accept="video/mp4" className="visually-hidden" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} />
          </label>
        </div>

        <StepActions onBack={onBack} />
      </form>
    </AuthCard>
  );
};

const ACTIVITIES = ['riding', 'hiking', 'cooking', 'yurt', 'crafts', 'fishing', 'nature', 'culture', 'photo', 'music', 'eagle'] as const;
const MAX_ACTIVITIES = 3;

/** Step 3 — hospitality: capacity, price, activities. */
export const HostHospitalityStep: React.FC<StepProps> = ({ onBack, onNext }) => {
  const { t } = useT();
  const { hostForm, updateHostForm } = useAuthStore();
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState<string>();
  const selected = hostForm.services.filter((s): s is (typeof ACTIVITIES)[number] => (ACTIVITIES as readonly string[]).includes(s));
  const visible = showAll ? ACTIVITIES : ACTIVITIES.slice(0, 8);

  const toggle = (activity: (typeof ACTIVITIES)[number]) => {
    setError(undefined);
    if (selected.includes(activity)) {
      updateHostForm({ services: selected.filter((s) => s !== activity) });
    } else if (selected.length < MAX_ACTIVITIES) {
      updateHostForm({ services: [...selected, activity] });
    }
  };

  return (
    <AuthCard title={t('auth.hospitalityTitle')} subtitle={t('auth.hospitalitySubtitle')} onBack={onBack} step={{ current: 3, total: TOTAL }}>
      <form
        className={styles.form}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (selected.length === 0) setError(t('auth.errors.required'));
          else onNext();
        }}
      >
        <div className={styles.field}>
          <span className={styles.label}>{t('auth.capacity')}</span>
          <div className={styles.guestStepper}>
            <button
              type="button"
              aria-label={t('auth.fewer')}
              disabled={hostForm.maxGuests <= 1}
              onClick={() => updateHostForm({ maxGuests: Math.max(1, hostForm.maxGuests - 1) })}
            >
              <Minus size={16} />
            </button>
            <span aria-live="polite">{t('common.guests', { count: hostForm.maxGuests })}</span>
            <button
              type="button"
              aria-label={t('auth.more')}
              disabled={hostForm.maxGuests >= 30}
              onClick={() => updateHostForm({ maxGuests: Math.min(30, hostForm.maxGuests + 1) })}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="host-price" className={styles.label}>
            {t('auth.pricePerPerson')}
          </label>
          <div className={styles.priceBox}>
            <input
              id="host-price"
              type="number"
              min={100}
              step={50}
              value={hostForm.pricePerDay}
              onChange={(e) => updateHostForm({ pricePerDay: Math.max(0, Number(e.target.value)) })}
            />
            <span>{t('common.currency')}</span>
          </div>
        </div>

        <fieldset className={styles.activities}>
          <legend className={styles.label}>
            {t('auth.activitiesLegend', { max: MAX_ACTIVITIES })}{' '}
            <span className={styles.muted}>
              {selected.length}/{MAX_ACTIVITIES}
            </span>
          </legend>
          <div className={styles.activityList}>
            {visible.map((activity) => {
              const isOn = selected.includes(activity);
              return (
                <button
                  key={activity}
                  type="button"
                  className={clsx(styles.activity, isOn && styles.activityOn)}
                  aria-pressed={isOn}
                  disabled={!isOn && selected.length >= MAX_ACTIVITIES}
                  onClick={() => toggle(activity)}
                >
                  {isOn && <Check size={13} />}
                  {t(`auth.activities.${activity}` as TranslationKey)}
                </button>
              );
            })}
            {!showAll && (
              <button type="button" className={styles.moreBtn} onClick={() => setShowAll(true)}>
                {t('common.showMore')}
              </button>
            )}
          </div>
          <FieldError message={error} />
        </fieldset>

        <StepActions onBack={onBack} />
      </form>
    </AuthCard>
  );
};

/** Step 4 — identity: resident (Түндүк portal) or foreign citizen. */
export const HostIdentityStep: React.FC<StepProps> = ({ onBack, onNext }) => {
  const { t } = useT();
  const { hostForm, updateHostForm } = useAuthStore();
  const [chosen, setChosen] = useState(false);
  const [error, setError] = useState<string>();

  const options = [
    { id: 'national' as const, key: 'resident' as const },
    { id: 'international' as const, key: 'foreigner' as const },
  ];

  return (
    <AuthCard title={t('auth.verifyTitle')} subtitle={t('auth.verifySubtitle')} onBack={onBack} step={{ current: 4, total: TOTAL }}>
      <form
        className={styles.form}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (chosen) onNext();
          else setError(t('auth.errors.required'));
        }}
      >
        <div className={styles.idOptions} role="radiogroup" aria-label={t('auth.verifyTitle')}>
          {options.map((option) => {
            const active = chosen && hostForm.idType === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                className={clsx(styles.idCard, active && styles.idCardActive)}
                onClick={() => {
                  updateHostForm({ idType: option.id });
                  setChosen(true);
                  setError(undefined);
                }}
              >
                <span className={styles.idRadio} aria-hidden="true">
                  {active && <Check size={12} />}
                </span>
                <span>
                  <span className={styles.idTitle}>{t(`auth.${option.key}.title`)}</span>
                  <span className={styles.idText}>{t(`auth.${option.key}.text`)}</span>
                </span>
              </button>
            );
          })}
        </div>
        <FieldError message={error} />

        <div className={styles.secureNote}>
          <LockKeyhole size={18} className={styles.secureIcon} />
          <div>
            <p className={styles.secureTitle}>{t('auth.secureTitle')}</p>
            <p>{t('auth.secureText')}</p>
          </div>
        </div>

        <StepActions onBack={onBack} nextLabel={t('auth.finish')} />
      </form>
    </AuthCard>
  );
};
