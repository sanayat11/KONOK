import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { BadgeCheck, CalendarDays, Minus, Plus } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { useBookingStore } from '@/shared/lib/store/useBookingStore';
import { createId, DAY_MS, toInputDate, useToday } from '@/shared/lib/date';
import { useT } from '@/shared/i18n';
import styles from './BookingModal.module.scss';

const celebrate = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  confetti({ particleCount: 60, spread: 60, startVelocity: 32, origin: { y: 0.72 }, colors: ['#1F4A3D', '#C39A55', '#F7F3EC'] });
};

/** Body is keyed by the item so every opening starts with a fresh form. */
const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const { t, fmt } = useT();
  const { bookingModal, closeBookingModal, addBooking } = useBookingStore();
  const today = useToday();
  const [start, setStart] = useState(toInputDate(new Date(today.getTime() + 7 * DAY_MS)));
  const [end, setEnd] = useState(toInputDate(new Date(today.getTime() + 9 * DAY_MS)));
  const [guests, setGuests] = useState(2);
  const [done, setDone] = useState(false);

  const nights = Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / DAY_MS));
  const price = bookingModal.pricePerDay ?? 0;
  const total = nights * price;
  const shortDate = (iso: string) => fmt.date(iso, { day: 'numeric', month: 'short' });

  if (done) {
    return (
      <div className={styles.done} role="status">
        <span className={styles.doneIcon}>
          <BadgeCheck size={28} />
        </span>
        <p className={styles.doneTitle}>{t('booking.doneTitle')}</p>
        <p className={styles.doneText}>{t('booking.doneText')}</p>
        <button
          type="button"
          className={styles.submit}
          onClick={() => {
            closeBookingModal();
            navigate('/cabinet?tab=trips');
          }}
        >
          {t('booking.toBookings')}
        </button>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        addBooking({
          id: createId('b'),
          title: bookingModal.itemTitle,
          category: bookingModal.type === 'car' ? 'car' : bookingModal.type === 'place' ? 'place' : 'guide',
          dateRange: `${shortDate(start)} – ${shortDate(end)} · ${t('common.guests', { count: guests })}`,
          location: '',
          price: total,
          photoUrl: bookingModal.photoUrl,
          status: 'pending',
        });
        setDone(true);
        celebrate();
      }}
    >
      <div className={styles.item}>
        <img src={bookingModal.photoUrl} alt="" className={styles.itemPhoto} />
        <div>
          <p className={styles.itemTitle}>{bookingModal.itemTitle}</p>
          {price > 0 && <p className={styles.itemPrice}>{fmt.pricePerDay(price)}</p>}
        </div>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>{t('booking.checkIn')}</span>
          <span className={styles.inputBox}>
            <CalendarDays size={15} />
            <input
              type="date"
              value={start}
              min={toInputDate(today)}
              onChange={(e) => {
                setStart(e.target.value);
                if (e.target.value >= end) setEnd(toInputDate(new Date(new Date(e.target.value).getTime() + DAY_MS)));
              }}
              required
            />
          </span>
        </label>
        <label className={styles.field}>
          <span>{t('booking.checkOut')}</span>
          <span className={styles.inputBox}>
            <CalendarDays size={15} />
            <input type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} required />
          </span>
        </label>
      </div>

      <div className={styles.field}>
        <span>{t('booking.guests')}</span>
        <div className={styles.stepper}>
          <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label={t('booking.fewerGuests')} disabled={guests <= 1}>
            <Minus size={16} />
          </button>
          <span aria-live="polite">{t('common.guests', { count: guests })}</span>
          <button type="button" onClick={() => setGuests((g) => Math.min(12, g + 1))} aria-label={t('booking.moreGuests')} disabled={guests >= 12}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      {price > 0 && (
        <div className={styles.summary}>
          <p className={styles.calc}>
            <span>
              {fmt.price(price)} × {t('booking.nights', { count: nights })}
            </span>
            <span>{fmt.price(total)}</span>
          </p>
          <p className={styles.total}>
            <span>{t('booking.total')}</span>
            <span>{fmt.price(total)}</span>
          </p>
        </div>
      )}

      <button type="submit" className={styles.submit}>
        {t('booking.submit')}
      </button>
      <p className={styles.note}>{t('booking.note')}</p>
    </form>
  );
};

export const BookingModal: React.FC = () => {
  const { t } = useT();
  const { bookingModal, closeBookingModal } = useBookingStore();

  return (
    <Modal isOpen={bookingModal.isOpen} onClose={closeBookingModal} title={t('booking.title')} maxWidth="sm">
      <BookingForm key={bookingModal.itemId} />
    </Modal>
  );
};
