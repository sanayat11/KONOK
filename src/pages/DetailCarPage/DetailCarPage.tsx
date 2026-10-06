import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Heart,
  Users,
  Cog,
  Compass,
  Wind,
  Fuel,
  Check,
  Clock,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { mockCars } from '@/shared/api/mocks/cars';
import { useBookingStore } from '@/shared/lib/store/useBookingStore';
import { useFavoritesStore } from '@/shared/lib/store/useFavoritesStore';
import clsx from 'clsx';
import styles from './DetailCarPage.module.scss';

export const DetailCarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openBookingModal } = useBookingStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const car = mockCars.find((c) => c.id === id) || mockCars[0]; // Default to 4Runner
  const favorite = isFavorite(car.id);

  // Calculator states
  const [pickupLoc, setPickupLoc] = useState('Бишкек — ВКО / Аэропорт Манас');
  const [pickupDate, setPickupDate] = useState('2026-09-24T10:00');
  const [returnDate, setReturnDate] = useState('2026-09-27T18:00');
  const [rentDays, setRentDays] = useState(3);

  const totalPrice = rentDays * car.pricePerDay;

  const handleBooking = () => {
    openBookingModal({
      type: 'car',
      itemId: car.id,
      itemTitle: `Аренда ${car.name} (${rentDays} дня)`,
      pricePerDay: car.pricePerDay,
      photoUrl: car.photoUrl,
    });
  };

  const gallery = car.gallery.length > 0 ? car.gallery : [
    car.photoUrl,
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back Link */}
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Назад к авто</span>
        </button>

        {/* Title Header */}
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.carTitle}>{car.name}</h1>
            <p className={styles.carRegion}>{car.region} • {car.type}</p>
          </div>
          <div className={styles.titleActions}>
            <div className={styles.ratingBadge}>
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span>{car.rating}</span>
              <span className={styles.reviewCount}>({car.reviewsCount} отзывов)</span>
            </div>
            <button
              className={clsx(styles.favBtn, favorite && styles.isFav)}
              onClick={() => toggleFavorite(car.id)}
            >
              <Heart size={20} fill={favorite ? '#EF4444' : 'none'} color={favorite ? '#EF4444' : '#1E293B'} />
            </button>
          </div>
        </div>

        {/* Top Photo Gallery Grid */}
        <div className={styles.galleryGrid}>
          <div className={styles.mainGalleryPhoto}>
            <img src={gallery[0]} alt={car.name} />
          </div>
          <div className={styles.sideGalleryCol}>
            <div className={styles.sidePhoto}>
              <img src={gallery[1] || gallery[0]} alt={`${car.name} интерьер`} />
            </div>
            <div className={styles.sidePhoto}>
              <img src={gallery[2] || gallery[0]} alt={`${car.name} детали`} />
            </div>
          </div>
        </div>

        {/* Main 2-Column Section */}
        <div className={styles.layoutGrid}>
          {/* Left Column: Specs, Description, Host & Reviews */}
          <div className={styles.detailsCol}>
            {/* 1. Main Specs */}
            <div className={styles.sectionCard}>
              <h3 className={styles.cardHeading}>Основная информация</h3>
              <div className={styles.specsGrid}>
                <div className={styles.specItem}>
                  <Users size={20} className={styles.specIcon} />
                  <div>
                    <div className={styles.specLabel}>Мест</div>
                    <div className={styles.specVal}>{car.specs.seats} мест</div>
                  </div>
                </div>

                <div className={styles.specItem}>
                  <Cog size={20} className={styles.specIcon} />
                  <div>
                    <div className={styles.specLabel}>Коробка</div>
                    <div className={styles.specVal}>{car.specs.transmission}</div>
                  </div>
                </div>

                <div className={styles.specItem}>
                  <Compass size={20} className={styles.specIcon} />
                  <div>
                    <div className={styles.specLabel}>Привод</div>
                    <div className={styles.specVal}>{car.specs.drive}</div>
                  </div>
                </div>

                <div className={styles.specItem}>
                  <Wind size={20} className={styles.specIcon} />
                  <div>
                    <div className={styles.specLabel}>Климат</div>
                    <div className={styles.specVal}>{car.specs.ac ? 'Кондиционер' : 'Печка'}</div>
                  </div>
                </div>

                <div className={styles.specItem}>
                  <Fuel size={20} className={styles.specIcon} />
                  <div>
                    <div className={styles.specLabel}>Топливо</div>
                    <div className={styles.specVal}>{car.specs.fuel} ({car.specs.year})</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. About Description */}
            <div className={styles.sectionCard}>
              <h3 className={styles.cardHeading}>О машине</h3>
              <p className={styles.descText}>{car.description}</p>
            </div>

            {/* 3. What's Included */}
            <div className={styles.sectionCard}>
              <h3 className={styles.cardHeading}>Что включено</h3>
              <div className={styles.includedGrid}>
                {car.included.map((item, idx) => (
                  <div key={idx} className={styles.includedItem}>
                    <Check size={18} className={styles.checkIcon} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Host Info Card */}
            <div className={styles.hostCard}>
              <h3 className={styles.cardHeading}>Автомобиль предоставляет</h3>
              <div className={styles.hostRow}>
                <img
                  src={car.owner.avatar}
                  alt={car.owner.name}
                  className={styles.hostAvatar}
                />
                <div>
                  <h4 className={styles.hostName}>{car.owner.name}</h4>
                  <div className={styles.hostRating}>
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    <span>{car.owner.rating} ({car.owner.reviewsCount} поездок)</span>
                  </div>
                  <div className={styles.responseTime}>
                    <Clock size={14} />
                    <span>{car.owner.responseTime}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={styles.msgHostBtn}
                  onClick={() => alert(`Связываемся с владельцем ${car.owner.name}...`)}
                >
                  Написать владельцу
                </Button>
              </div>
            </div>

            {/* 5. Reviews */}
            {car.reviews.length > 0 && (
              <div className={styles.sectionCard}>
                <h3 className={styles.cardHeading}>Отзывы арендаторов</h3>
                <div className={styles.reviewsList}>
                  {car.reviews.map((rev) => (
                    <div key={rev.id} className={styles.reviewItem}>
                      <div className={styles.reviewerTop}>
                        <img src={rev.authorAvatar} alt={rev.authorName} className={styles.reviewerAvatar} />
                        <div>
                          <div className={styles.reviewerName}>{rev.authorName}</div>
                          <div className={styles.reviewDate}>{rev.date}</div>
                        </div>
                        <div className={styles.reviewScore}>★ {rev.rating}.0</div>
                      </div>
                      <p className={styles.reviewText}>{rev.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Calculator Card */}
          <div className={styles.calculatorCol}>
            <div className={styles.calcCard}>
              <div className={styles.priceHead}>
                <span className={styles.pricePerDayNum}>{car.pricePerDay.toLocaleString()} сом</span>
                <span className={styles.pricePerDayLabel}>/ день</span>
              </div>

              <div className={styles.calcFields}>
                <div className={styles.calcField}>
                  <label className={styles.calcLabel}>Место получения</label>
                  <select
                    value={pickupLoc}
                    onChange={(e) => setPickupLoc(e.target.value)}
                    className={styles.calcInput}
                  >
                    <option value="Бишкек — ВКО / Аэропорт Манас">Бишкек — ВКО / Аэропорт Манас</option>
                    <option value="Ош — Аэропорт">Ош — Аэропорт</option>
                    <option value="Каракол — Центр">Каракол — Центр</option>
                  </select>
                </div>

                <div className={styles.calcField}>
                  <label className={styles.calcLabel}>Дата и время получения</label>
                  <input
                    type="datetime-local"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className={styles.calcInput}
                  />
                </div>

                <div className={styles.calcField}>
                  <label className={styles.calcLabel}>Дата и время возврата</label>
                  <input
                    type="datetime-local"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className={styles.calcInput}
                  />
                </div>

                <div className={styles.calcField}>
                  <label className={styles.calcLabel}>Дней аренды</label>
                  <div className={styles.daysCounter}>
                    <button
                      type="button"
                      onClick={() => setRentDays((d) => Math.max(1, d - 1))}
                    >
                      -
                    </button>
                    <span>{rentDays} дня</span>
                    <button
                      type="button"
                      onClick={() => setRentDays((d) => d + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.calcSummary}>
                <div className={styles.sumRow}>
                  <span>{rentDays} дня × {car.pricePerDay.toLocaleString()} сом</span>
                  <span>{totalPrice.toLocaleString()} сом</span>
                </div>
                <div className={styles.sumRow}>
                  <span>Страховка КАСКО</span>
                  <span className={styles.freeText}>Включена</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Итого</span>
                  <span className={styles.totalAmount}>{totalPrice.toLocaleString()} сом</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<Calendar size={18} />}
                onClick={handleBooking}
              >
                Забронировать
              </Button>

              <div className={styles.guaranteeText}>
                <ShieldCheck size={16} />
                <span>Бесплатная отмена за 24 часа. Без скрытых комиссий.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
