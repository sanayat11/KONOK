import React from 'react';
import clsx from 'clsx';
import { CalendarDays, CarFront, Pencil, Trash2, Users } from 'lucide-react';
import { useT } from '@/shared/i18n';
import type { HostVehicle } from '../../model/types';
import styles from './VehicleCard.module.scss';

export interface VehicleCardProps extends React.HTMLAttributes<HTMLElement> {
  vehicle: HostVehicle;
  onEdit: (vehicle: HostVehicle) => void;
  onDelete: (vehicle: HostVehicle) => void;
}

/** A host's own vehicle: photo, key specs and edit / delete actions. */
export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete, className, ...rest }) => {
  const { t } = useT();

  return (
    <article className={clsx(styles.card, className)} {...rest}>
      <div className={styles.imageWrapper}>
        <img src={vehicle.photo} alt={vehicle.makeModel} className={styles.image} loading="lazy" />
        <span className={clsx(styles.status, styles[vehicle.status])}>
          {t(`cabinet.vehicles.statuses.${vehicle.status}`)}
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{vehicle.makeModel}</h3>

        <ul className={styles.specs}>
          <li>
            <CalendarDays size={16} aria-hidden="true" />
            <span className="visually-hidden">{t('cabinet.vehicles.fields.year')}: </span>
            {vehicle.year}
          </li>
          <li>
            <CarFront size={16} aria-hidden="true" />
            {t(`cabinet.vehicles.types.${vehicle.type}`)}
          </li>
          <li>
            <Users size={16} aria-hidden="true" />
            {t('car.seats', { count: vehicle.seats })}
          </li>
        </ul>

        {vehicle.plate && <p className={styles.plate}>{vehicle.plate}</p>}
        {vehicle.description && <p className={styles.description}>{vehicle.description}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.actionBtn} onClick={() => onEdit(vehicle)}>
            <Pencil size={15} aria-hidden="true" />
            {t('cabinet.vehicles.edit')}
          </button>
          <button
            type="button"
            className={clsx(styles.actionBtn, styles.deleteBtn)}
            onClick={() => onDelete(vehicle)}
            aria-label={t('cabinet.vehicles.deleteLabel', { name: vehicle.makeModel })}
          >
            <Trash2 size={15} aria-hidden="true" />
            {t('cabinet.vehicles.delete')}
          </button>
        </div>
      </div>
    </article>
  );
};
