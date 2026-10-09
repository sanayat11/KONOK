import React, { useId, useState } from 'react';
import clsx from 'clsx';
import { AlertCircle, ImagePlus, RefreshCw } from 'lucide-react';
import {
  preparePhoto,
  VEHICLE_STATUSES,
  VEHICLE_TYPES,
  VehiclePhotoError,
  type HostVehicle,
  type VehicleDraft,
  type VehicleStatus,
  type VehicleType,
} from '@/entities/vehicle';
import { useT, type TranslationKey } from '@/shared/i18n';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import styles from './VehiclesTab.module.scss';

const MIN_YEAR = 1980;
const MAX_SEATS = 20;
const MAX_DESCRIPTION = 300;
const PLATE_PATTERN = /^[\p{L}\d][\p{L}\d\s-]{1,13}$/u;

type Field = 'photo' | 'makeModel' | 'year' | 'seats' | 'plate' | 'description';
type Errors = Partial<Record<Field, string>>;

interface Values {
  photo: string;
  makeModel: string;
  year: string;
  type: VehicleType;
  plate: string;
  seats: string;
  description: string;
  status: VehicleStatus;
}

const toValues = (v?: HostVehicle): Values => ({
  photo: v?.photo ?? '',
  makeModel: v?.makeModel ?? '',
  year: v ? String(v.year) : '',
  type: v?.type ?? 'suv',
  plate: v?.plate ?? '',
  seats: v ? String(v.seats) : '',
  description: v?.description ?? '',
  status: v?.status ?? 'available',
});

const PHOTO_ERRORS: Record<VehiclePhotoError['reason'], TranslationKey> = {
  type: 'cabinet.vehicles.errors.photoType',
  size: 'cabinet.vehicles.errors.photoSize',
  read: 'cabinet.vehicles.errors.photoRead',
};

export interface VehicleFormProps {
  vehicle?: HostVehicle;
  onCancel: () => void;
  /** Returns false when the vehicle could not be stored. */
  onSubmit: (draft: VehicleDraft) => boolean;
}

/** Add / edit form for a host's vehicle, shown inside a modal. */
export const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onCancel, onSubmit }) => {
  const { t } = useT();
  const id = useId();
  const [values, setValues] = useState<Values>(() => toValues(vehicle));
  const [errors, setErrors] = useState<Errors>({});
  const [processing, setProcessing] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const maxYear = new Date().getFullYear() + 1;

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key as Field] ? { ...prev, [key]: undefined } : prev));
    setSaveFailed(false);
  };

  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    setProcessing(true);
    try {
      set('photo', await preparePhoto(file));
    } catch (error) {
      const reason = error instanceof VehiclePhotoError ? error.reason : 'read';
      setErrors((prev) => ({ ...prev, photo: t(PHOTO_ERRORS[reason]) }));
    } finally {
      setProcessing(false);
    }
  };

  const validate = (): Errors => {
    const next: Errors = {};
    const year = Number(values.year);
    const seats = Number(values.seats);
    if (!values.photo) next.photo = t('cabinet.vehicles.errors.photoRequired');
    if (values.makeModel.trim().length < 2) next.makeModel = t('cabinet.vehicles.errors.makeModel');
    if (!Number.isInteger(year) || year < MIN_YEAR || year > maxYear)
      next.year = t('cabinet.vehicles.errors.year', { min: MIN_YEAR, max: maxYear });
    if (!Number.isInteger(seats) || seats < 1 || seats > MAX_SEATS)
      next.seats = t('cabinet.vehicles.errors.seats', { max: MAX_SEATS });
    if (values.plate.trim() && !PLATE_PATTERN.test(values.plate.trim())) next.plate = t('cabinet.vehicles.errors.plate');
    if (values.description.length > MAX_DESCRIPTION)
      next.description = t('cabinet.vehicles.errors.description', { max: MAX_DESCRIPTION });
    return next;
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    const firstInvalid = (Object.keys(next) as Field[]).find((key) => next[key]);
    if (firstInvalid) {
      e.currentTarget.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus();
      return;
    }
    const ok = onSubmit({
      photo: values.photo,
      makeModel: values.makeModel.trim(),
      year: Number(values.year),
      type: values.type,
      plate: values.plate.trim().toUpperCase(),
      seats: Number(values.seats),
      description: values.description.trim(),
      status: values.status,
    });
    if (!ok) setSaveFailed(true);
  };

  const typeOptions = VEHICLE_TYPES.map((value) => ({ value, label: t(`cabinet.vehicles.types.${value}`) }));
  const statusOptions = VEHICLE_STATUSES.map((value) => ({ value, label: t(`cabinet.vehicles.statuses.${value}`) }));

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.field}>
        <span className={styles.label}>{t('cabinet.vehicles.fields.photo')}</span>
        <label
          className={clsx(styles.photo, values.photo && styles.photoFilled, errors.photo && styles.photoInvalid)}
          aria-busy={processing}
        >
          {values.photo && <img src={values.photo} alt="" className={styles.photoPreview} />}
          <span className={styles.photoOverlay}>
            {processing ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                {t('cabinet.vehicles.photoProcessing')}
              </>
            ) : values.photo ? (
              <>
                <RefreshCw size={18} aria-hidden="true" />
                {t('cabinet.vehicles.photoChange')}
              </>
            ) : (
              <>
                <ImagePlus size={26} aria-hidden="true" />
                <strong>{t('cabinet.vehicles.photoAdd')}</strong>
                <small>{t('cabinet.vehicles.photoHint')}</small>
              </>
            )}
          </span>
          <input
            type="file"
            accept="image/*"
            className="visually-hidden"
            data-field="photo"
            disabled={processing}
            aria-invalid={Boolean(errors.photo)}
            aria-describedby={errors.photo ? `${id}-photo-error` : undefined}
            onChange={(e) => {
              void pickPhoto(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </label>
        {errors.photo && (
          <span id={`${id}-photo-error`} className={styles.error}>
            {errors.photo}
          </span>
        )}
      </div>

      <Input
        id={`${id}-make`}
        data-field="makeModel"
        label={t('cabinet.vehicles.fields.makeModel')}
        placeholder={t('cabinet.vehicles.placeholders.makeModel')}
        value={values.makeModel}
        onChange={(e) => set('makeModel', e.target.value)}
        error={errors.makeModel}
        aria-invalid={Boolean(errors.makeModel)}
        maxLength={60}
        autoComplete="off"
      />

      <div className={styles.row}>
        <Input
          id={`${id}-year`}
          data-field="year"
          label={t('cabinet.vehicles.fields.year')}
          inputMode="numeric"
          placeholder="2019"
          value={values.year}
          onChange={(e) => set('year', e.target.value.replace(/\D/g, '').slice(0, 4))}
          error={errors.year}
          aria-invalid={Boolean(errors.year)}
        />
        <Input
          id={`${id}-seats`}
          data-field="seats"
          label={t('cabinet.vehicles.fields.seats')}
          inputMode="numeric"
          placeholder="4"
          value={values.seats}
          onChange={(e) => set('seats', e.target.value.replace(/\D/g, '').slice(0, 2))}
          error={errors.seats}
          aria-invalid={Boolean(errors.seats)}
        />
      </div>

      <div className={styles.row}>
        <Select
          id={`${id}-type`}
          label={t('cabinet.vehicles.fields.type')}
          options={typeOptions}
          value={values.type}
          onChange={(e) => set('type', e.target.value as VehicleType)}
        />
        <Select
          id={`${id}-status`}
          label={t('cabinet.vehicles.fields.status')}
          options={statusOptions}
          value={values.status}
          onChange={(e) => set('status', e.target.value as VehicleStatus)}
        />
      </div>

      <Input
        id={`${id}-plate`}
        data-field="plate"
        label={`${t('cabinet.vehicles.fields.plate')} · ${t('cabinet.vehicles.optional')}`}
        placeholder="01 123 ABC"
        value={values.plate}
        onChange={(e) => set('plate', e.target.value)}
        error={errors.plate}
        aria-invalid={Boolean(errors.plate)}
        maxLength={14}
        autoComplete="off"
      />

      <div className={styles.field}>
        <label htmlFor={`${id}-description`} className={styles.label}>
          {t('cabinet.vehicles.fields.description')} · {t('cabinet.vehicles.optional')}
        </label>
        <textarea
          id={`${id}-description`}
          data-field="description"
          className={clsx(styles.textarea, errors.description && styles.textareaInvalid)}
          placeholder={t('cabinet.vehicles.placeholders.description')}
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          aria-invalid={Boolean(errors.description)}
          rows={3}
        />
        <span className={clsx(styles.counter, values.description.length > MAX_DESCRIPTION && styles.counterOver)}>
          {values.description.length}/{MAX_DESCRIPTION}
        </span>
        {errors.description && <span className={styles.error}>{errors.description}</span>}
      </div>

      {saveFailed && (
        <p className={styles.alert} role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          {t('cabinet.vehicles.errors.storage')}
        </p>
      )}

      <p className={styles.formNote}>{t('cabinet.vehicles.demoNote')}</p>

      <div className={styles.formActions}>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={processing}>
          {vehicle ? t('common.save') : t('cabinet.vehicles.addSubmit')}
        </Button>
      </div>
    </form>
  );
};
