import React, { useState } from 'react';
import { ChevronRight, LockKeyhole, Minus, PlayCircle, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { AuthCard } from '../ui/AuthCard';
import { PhoneField, TermsCheckbox, TextField } from '../ui/fields';
import styles from '../AuthPage.module.scss';

interface StepProps {
  onBack: () => void;
  onNext: () => void;
}

/** Bottom "Назад / Продолжить" pair used on host steps 2–4. */
const StepActions: React.FC<{ onBack: () => void; nextDisabled?: boolean }> = ({ onBack, nextDisabled }) => (
  <div className={styles.stepActions}>
    <button type="button" className={styles.secondaryBtn} onClick={onBack}>
      Назад
    </button>
    <button type="submit" className={styles.submit} disabled={nextDisabled}>
      Продолжить
    </button>
  </div>
);

/** Step 1 — "Регистрация хозяина": same account form as guests. */
export const HostAccountStep: React.FC<StepProps> = ({ onBack, onNext }) => {
  const { hostForm, updateHostForm } = useAuthStore();
  const [first, ...rest] = hostForm.fullName.split(' ');
  const [firstName, setFirstName] = useState(first ?? '');
  const [lastName, setLastName] = useState(rest.join(' '));
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);

  return (
    <AuthCard title="Регистрация хозяина" subtitle="Создайте аккаунт и станьте частью сообщества Конок" onBack={onBack} step={1}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          updateHostForm({ fullName: `${firstName.trim()} ${lastName.trim()}`.trim() });
          onNext();
        }}
      >
        <TextField label="Имя" placeholder="Ваше имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoComplete="given-name" />
        <TextField label="Фамилия" placeholder="Ваша фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} required autoComplete="family-name" />
        <TextField label="Email" type="email" placeholder="example@email.com" value={hostForm.email} onChange={(e) => updateHostForm({ email: e.target.value })} required autoComplete="email" />
        <PhoneField value={hostForm.phone} onChange={(phone) => updateHostForm({ phone })} />
        <TextField label="Пароль" type="password" placeholder="··········" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
        <TermsCheckbox checked={terms} onChange={setTerms} />
        <button type="submit" className={styles.submit}>
          Продолжить
        </button>
      </form>
    </AuthCard>
  );
};

const REGIONS = ['Ысык-Кол', 'Нарын', 'Чуй', 'Талас', 'Ош', 'Жалал-Абад', 'Баткен', 'Бишкек'];
const LANGUAGES = ['Кыргызский', 'Русский', 'Английский', 'Казахский', 'Узбекский', 'Немецкий'];

/** Step 2 — "Расскажите о себе". */
export const HostAboutStep: React.FC<StepProps> = ({ onBack, onNext }) => {
  const { hostForm, updateHostForm } = useAuthStore();
  const [video, setVideo] = useState<File | null>(null);
  const available = LANGUAGES.filter((lang) => !hostForm.languages.includes(lang));

  return (
    <AuthCard title="Расскажите о себе" subtitle="Пусть путешественники узнают вас получше." onBack={onBack} step={2}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
      >
        <div className={styles.aboutRow}>
          <label className={styles.avatarPicker} title="Загрузить фото">
            <img src={hostForm.avatarUrl} alt="Ваше фото" />
            <input
              type="file"
              accept="image/*"
              className="visually-hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) updateHostForm({ avatarUrl: URL.createObjectURL(file) });
              }}
            />
          </label>
          <div className={styles.fieldGrow}>
            <label htmlFor="host-about" className={styles.labelSmall}>
              О себе
            </label>
            <textarea
              id="host-about"
              className={styles.textarea}
              placeholder="Расскажите немного о себе, о своей семье и о том, чем вы занимаетесь."
              value={hostForm.about}
              onChange={(e) => updateHostForm({ about: e.target.value })}
              rows={4}
              required
            />
          </div>
        </div>

        <div className={styles.twoCols}>
          <div className={styles.fieldSmall}>
            <label htmlFor="host-region">Регион</label>
            <select id="host-region" className={styles.inputSmall} value={hostForm.region} onChange={(e) => updateHostForm({ region: e.target.value })}>
              {!REGIONS.includes(hostForm.region) && <option value={hostForm.region}>{hostForm.region}</option>}
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className={styles.fieldSmall}>
            <label htmlFor="host-locality">Населенный пункт</label>
            <input id="host-locality" className={styles.inputSmall} value={hostForm.locality} onChange={(e) => updateHostForm({ locality: e.target.value })} required />
          </div>
        </div>

        <div className={styles.fieldSmall}>
          <span id="host-langs">Языки</span>
          <div className={styles.chipsBox} aria-labelledby="host-langs">
            {hostForm.languages.map((lang) => (
              <span key={lang} className={styles.langChip}>
                {lang}
                <button
                  type="button"
                  aria-label={`Убрать ${lang}`}
                  onClick={() => updateHostForm({ languages: hostForm.languages.filter((l) => l !== lang) })}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            {available.length > 0 && (
              <select
                className={styles.chipSelect}
                aria-label="Добавить язык"
                value=""
                onChange={(e) => e.target.value && updateHostForm({ languages: [...hostForm.languages, e.target.value] })}
              >
                <option value="">+ язык</option>
                {available.map((lang) => (
                  <option key={lang}>{lang}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className={styles.twoCols}>
          <div className={styles.fieldSmall}>
            <label htmlFor="host-email">Email</label>
            <input id="host-email" type="email" className={styles.inputSmall} placeholder="example@email.com" value={hostForm.email} onChange={(e) => updateHostForm({ email: e.target.value })} required />
          </div>
          <div className={styles.fieldSmall}>
            <label htmlFor="host-address">Адрес</label>
            <input id="host-address" className={styles.inputSmall} value={hostForm.address} onChange={(e) => updateHostForm({ address: e.target.value })} />
          </div>
        </div>

        <div className={styles.fieldSmall}>
          <span>Видео-визитка (необязательно)</span>
          <label className={styles.videoUpload}>
            <PlayCircle size={34} strokeWidth={1.3} />
            <span>
              <strong>{video ? video.name : 'Загрузить видео'}</strong>
              <small>до 2 мин, формат MP4</small>
            </span>
            <input type="file" accept="video/mp4" className="visually-hidden" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} />
          </label>
        </div>

        <StepActions onBack={onBack} nextDisabled={hostForm.languages.length === 0} />
      </form>
    </AuthCard>
  );
};

const ACTIVITIES = ['Верховая езда', 'Походы', 'Готовка', 'Жизнь в юрте', 'Ремесла', 'Рыбалка', 'Природа', 'Культура', 'Фототуры', 'Музыка', 'Охота с беркутом'];
const MAX_ACTIVITIES = 3;

const guestsLabel = (n: number) => `${n} ${n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}`;

/** Step 3 — "О вашем гостеприимстве". */
export const HostHospitalityStep: React.FC<StepProps> = ({ onBack, onNext }) => {
  const { hostForm, updateHostForm } = useAuthStore();
  const [showAll, setShowAll] = useState(false);
  const selected = hostForm.services.filter((s) => ACTIVITIES.includes(s));
  const visible = showAll ? ACTIVITIES : ACTIVITIES.slice(0, 9);

  const toggle = (activity: string) => {
    if (selected.includes(activity)) {
      updateHostForm({ services: selected.filter((s) => s !== activity) });
    } else if (selected.length < MAX_ACTIVITIES) {
      updateHostForm({ services: [...selected, activity] });
    }
  };

  return (
    <AuthCard title="О вашем гостеприимстве" subtitle="Расскажите что вы можете предложить путешественникам" onBack={onBack} step={3}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
      >
        <div className={styles.fieldSmall}>
          <span>Сколько людей вы можете принять?</span>
          <div className={styles.guestStepper}>
            <button type="button" aria-label="Меньше гостей" onClick={() => updateHostForm({ maxGuests: Math.max(1, hostForm.maxGuests - 1) })}>
              <Minus size={30} strokeWidth={1.5} />
            </button>
            <span aria-live="polite">{guestsLabel(hostForm.maxGuests)}</span>
            <button type="button" aria-label="Больше гостей" onClick={() => updateHostForm({ maxGuests: Math.min(30, hostForm.maxGuests + 1) })}>
              <Plus size={30} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className={styles.fieldSmall}>
          <label htmlFor="host-price">Стоимость за одного человека</label>
          <div className={styles.priceBox}>
            <input
              id="host-price"
              type="number"
              min={100}
              step={50}
              value={hostForm.pricePerDay}
              onChange={(e) => updateHostForm({ pricePerDay: Number(e.target.value) })}
              required
            />
            <span>сом</span>
          </div>
        </div>

        <fieldset className={styles.activities}>
          <legend>Выберите до {MAX_ACTIVITIES} занятий, которыми хотите поделиться</legend>
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
                  {activity}
                </button>
              );
            })}
            {!showAll && (
              <button type="button" className={styles.moreBtn} aria-label="Показать ещё занятия" onClick={() => setShowAll(true)}>
                <ChevronRight size={22} />
              </button>
            )}
          </div>
        </fieldset>

        <StepActions onBack={onBack} nextDisabled={selected.length === 0} />
      </form>
    </AuthCard>
  );
};

/** Step 4 — "Подтвердите свою личность": resident (Түндүк) or foreigner. */
export const HostIdentityStep: React.FC<StepProps> = ({ onBack, onNext }) => {
  const { hostForm, updateHostForm } = useAuthStore();
  const [chosen, setChosen] = useState(false);

  const options = [
    { id: 'national' as const, title: 'Я житель Кыргызстана', text: 'Подтверждение личности через Түндүк' },
    { id: 'international' as const, title: 'Я иностранный гражданин', text: 'Подтверждение личности через сервис верификации' },
  ];

  return (
    <AuthCard title="Подтвердите свою личность" subtitle="Это поможет гостям доверять вам" onBack={onBack} step={4}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          if (chosen) onNext();
        }}
      >
        <div className={styles.idOptions}>
          {options.map((option) => {
            const active = chosen && hostForm.idType === option.id;
            return (
              <div key={option.id} className={clsx(styles.idCard, active && styles.idCardActive)}>
                <p className={styles.idTitle}>{option.title}</p>
                <p className={styles.idText}>{option.text}</p>
                <button
                  type="button"
                  className={styles.idBtn}
                  aria-pressed={active}
                  onClick={() => {
                    updateHostForm({ idType: option.id });
                    setChosen(true);
                  }}
                >
                  {active ? 'Выбрано ✓' : 'Продолжить'}
                </button>
              </div>
            );
          })}
        </div>

        <div className={styles.secureNote}>
          <LockKeyhole size={34} className={styles.secureIcon} />
          <div>
            <p className={styles.secureTitle}>Ваши данные защищены</p>
            <p>Документы используются только для проверки личности и не передаются третьим лицам.</p>
          </div>
        </div>

        <StepActions onBack={onBack} nextDisabled={!chosen} />
      </form>
    </AuthCard>
  );
};
