import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { BadgeCheck, CarFront, Clock3, House, MapPin, NotebookTabs, Wallet } from 'lucide-react';
import type { BookingItem } from '@/entities/types';
import { useBookingStore } from '@/shared/lib/store/useBookingStore';
import { mockItineraryWaypoints } from '@/shared/api/mocks';
import { useT } from '@/shared/i18n';
import { EmptyState } from '@/shared/ui/EmptyState';
import styles from './TripsTab.module.scss';
import t$ from './tabs.module.scss';

type Filter = 'all' | 'stay' | 'transport';

const isTransport = (b: BookingItem) => b.category === 'car';
/** Accommodation only — guide and place bookings count towards the total, not "Проживание". */
const isStay = (b: BookingItem) => b.category === 'hotel';

/** Guest bookings: totals, filters, booking cards and the route timeline. */
export const TripsTab: React.FC = () => {
  const { t, fmt } = useT();
  const bookings = useBookingStore((s) => s.bookings);
  const [filter, setFilter] = useState<Filter>('all');

  const stays = bookings.filter(isStay);
  const transport = bookings.filter(isTransport);
  const sum = (list: BookingItem[]) => list.reduce((acc, b) => acc + b.price, 0);
  const visible = filter === 'all' ? bookings : filter === 'stay' ? stays : transport;
  const allConfirmed = bookings.length > 0 && bookings.every((b) => b.status !== 'pending');
  const first = mockItineraryWaypoints[0];
  const last = mockItineraryWaypoints[mockItineraryWaypoints.length - 1];

  return (
    <div className={styles.layout}>
      <div className={t$.tab}>
        <div>
          <h1 className={t$.pageTitle}>{t('cabinet.trips.title')}</h1>
          {first && last && (
            <p className={t$.pageSubtitle}>
              {first.dates.split(' — ')[0]} – {last.dates.split(' — ')[1] ?? last.dates}
            </p>
          )}
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryIcon}>
              <House size={16} />
            </span>
            <div>
              <p className={styles.summaryLabel}>{t('cabinet.trips.stays')}</p>
              <p className={styles.summaryValue}>{fmt.price(sum(stays))}</p>
              <p className={styles.summaryNote}>{t('common.bookings', { count: stays.length })}</p>
            </div>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryIcon}>
              <CarFront size={16} />
            </span>
            <div>
              <p className={styles.summaryLabel}>{t('cabinet.trips.transport')}</p>
              <p className={styles.summaryValue}>{fmt.price(sum(transport))}</p>
              <p className={styles.summaryNote}>{t('common.bookings', { count: transport.length })}</p>
            </div>
          </div>
          <div className={clsx(styles.summaryItem, styles.summaryTotal)}>
            <span className={styles.summaryIcon}>
              <Wallet size={16} />
            </span>
            <div>
              <p className={styles.summaryLabel}>{t('cabinet.trips.total')}</p>
              <p className={styles.summaryValue}>{fmt.price(sum(bookings))}</p>
              <p className={styles.summaryNote}>
                {allConfirmed ? <BadgeCheck size={13} /> : <Clock3 size={13} />}
                {allConfirmed ? t('cabinet.trips.allConfirmed') : t('cabinet.trips.pending')}
              </p>
            </div>
          </div>
        </div>

        <div className={t$.filterTabs} role="tablist" aria-label={t('cabinet.menu.trips')}>
          {(
            [
              ['all', t('cabinet.trips.filterAll', { count: bookings.length })],
              ['stay', t('cabinet.trips.filterStays')],
              ['transport', t('cabinet.trips.filterTransport')],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              className={clsx(t$.filterTab, filter === id && t$.filterActive)}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={<NotebookTabs size={22} />}
            title={t('cabinet.trips.emptyTitle')}
            text={t('cabinet.trips.emptyText')}
            action={<Link to="/catalog/guides">{t('cabinet.trips.emptyCta')}</Link>}
          />
        ) : (
          <ul key={filter} className={styles.bookings}>
            {visible.map((booking, index) => (
              <li key={booking.id} className={styles.booking} style={{ animationDelay: `${index * 50}ms` }}>
                <img src={booking.photoUrl} alt="" className={styles.bookingPhoto} />
                <div className={styles.bookingBody}>
                  <div className={styles.bookingHead}>
                    <p className={styles.bookingTitle}>{booking.title}</p>
                    <span className={clsx(styles.status, styles[booking.status])}>
                      {t(`cabinet.trips.status.${booking.status}`)}
                    </span>
                  </div>
                  {booking.location && (
                    <p className={styles.bookingMeta}>
                      <MapPin size={12} /> {booking.location}
                    </p>
                  )}
                  <p className={styles.bookingMeta}>{booking.dateRange}</p>
                  <p className={styles.bookingPrice}>
                    {isTransport(booking) && <span>{t('cabinet.trips.vehicle')} · </span>}
                    {fmt.price(booking.price)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className={clsx(t$.panel, styles.route)}>
        <h2 className={styles.routeTitle}>{t('cabinet.trips.route')}</h2>
        <ol className={styles.timeline}>
          {mockItineraryWaypoints.map((wp) => (
            <li key={wp.id} className={styles.stop}>
              <span className={styles.stopDot} aria-hidden="true" />
              <span className={styles.stopBody}>
                <span className={styles.stopDay}>
                  {t('cabinet.trips.day', { day: wp.dayNumber })} · {wp.dates.split(' — ')[0]}
                </span>
                <strong>{wp.title}</strong>
                <span>{wp.subtitle}</span>
              </span>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
};
