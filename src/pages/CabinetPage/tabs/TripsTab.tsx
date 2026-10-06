import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { BadgeCheck, CarFront, Clock3, House, NotebookTabs } from 'lucide-react';
import type { BookingItem } from '@/entities/types';
import { useBookingStore } from '@/shared/lib/store/useBookingStore';
import { mockItineraryWaypoints } from '@/shared/api/mocks';
import styles from './TripsTab.module.scss';
import t from './tabs.module.scss';

type Filter = 'all' | 'stay' | 'transport';

const isTransport = (b: BookingItem) => b.category === 'car';
const STATUS: Record<BookingItem['status'], string> = {
  confirmed: 'Подтверждено',
  pending: 'Ожидает подтверждения',
  completed: 'Завершено',
};
const plural = (n: number) => `${n} ${n === 1 ? 'бронирование' : n < 5 ? 'бронирования' : 'бронирований'}`;
const som = (n: number) => `${n.toLocaleString('ru-RU')} сом`;

/** Figma "Мои бронирования": totals, filters, booking cards and the route timeline. */
export const TripsTab: React.FC = () => {
  const bookings = useBookingStore((s) => s.bookings);
  const [filter, setFilter] = useState<Filter>('all');

  const stays = bookings.filter((b) => !isTransport(b));
  const transport = bookings.filter(isTransport);
  const sum = (list: BookingItem[]) => list.reduce((acc, b) => acc + b.price, 0);
  const visible = filter === 'all' ? bookings : filter === 'stay' ? stays : transport;
  const allConfirmed = bookings.length > 0 && bookings.every((b) => b.status !== 'pending');
  const first = mockItineraryWaypoints[0];
  const last = mockItineraryWaypoints[mockItineraryWaypoints.length - 1];

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <div>
          <h1 className={t.pageTitle}>Моё путешествие по Кыргызстану</h1>
          <p className={styles.dates}>
            {first.dates.split(' — ')[0]} – {last.dates.split(' — ')[1]}
          </p>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <House size={30} strokeWidth={1.5} />
            <div>
              <p>Проживание</p>
              <p className={styles.summaryValue}>{som(sum(stays))}</p>
              <p className={styles.summaryNote}>{plural(stays.length)}</p>
            </div>
          </div>
          <div className={styles.summaryItem}>
            <CarFront size={30} strokeWidth={1.5} />
            <div>
              <p>Транспорт</p>
              <p className={styles.summaryValue}>{som(sum(transport))}</p>
              <p className={styles.summaryNote}>{plural(transport.length)}</p>
            </div>
          </div>
          <div className={clsx(styles.summaryItem, styles.summaryTotal)}>
            <div>
              <p>Итого</p>
              <p className={styles.summaryValue}>{som(sum(bookings))}</p>
              <p className={styles.summaryNote}>
                {allConfirmed ? (
                  <>
                    <BadgeCheck size={14} /> Всё подтверждено
                  </>
                ) : (
                  <>
                    <Clock3 size={14} /> Есть заявки в ожидании
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className={t.filterTabs} role="tablist">
          {(
            [
              ['all', `Все (${bookings.length})`],
              ['stay', 'Проживание'],
              ['transport', 'Транспорт'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              className={clsx(t.filterTab, filter === id && t.filterActive)}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className={clsx(t.panel, t.empty)}>
            <NotebookTabs size={36} />
            <p className={t.emptyTitle}>Бронирований пока нет</p>
            <p>
              Найдите <Link to="/catalog/guides">жителей</Link> или <Link to="/catalog/cars">транспорт</Link> для поездки.
            </p>
          </div>
        ) : (
          <ul className={styles.bookings}>
            {visible.map((booking) => (
              <li key={booking.id} className={styles.booking}>
                <img src={booking.photoUrl} alt="" className={styles.bookingPhoto} />
                <div className={styles.bookingBody}>
                  <p className={styles.bookingTitle}>{booking.title}</p>
                  {booking.location && <p>{booking.location}</p>}
                  <p>{booking.dateRange}</p>
                  <p>{isTransport(booking) ? 'Автомобиль' : som(booking.price)}</p>
                  <span className={clsx(styles.status, styles[booking.status])}>{STATUS[booking.status]}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className={clsx(t.panel, styles.route)}>
        <h2 className={styles.routeTitle}>Ваш маршрут</h2>
        <ol className={styles.timeline}>
          {mockItineraryWaypoints.map((wp) => (
            <li key={wp.id} className={styles.stop}>
              <span className={styles.stopDay}>
                {wp.dates.split(' — ')[0]}
                <br />
                День {wp.dayNumber}
              </span>
              <span className={styles.stopDot} aria-hidden="true" />
              <span className={styles.stopBody}>
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
