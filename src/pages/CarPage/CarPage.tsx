import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Clock,
  Fuel,
  Gauge,
  MapPin,
  Mountain,
  Phone,
  ShieldCheck,
  Snowflake,
  Users,
} from 'lucide-react';
import { mockCars } from '@/shared/api/mocks';
import { useBookingStore } from '@/shared/lib/store/useBookingStore';
import { createId, DAY_MS, toInputDate, useToday } from '@/shared/lib/date';
import { useT } from '@/shared/i18n';
import { BackLink } from '@/shared/ui/BackLink';
import { FavoriteButton } from '@/shared/ui/FavoriteButton';
import { Gallery } from '@/shared/ui/Gallery';
import { Rating } from '@/shared/ui/Rating';
import { Reveal } from '@/shared/ui/Reveal';
import { TitledPanel } from '@/shared/ui/TitledPanel';
import { ReviewList } from '@/entities/review/ui/ReviewList';
import { StartChatButton } from '@/features/StartChat';
import styles from './CarPage.module.scss';

const PICKUP_POINTS = ['issykKul', 'bishkek', 'manas', 'osh', 'karakol'] as const;
const TIMES = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

/** Figma "Что включено" chips: icon per included item. */
const INCLUDED = [
  { key: 'insurance', icon: ShieldCheck },
  { key: 'mileage', icon: Gauge },
  { key: 'ac', icon: Snowflake },
  { key: 'support', icon: Phone },
  { key: 'cancel', icon: Clock },
] as const;

/** Figma "Транспорт → профиль". */
export const CarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, fmt } = useT();
  const car = mockCars.find((c) => c.id === id);
  const addBooking = useBookingStore((s) => s.addBooking);

  const today = useToday();
  const [pickup, setPickup] = useState<(typeof PICKUP_POINTS)[number]>('issykKul');
  const [startDate, setStartDate] = useState(toInputDate(new Date(today.getTime() + 6 * DAY_MS)));
  const [endDate, setEndDate] = useState(toInputDate(new Date(today.getTime() + 9 * DAY_MS)));
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:00');
  const [booked, setBooked] = useState(false);

  if (!car) return <Navigate to="/catalog/cars" replace />;

  const days = Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / DAY_MS));
  const total = days * car.pricePerDay;
  const photos = car.gallery.length > 0 ? car.gallery : [car.photoUrl];
  const shortDate = (iso: string) => fmt.date(iso, { day: 'numeric', month: 'short' });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    addBooking({
      id: createId('b'),
      title: car.name,
      category: 'car',
      dateRange: `${shortDate(startDate)} ${startTime} – ${shortDate(endDate)} ${endTime} · ${t('common.days', { count: days })}`,
      location: t(`car.pickupPoints.${pickup}`),
      price: total,
      photoUrl: car.photoUrl,
      status: 'pending',
    });
    setBooked(true);
  };

  return (
    <div className={styles.page}>
      <BackLink to="/catalog/cars" label={t('car.backToCatalog')} className={styles.back} />

      <div className={styles.titleRow}>
        <h1 className={styles.title}>{car.name}</h1>
        <div className={styles.titleMeta}>
          <Rating score={car.rating} count={car.reviewsCount} />
          <FavoriteButton id={car.id} />
        </div>
      </div>

      <Gallery photos={photos} name={car.name} layout="hero" className={styles.gallery} />

      <div className={styles.columns}>
        <Reveal className={styles.info}>
          <h2 className={styles.sectionTitle}>{t('car.specs')}</h2>
          <ul className={styles.specs}>
            <li>
              <Users size={26} strokeWidth={1.5} /> {t('car.seats', { count: car.specs.seats })}
            </li>
            <li>
              <Fuel size={26} strokeWidth={1.5} /> {car.specs.fuel.toLowerCase()}
            </li>
            <li>
              <Mountain size={26} strokeWidth={1.5} />
              <span>
                {car.specs.drive.toLowerCase()}
                <br />4 × 4
              </span>
            </li>
          </ul>
          <hr className={styles.divider} />

          <h2 className={styles.sectionTitle}>{t('car.about')}</h2>
          <p className={styles.description}>{car.description}</p>
          <hr className={styles.divider} />

          <h2 className={styles.sectionTitle}>{t('car.included')}</h2>
          <ul className={styles.included}>
            {INCLUDED.map(({ key, icon: Icon }) => (
              <li key={key}>
                <Icon size={24} strokeWidth={1.5} className={styles.includedIcon} />
                <span>{t(`car.includedItems.${key}`)}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <form className={styles.bookingCard} onSubmit={handleBook}>
          <p className={styles.price}>{fmt.pricePerDay(car.pricePerDay)}</p>

          <label className={styles.fieldLabel} htmlFor="pickup">
            {t('car.pickup')}
          </label>
          <div className={styles.inputBox}>
            <MapPin size={20} />
            <select id="pickup" value={pickup} onChange={(e) => setPickup(e.target.value as (typeof PICKUP_POINTS)[number])}>
              {PICKUP_POINTS.map((point) => (
                <option key={point} value={point}>
                  {t(`car.pickupPoints.${point}`)}
                </option>
              ))}
            </select>
          </div>

          <span className={styles.fieldLabel}>{t('car.pickupDate')}</span>
          <div className={styles.dateRow}>
            <div className={styles.inputBox}>
              <CalendarDays size={20} />
              <input
                type="date"
                aria-label={t('car.pickupDate')}
                value={startDate}
                min={toInputDate(today)}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value >= endDate) {
                    setEndDate(toInputDate(new Date(new Date(e.target.value).getTime() + DAY_MS)));
                  }
                }}
                required
              />
            </div>
            <div className={styles.inputBox}>
              <select aria-label={`${t('car.pickupDate')}: ${t('car.time')}`} value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                {TIMES.map((time) => (
                  <option key={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <span className={styles.fieldLabel}>{t('car.returnDate')}</span>
          <div className={styles.dateRow}>
            <div className={styles.inputBox}>
              <CalendarDays size={20} />
              <input
                type="date"
                aria-label={t('car.returnDate')}
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputBox}>
              <select aria-label={`${t('car.returnDate')}: ${t('car.time')}`} value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                {TIMES.map((time) => (
                  <option key={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <p className={styles.calc}>
            <span>{t('car.daysTimesPrice', { days: t('common.days', { count: days }), price: fmt.price(car.pricePerDay) })}</span>
            <span>{fmt.price(total)}</span>
          </p>
          <p className={styles.total}>
            <span>{t('car.total')}</span>
            <span key={total} className={styles.totalValue}>
              {fmt.price(total)}
            </span>
          </p>

          {booked ? (
            <div className={styles.booked} role="status">
              <BadgeCheck size={20} />
              <span>
                {t('car.booked')} <Link to="/cabinet?tab=trips">{t('car.toBookings')}</Link>
              </span>
            </div>
          ) : (
            <button type="submit" className={styles.bookBtn}>
              {t('car.book')}
            </button>
          )}
        </form>
      </div>

      <div className={styles.bottom}>
        <Reveal as="section" className={styles.ownerCard}>
          <h2 className={styles.ownerHeading}>{t('car.owner')}</h2>
          <div className={styles.ownerRow}>
            <img src={car.owner.avatar} alt={car.owner.name} className={styles.ownerAvatar} />
            <div className={styles.ownerInfo}>
              <p className={styles.ownerName}>{car.owner.name}</p>
              <Rating score={car.owner.rating} count={car.owner.reviewsCount} size="sm" />
              {car.owner.responseTime && (
                <p className={styles.response}>
                  <Clock size={14} /> {t('car.responseTime', { time: car.owner.responseTime })}
                </p>
              )}
              <StartChatButton listingType="car" listingId={car.id} ownerId={car.owner.id} className={styles.writeBtn}>
                {t('car.writeOwner')} <ArrowUpRight size={16} />
              </StartChatButton>
            </div>
          </div>
        </Reveal>

        <Reveal className={styles.reviews}>
          <TitledPanel title={t('car.reviews')}>
            <ReviewList reviews={car.reviews} />
          </TitledPanel>
        </Reveal>
      </div>
    </div>
  );
};
