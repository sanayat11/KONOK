import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { BadgeCheck, Minus, Plus } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { useBookingStore } from '@/shared/lib/store/useBookingStore';
import { createId, DAY_MS, formatShortDate, toInputDate, useToday } from '@/shared/lib/date';
import styles from './BookingModal.module.scss';


/** Body is keyed by the item so every opening starts with a fresh form. */
const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const { bookingModal, closeBookingModal, addBooking } = useBookingStore();
  const today = useToday();
  const [start, setStart] = useState(toInputDate(new Date(today.getTime() + 7 * DAY_MS)));
  const [end, setEnd] = useState(toInputDate(new Date(today.getTime() + 9 * DAY_MS)));
  const [guests, setGuests] = useState(2);
  const [done, setDone] = useState(false);

  const nights = Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / DAY_MS));
  const price = bookingModal.pricePerDay ?? 0;
  const total = nights * price;

  if (done) {
    return (
      <div className={styles.done}>
        <BadgeCheck size={48} className={styles.doneIcon} />
        <p className={styles.doneTitle}>Заявка отправлена!</p>
        <p className={styles.doneText}>Хозяин подтвердит бронирование в ближайшее время.</p>
        <button
          type="button"
          className={styles.submit}
          onClick={() => {
            closeBookingModal();
            navigate('/cabinet?tab=trips');
          }}
        >
          Мои бронирования
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
          dateRange: `${formatShortDate(start)} – ${formatShortDate(end)} (${guests} ${guests === 1 ? 'гость' : guests < 5 ? 'гостя' : 'гостей'})`,
          location: '',
          price: total,
          photoUrl: bookingModal.photoUrl,
          status: 'pending',
        });
        setDone(true);
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, colors: ['#165389', '#FFE200', '#FFFFFF'] });
      }}
    >
      <div className={styles.item}>
        <img src={bookingModal.photoUrl} alt="" className={styles.itemPhoto} />
        <div>
          <p className={styles.itemTitle}>{bookingModal.itemTitle}</p>
          {price > 0 && <p className={styles.itemPrice}>{price} сом / день</p>}
        </div>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Заезд</span>
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
        </label>
        <label className={styles.field}>
          <span>Выезд</span>
          <input type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} required />
        </label>
      </div>

      <div className={styles.field}>
        <span>Сколько гостей?</span>
        <div className={styles.stepper}>
          <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Меньше гостей">
            <Minus size={22} />
          </button>
          <span aria-live="polite">{guests}</span>
          <button type="button" onClick={() => setGuests((g) => Math.min(12, g + 1))} aria-label="Больше гостей">
            <Plus size={22} />
          </button>
        </div>
      </div>

      {price > 0 && (
        <p className={styles.total}>
          <span>Итого</span>
          <span>{total} сом</span>
        </p>
      )}

      <button type="submit" className={styles.submit}>
        Забронировать
      </button>
    </form>
  );
};

export const BookingModal: React.FC = () => {
  const { bookingModal, closeBookingModal } = useBookingStore();

  return (
    <Modal isOpen={bookingModal.isOpen} onClose={closeBookingModal} title="Бронирование" maxWidth="sm">
      <BookingForm key={bookingModal.itemId} />
    </Modal>
  );
};
