import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Clock,
  Fuel,
  Heart,
  Images,
  MapPin,
  Mountain,
  Phone,
  ShieldCheck,
  Snowflake,
  Gauge,
  Users,
} from 'lucide-react';
import { mockCars } from '@/shared/api/mocks';
import { useBookingStore } from '@/shared/lib/store/useBookingStore';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import { createId, DAY_MS, formatShortDate, toInputDate, useToday } from '@/shared/lib/date';
import { BackLink } from '@/shared/ui/BackLink';
import { Rating } from '@/shared/ui/Rating';
import { TitledPanel } from '@/shared/ui/TitledPanel';
import { ReviewList } from '@/entities/review/ui/ReviewList';
import { StartChatButton } from '@/features/StartChat';
import styles from './CarPage.module.scss';

const PICKUP_POINTS = ['Ысык - Кол', 'Бишкек', 'Аэропорт Манас', 'Ош', 'Каракол'];
const TIMES = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

/** Figma "Что включено" chips: icon per included item. */
const INCLUDED = [
  { label: 'Страховка', icon: ShieldCheck },
  { label: 'Безлимитный пробег', icon: Gauge },
  { label: 'Кондиционер', icon: Snowflake },
  { label: 'Поддержка в дороге 24/7', icon: Phone },
  { label: 'Бесплатная отмена до 48 часов', icon: Clock },
];


/** Figma "Транспорт → профиль" (Frame 9). */
export const CarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const car = mockCars.find((c) => c.id === id);
  const addBooking = useBookingStore((s) => s.addBooking);
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const today = useToday();
  const [pickup, setPickup] = useState(PICKUP_POINTS[0]);
  const [startDate, setStartDate] = useState(toInputDate(new Date(today.getTime() + 6 * DAY_MS)));
  const [endDate, setEndDate] = useState(toInputDate(new Date(today.getTime() + 9 * DAY_MS)));
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:00');
  const [booked, setBooked] = useState(false);

  if (!car) return <Navigate to="/catalog/cars" replace />;

  const days = Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / DAY_MS));
  const total = days * car.pricePerDay;
  const favorite = isFavorite(car.id);
  const [main, ...rest] = car.gallery;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    addBooking({
      id: createId('b'),
      title: car.name,
      category: 'car',
      dateRange: `${formatShortDate(startDate)} ${startTime} – ${formatShortDate(endDate)} ${endTime} (${days} дн.)`,
      location: pickup,
      price: total,
      photoUrl: car.photoUrl,
      status: 'pending',
    });
    setBooked(true);
  };

  return (
    <div className={styles.page}>
      <BackLink to="/catalog/cars" label="Назад к транспорту" className={styles.back} />

      <div className={styles.titleRow}>
        <h1 className={styles.title}>{car.name}</h1>
        <div className={styles.titleMeta}>
          <Rating score={car.rating} count={car.reviewsCount} />
          <button
            type="button"
            className={clsx(styles.favBtn, favorite && styles.isFav)}
            onClick={() => toggleFavorite(car.id)}
            aria-label={favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            aria-pressed={favorite}
          >
            <Heart size={30} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className={styles.gallery}>
        <img src={main} alt={car.name} className={styles.mainPhoto} />
        <div className={styles.sidePhotos}>
          {rest.slice(0, 2).map((src, index) => (
            <div key={src} className={styles.sidePhoto}>
              <img src={src} alt={`${car.name} — фото ${index + 2}`} />
              {index === 1 && (
                <span className={styles.allPhotos}>
                  {car.gallery.length > 3 && <span>+ {car.gallery.length - 3}</span>}
                  <span className={styles.allPhotosLabel}>
                    <Images size={26} strokeWidth={1.5} /> Все фото
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.columns}>
        <div className={styles.info}>
          <h2 className={styles.sectionTitle}>Основная информация</h2>
          <ul className={styles.specs}>
            <li>
              <Users size={30} strokeWidth={1.5} /> {car.specs.seats} мест
            </li>
            <li>
              <Fuel size={30} strokeWidth={1.5} /> {car.specs.fuel.toLowerCase()}
            </li>
            <li>
              <Mountain size={30} strokeWidth={1.5} /> {car.specs.drive.toLowerCase()}
              <br />4 х 4
            </li>
          </ul>
          <hr className={styles.divider} />

          <h2 className={styles.sectionTitle}>О машине</h2>
          <p className={styles.description}>{car.description}</p>
          <hr className={styles.divider} />

          <h2 className={styles.sectionTitle}>Что включено</h2>
          <ul className={styles.included}>
            {INCLUDED.map(({ label, icon: Icon }) => (
              <li key={label}>
                <Icon size={30} strokeWidth={1.5} className={styles.includedIcon} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <form className={styles.bookingCard} onSubmit={handleBook}>
          <p className={styles.price}>{car.pricePerDay} сом / день</p>

          <label className={styles.fieldLabel} htmlFor="pickup">
            Место получения
          </label>
          <div className={clsx(styles.inputBox, styles.inputWide)}>
            <MapPin size={26} />
            <select id="pickup" value={pickup} onChange={(e) => setPickup(e.target.value)}>
              {PICKUP_POINTS.map((point) => (
                <option key={point}>{point}</option>
              ))}
            </select>
          </div>

          <span className={styles.fieldLabel}>Дата получения</span>
          <div className={styles.dateRow}>
            <div className={styles.inputBox}>
              <CalendarDays size={26} />
              <input
                type="date"
                aria-label="Дата получения"
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
            <div className={clsx(styles.inputBox, styles.timeBox)}>
              <select aria-label="Время получения" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                {TIMES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <span className={styles.fieldLabel}>Дата возврата</span>
          <div className={styles.dateRow}>
            <div className={styles.inputBox}>
              <CalendarDays size={26} />
              <input
                type="date"
                aria-label="Дата возврата"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className={clsx(styles.inputBox, styles.timeBox)}>
              <select aria-label="Время возврата" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                {TIMES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <p className={styles.calc}>
            <span>
              {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} * {car.pricePerDay} сом
            </span>
            <span>{total} сом</span>
          </p>
          <p className={styles.total}>
            <span>Итого</span>
            <span>{total} сом</span>
          </p>

          {booked ? (
            <div className={styles.booked} role="status">
              <BadgeCheck size={22} /> Заявка отправлена владельцу.{' '}
              <button type="button" onClick={() => navigate('/cabinet?tab=trips')}>
                Мои бронирования
              </button>
            </div>
          ) : (
            <button type="submit" className={styles.bookBtn}>
              Забронировать
            </button>
          )}
        </form>
      </div>

      <div className={styles.bottom}>
        <section className={styles.ownerCard}>
          <h2 className={styles.ownerHeading}>Автомобиль предоставляет</h2>
          <div className={styles.ownerRow}>
            <img src={car.owner.avatar} alt={car.owner.name} className={styles.ownerAvatar} />
            <div className={styles.ownerInfo}>
              <p className={styles.ownerName}>{car.owner.name}</p>
              <Rating score={car.owner.rating} count={car.owner.reviewsCount} size="sm" />
              <p className={styles.verified}>
                <BadgeCheck size={20} className={styles.verifiedIcon} /> Личность подтверждена
              </p>
              <StartChatButton
                listingType="car"
                listingId={car.id}
                ownerId={car.owner.id}
                className={styles.writeBtn}
              >
                Написать владельцу <ArrowUpRight size={18} />
              </StartChatButton>
            </div>
          </div>
        </section>

        <TitledPanel title="Отзывы" className={styles.reviews}>
          <ReviewList reviews={car.reviews} />
        </TitledPanel>
      </div>
    </div>
  );
};
