import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { CalendarDays, LayoutList, MessagesSquare, NotebookTabs, Star } from 'lucide-react';
import type { Review, UserProfile } from '@/entities/types';
import { mockCars, mockGuides } from '@/shared/api/mocks';
import { CarCard } from '@/entities/car/ui/CarCard';
import { GuideCard } from '@/entities/guide/ui/GuideCard';
import { ReviewList } from '@/entities/review/ui/ReviewList';
import { useConversations } from '@/entities/chat';
import { useToday } from '@/shared/lib/date';
import styles from './HostTabs.module.scss';
import t from './tabs.module.scss';

/** Listings owned by a host: their cars and/or their own resident profile. */
const useOwnListings = (userId: string) =>
  useMemo(
    () => ({
      cars: mockCars.filter((c) => c.owner.id === userId),
      guides: mockGuides.filter((g) => g.id === userId),
    }),
    [userId],
  );

const Header: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div>
    <h1 className={t.pageTitle}>{title}</h1>
    <p className={t.pageSubtitle}>{subtitle}</p>
  </div>
);

export const ListingsTab: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { cars, guides } = useOwnListings(user.id);
  const empty = cars.length + guides.length === 0;

  return (
    <div className={styles.tab}>
      <Header title="Мои объявления" subtitle="Жильё, услуги и транспорт, которые видят гости." />
      {empty ? (
        <div className={clsx(t.panel, t.empty)}>
          <LayoutList size={36} />
          <p className={t.emptyTitle}>Объявлений пока нет</p>
          <p>Здесь появятся ваши объявления после модерации.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {guides.map((g) => (
            <GuideCard key={g.id} guide={g} />
          ))}
          {cars.map((c) => (
            <CarCard key={c.id} car={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export const HostBookingsTab: React.FC = () => (
  <div className={styles.tab}>
    <Header title="Бронирование" subtitle="Заявки гостей на ваши объявления." />
    <div className={clsx(t.panel, t.empty)}>
      <NotebookTabs size={36} />
      <p className={t.emptyTitle}>Новых заявок нет</p>
      <p>
        Пока гости только присматриваются — ответьте на их <Link to="/messages">сообщения</Link>.
      </p>
    </div>
  </div>
);

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const CalendarTab: React.FC = () => {
  const now = useToday();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday-first
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <div className={styles.tab}>
      <Header title="Календарь" subtitle="Свободные и занятые даты." />
      <section className={t.panel}>
        <h2 className={styles.calendarTitle}>
          <CalendarDays size={24} />
          {first.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
        </h2>
        <div className={styles.calendar}>
          {WEEKDAYS.map((d) => (
            <span key={d} className={styles.weekday}>
              {d}
            </span>
          ))}
          {cells.map((day, i) => (
            <span
              key={i}
              className={clsx(styles.day, day === now.getDate() && styles.today, day !== null && day < now.getDate() && styles.past)}
            >
              {day}
            </span>
          ))}
        </div>
        <p className={styles.legend}>Все даты свободны — бронирований на этот месяц нет.</p>
      </section>
    </div>
  );
};

export const ReviewsTab: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { cars, guides } = useOwnListings(user.id);
  const reviews: Review[] = [...guides.flatMap((g) => g.reviews), ...cars.flatMap((c) => c.reviews)];

  return (
    <div className={styles.tab}>
      <Header title="Отзывы" subtitle="Что гости пишут о ваших объявлениях." />
      <section className={t.panel}>
        {reviews.length ? (
          <ReviewList reviews={reviews} />
        ) : (
          <div className={t.empty}>
            <Star size={36} />
            <p className={t.emptyTitle}>Отзывов пока нет</p>
          </div>
        )}
      </section>
    </div>
  );
};

export const StatsTab: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { cars, guides } = useOwnListings(user.id);
  const conversations = useConversations(user.id);
  const listings = [...cars, ...guides];
  const reviewsCount = listings.reduce((sum, l) => sum + l.reviewsCount, 0);
  const rating = listings.length ? listings.reduce((sum, l) => sum + l.rating, 0) / listings.length : 0;

  const tiles = [
    { label: 'Объявления', value: listings.length, icon: LayoutList },
    { label: 'Средний рейтинг', value: rating ? rating.toFixed(1) : '—', icon: Star },
    { label: 'Отзывы', value: reviewsCount, icon: NotebookTabs },
    { label: 'Диалоги с гостями', value: conversations.length, icon: MessagesSquare },
  ];

  return (
    <div className={styles.tab}>
      <Header title="Статистика" subtitle="Как гости находят и оценивают ваши объявления." />
      <div className={styles.tiles}>
        {tiles.map(({ label, value, icon: Icon }) => (
          <div key={label} className={clsx(t.panel, styles.tile)}>
            <Icon size={28} className={styles.tileIcon} />
            <p className={styles.tileValue}>{value}</p>
            <p className={styles.tileLabel}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
