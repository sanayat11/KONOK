import React, { useId, useState } from 'react';
import clsx from 'clsx';
import { AlertCircle, ArrowLeft, ArrowRight, Check, ImagePlus, Star, X } from 'lucide-react';
import {
  AMENITIES,
  AMENITY_ICONS,
  PROPERTY_TYPES,
  STAY_REGIONS,
  type Amenity,
  type PropertyType,
  type Stay,
  type StayDraft,
  type StayStatus,
} from '@/entities/stay';
import type { RegionId } from '@/entities/types';
import { useT, type TranslationKey } from '@/shared/i18n';
import { PhotoProcessingError, preparePhoto } from '@/shared/lib/preparePhoto';
import { STAY_PRICE_PER_NIGHT } from '@/shared/lib/pricing';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import styles from './StayWizard.module.scss';

const STEPS = ['basics', 'place', 'amenities', 'photos'] as const;
type Step = (typeof STEPS)[number];
const MAX_PHOTOS = 6;

type Field =
  | 'title'
  | 'description'
  | 'location'
  | 'maxGuests'
  | 'bedrooms'
  | 'beds'
  | 'bathrooms'
  | 'basePrice'
  | 'photos';
type Errors = Partial<Record<Field, string>>;

const FIELD_STEP: Record<Field, Step> = {
  title: 'basics',
  description: 'basics',
  location: 'place',
  maxGuests: 'place',
  bedrooms: 'place',
  beds: 'place',
  bathrooms: 'place',
  basePrice: 'amenities',
  photos: 'photos',
};

interface Values {
  title: string;
  description: string;
  propertyType: PropertyType;
  regionId: RegionId;
  location: string;
  maxGuests: string;
  bedrooms: string;
  beds: string;
  bathrooms: string;
  amenities: Amenity[];
  basePrice: string;
  photos: string[];
}

const toValues = (s?: Stay): Values => ({
  title: s?.title ?? '',
  description: s?.description ?? '',
  propertyType: s?.propertyType ?? 'guesthouse',
  regionId: s?.regionId ?? 'issyk-kul',
  location: s?.location ?? '',
  maxGuests: s ? String(s.maxGuests) : '2',
  bedrooms: s ? String(s.bedrooms) : '1',
  beds: s ? String(s.beds) : '2',
  bathrooms: s ? String(s.bathrooms) : '1',
  amenities: s?.amenities ?? [],
  basePrice: s ? String(s.basePricePerNight) : '',
  photos: s?.photos ?? [],
});

const PHOTO_ERRORS: Record<PhotoProcessingError['reason'], TranslationKey> = {
  type: 'cabinet.vehicles.errors.photoType',
  size: 'cabinet.vehicles.errors.photoSize',
  read: 'cabinet.vehicles.errors.photoRead',
};

const int = (value: string) => (value.trim() === '' ? NaN : Number(value));
const inRange = (value: string, min: number, max: number) => {
  const n = int(value);
  return Number.isInteger(n) && n >= min && n <= max;
};

export interface StayWizardProps {
  stay?: Stay;
  onCancel: () => void;
  /** Returns false when the browser refused to store the listing. */
  onSave: (draft: StayDraft, status: StayStatus) => boolean;
}

/** Four-step listing form: basics → place & capacity → amenities & price → photos. */
export const StayWizard: React.FC<StayWizardProps> = ({ stay, onCancel, onSave }) => {
  const { t, fmt } = useT();
  const id = useId();
  const [values, setValues] = useState<Values>(() => toValues(stay));
  const [step, setStep] = useState<Step>('basics');
  const [direction, setDirection] = useState<1 | -1>(1);
  const [errors, setErrors] = useState<Errors>({});
  const [processing, setProcessing] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const stepIndex = STEPS.indexOf(step);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key as Field] ? { ...prev, [key]: undefined } : prev));
    setSaveFailed(false);
  };

  const validate = (only?: Step): Errors => {
    const e: Errors = {};
    const v = values;
    if (v.title.trim().length < 5) e.title = t('listingForm.errors.title');
    if (v.description.trim().length < 20) e.description = t('listingForm.errors.description');
    if (v.location.trim().length < 2) e.location = t('listingForm.errors.location');
    if (!inRange(v.maxGuests, 1, 20)) e.maxGuests = t('listingForm.errors.range', { min: 1, max: 20 });
    if (!inRange(v.bedrooms, 0, 20)) e.bedrooms = t('listingForm.errors.range', { min: 0, max: 20 });
    if (!inRange(v.beds, 1, 30)) e.beds = t('listingForm.errors.range', { min: 1, max: 30 });
    if (!inRange(v.bathrooms, 0, 10)) e.bathrooms = t('listingForm.errors.range', { min: 0, max: 10 });
    if (!inRange(v.basePrice, 500, 100000)) e.basePrice = t('listingForm.errors.price', { min: fmt.price(500), max: fmt.price(100000) });
    if (v.photos.length === 0) e.photos = t('listingForm.errors.photos');
    if (!only) return e;
    return Object.fromEntries(Object.entries(e).filter(([field]) => FIELD_STEP[field as Field] === only)) as Errors;
  };

  const goTo = (next: Step) => {
    setDirection(STEPS.indexOf(next) > stepIndex ? 1 : -1);
    setStep(next);
  };

  const next = () => {
    const stepErrors = validate(step);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) goTo(STEPS[stepIndex + 1]);
  };

  const toDraft = (): StayDraft => ({
    title: values.title.trim(),
    description: values.description.trim(),
    propertyType: values.propertyType,
    regionId: values.regionId,
    location: values.location.trim(),
    maxGuests: int(values.maxGuests) || 1,
    bedrooms: Math.max(0, int(values.bedrooms) || 0),
    beds: int(values.beds) || 1,
    bathrooms: Math.max(0, int(values.bathrooms) || 0),
    amenities: values.amenities,
    basePricePerNight: int(values.basePrice) || 0,
    photos: values.photos,
  });

  const saveDraft = () => {
    if (values.title.trim().length < 3) {
      setErrors({ title: t('listingForm.errors.draftTitle') });
      goTo('basics');
      return;
    }
    if (!onSave(toDraft(), 'draft')) setSaveFailed(true);
  };

  const publish = () => {
    const all = validate();
    setErrors(all);
    const firstInvalid = STEPS.find((s) => Object.keys(all).some((f) => FIELD_STEP[f as Field] === s));
    if (firstInvalid) {
      goTo(firstInvalid);
      return;
    }
    if (!onSave(toDraft(), 'published')) setSaveFailed(true);
  };

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    const room = MAX_PHOTOS - values.photos.length;
    if (room <= 0) {
      setErrors((prev) => ({ ...prev, photos: t('listingForm.errors.photosMax', { max: MAX_PHOTOS }) }));
      return;
    }
    setProcessing(true);
    const added: string[] = [];
    let failure: TranslationKey | null = null;
    for (const file of Array.from(files).slice(0, room)) {
      try {
        // Smaller than vehicle photos: several per listing still have to fit in localStorage.
        added.push(await preparePhoto(file, 900, 0.72));
      } catch (error) {
        failure = PHOTO_ERRORS[error instanceof PhotoProcessingError ? error.reason : 'read'];
      }
    }
    setProcessing(false);
    setValues((prev) => ({ ...prev, photos: [...prev.photos, ...added].slice(0, MAX_PHOTOS) }));
    setErrors((prev) => ({ ...prev, photos: failure ? t(failure) : undefined }));
  };

  const removePhoto = (index: number) => set('photos', values.photos.filter((_, i) => i !== index));
  const makeCover = (index: number) =>
    set('photos', [values.photos[index], ...values.photos.filter((_, i) => i !== index)]);

  const toggleAmenity = (amenity: Amenity) =>
    set('amenities', values.amenities.includes(amenity) ? values.amenities.filter((a) => a !== amenity) : [...values.amenities, amenity]);

  const numberField = (field: 'maxGuests' | 'bedrooms' | 'beds' | 'bathrooms', label: TranslationKey) => (
    <Input
      id={`${id}-${field}`}
      label={t(label)}
      inputMode="numeric"
      value={values[field]}
      onChange={(e) => set(field, e.target.value.replace(/\D/g, '').slice(0, 2))}
      error={errors[field]}
      aria-invalid={Boolean(errors[field])}
    />
  );

  return (
    <div className={styles.wizard}>
      <ol className={styles.steps} aria-label={t('listingForm.progress', { step: stepIndex + 1, total: STEPS.length })}>
        {STEPS.map((s, i) => {
          const done = i < stepIndex;
          const hasError = Object.keys(errors).some((f) => errors[f as Field] && FIELD_STEP[f as Field] === s);
          return (
            <li key={s} className={clsx(styles.step, i === stepIndex && styles.stepActive, done && styles.stepDone, hasError && styles.stepError)}>
              <button type="button" onClick={() => goTo(s)} aria-current={i === stepIndex ? 'step' : undefined}>
                <span className={styles.stepDot}>{done ? <Check size={14} /> : i + 1}</span>
                <span className={styles.stepLabel}>{t(`listingForm.steps.${s}`)}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className={styles.progress} aria-hidden="true">
        <span style={{ transform: `scaleX(${(stepIndex + 1) / STEPS.length})` }} />
      </div>

      <div key={step} className={clsx(styles.panel, direction === 1 ? styles.fromRight : styles.fromLeft)}>
        {step === 'basics' && (
          <>
            <Input
              id={`${id}-title`}
              label={t('listingForm.fields.title')}
              placeholder={t('listingForm.placeholders.title')}
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              error={errors.title}
              aria-invalid={Boolean(errors.title)}
              maxLength={80}
              autoFocus
            />
            <fieldset className={styles.fieldset}>
              <legend className={styles.label}>{t('listingForm.fields.type')}</legend>
              <div className={styles.typeGrid}>
                {PROPERTY_TYPES.map((type) => (
                  <label key={type} className={clsx(styles.typeOption, values.propertyType === type && styles.typeActive)}>
                    <input
                      type="radio"
                      name={`${id}-type`}
                      value={type}
                      checked={values.propertyType === type}
                      onChange={() => set('propertyType', type)}
                      className="visually-hidden"
                    />
                    {t(`stays.types.${type}`)}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className={styles.field}>
              <label htmlFor={`${id}-description`} className={styles.label}>
                {t('listingForm.fields.description')}
              </label>
              <textarea
                id={`${id}-description`}
                className={clsx(styles.textarea, errors.description && styles.invalid)}
                placeholder={t('listingForm.placeholders.description')}
                value={values.description}
                onChange={(e) => set('description', e.target.value.slice(0, 1000))}
                aria-invalid={Boolean(errors.description)}
                rows={5}
              />
              <span className={styles.counter}>{values.description.length}/1000</span>
              {errors.description && <span className={styles.error}>{errors.description}</span>}
            </div>
          </>
        )}

        {step === 'place' && (
          <>
            <div className={styles.row}>
              <Select
                id={`${id}-region`}
                label={t('listingForm.fields.region')}
                options={STAY_REGIONS.map((r) => ({ value: r, label: t(`regions.${r}.name`) }))}
                value={values.regionId}
                onChange={(e) => set('regionId', e.target.value as RegionId)}
              />
              <Input
                id={`${id}-location`}
                label={t('listingForm.fields.location')}
                placeholder={t('listingForm.placeholders.location')}
                value={values.location}
                onChange={(e) => set('location', e.target.value)}
                error={errors.location}
                aria-invalid={Boolean(errors.location)}
                maxLength={80}
              />
            </div>
            <div className={styles.row4}>
              {numberField('maxGuests', 'listingForm.fields.maxGuests')}
              {numberField('bedrooms', 'listingForm.fields.bedrooms')}
              {numberField('beds', 'listingForm.fields.beds')}
              {numberField('bathrooms', 'listingForm.fields.bathrooms')}
            </div>
          </>
        )}

        {step === 'amenities' && (
          <>
            <fieldset className={styles.fieldset}>
              <legend className={styles.label}>{t('listingForm.fields.amenities')}</legend>
              <div className={styles.amenityGrid}>
                {AMENITIES.map((a) => {
                  const Icon = AMENITY_ICONS[a];
                  const on = values.amenities.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      className={clsx(styles.amenity, on && styles.amenityOn)}
                      aria-pressed={on}
                      onClick={() => toggleAmenity(a)}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                      <span>{t(`stays.amenities.${a}`)}</span>
                      {on && <Check size={14} className={styles.amenityCheck} />}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className={styles.priceRow}>
              <Input
                id={`${id}-price`}
                label={t('listingForm.fields.basePrice')}
                inputMode="numeric"
                placeholder="3000"
                value={values.basePrice}
                onChange={(e) => set('basePrice', e.target.value.replace(/\D/g, '').slice(0, 6))}
                error={errors.basePrice}
                aria-invalid={Boolean(errors.basePrice)}
              />
              <div className={styles.pricePreview} aria-live="polite">
                <span>{t('listingForm.guestsSee')}</span>
                <strong>{fmt.price(STAY_PRICE_PER_NIGHT)}</strong>
                <small>{t('listingForm.flatExplained')}</small>
              </div>
            </div>
          </>
        )}

        {step === 'photos' && (
          <div className={styles.field}>
            <span className={styles.label}>
              {t('listingForm.fields.photos')} · {values.photos.length}/{MAX_PHOTOS}
            </span>
            <div className={styles.photoGrid}>
              {values.photos.map((src, i) => (
                <figure key={`${i}-${src.slice(-24)}`} className={clsx(styles.photo, i === 0 && styles.cover)}>
                  <img src={src} alt={t('common.photoOf', { name: values.title || t('listingForm.untitled'), index: i + 1 })} />
                  {i === 0 && <span className={styles.coverBadge}>{t('listingForm.cover')}</span>}
                  <div className={styles.photoActions}>
                    {i > 0 && (
                      <button type="button" onClick={() => makeCover(i)} aria-label={t('listingForm.makeCover')} title={t('listingForm.makeCover')}>
                        <Star size={15} />
                      </button>
                    )}
                    <button type="button" onClick={() => removePhoto(i)} aria-label={t('listingForm.removePhoto')} title={t('listingForm.removePhoto')}>
                      <X size={15} />
                    </button>
                  </div>
                </figure>
              ))}
              {values.photos.length < MAX_PHOTOS && (
                <label className={clsx(styles.addPhoto, errors.photos && styles.invalid)} aria-busy={processing}>
                  {processing ? <span className={styles.spinner} aria-hidden="true" /> : <ImagePlus size={24} aria-hidden="true" />}
                  <span>{processing ? t('cabinet.vehicles.photoProcessing') : t('listingForm.addPhotos')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="visually-hidden"
                    disabled={processing}
                    onChange={(e) => {
                      void addPhotos(e.target.files);
                      e.target.value = '';
                    }}
                  />
                </label>
              )}
            </div>
            {errors.photos && <span className={styles.error}>{errors.photos}</span>}
            <p className={styles.hint}>{t('listingForm.photosHint')}</p>
          </div>
        )}
      </div>

      {saveFailed && (
        <p className={styles.alert} role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          {t('listingForm.errors.storage')}
        </p>
      )}

      <p className={styles.demoNote}>{t('listingForm.demoNote')}</p>

      <div className={styles.actions}>
        <div className={styles.actionsStart}>
          {stepIndex > 0 ? (
            <Button type="button" variant="ghost" leftIcon={<ArrowLeft size={16} />} onClick={() => goTo(STEPS[stepIndex - 1])}>
              {t('common.back')}
            </Button>
          ) : (
            <Button type="button" variant="ghost" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
          )}
        </div>
        <Button type="button" variant="outline" onClick={saveDraft} disabled={processing}>
          {t('listingForm.saveDraft')}
        </Button>
        {stepIndex < STEPS.length - 1 ? (
          <Button type="button" rightIcon={<ArrowRight size={16} />} onClick={next}>
            {t('common.continue')}
          </Button>
        ) : (
          <Button type="button" onClick={publish} disabled={processing}>
            {stay?.status === 'published' ? t('common.save') : t('listingForm.publish')}
          </Button>
        )}
      </div>
    </div>
  );
};
