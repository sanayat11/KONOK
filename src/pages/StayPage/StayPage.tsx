import React from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Bath, BedDouble, DoorOpen, MapPin, Users } from 'lucide-react';
import { AMENITY_ICONS, useStay } from '@/entities/stay';
import { StartChatButton } from '@/features/StartChat';
import { mockGuides } from '@/shared/api/mocks';
import { useT } from '@/shared/i18n';
import { nightsBetween, parseInputDate } from '@/shared/lib/date';
import { stayNightlyPrice, stayTotalPrice } from '@/shared/lib/pricing';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { useBookingStore } from '@/shared/lib/store/useBookingStore';
import { BackLink } from '@/shared/ui/BackLink';
import { FavoriteButton } from '@/shared/ui/FavoriteButton';
import { Gallery } from '@/shared/ui/Gallery';
import { Reveal } from '@/shared/ui/Reveal';
import styles from './StayPage.module.scss';

/** Accommodation details: gallery, facts, amenities, host and a price card with the booking action. */
export const StayPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const { t, fmt } = useT();
  const user = useAuthStore((s) => s.user);
  const stay = useStay(id, user?.id);
  const openBookingModal = useBookingStore((s) => s.openBookingModal);

  if (!stay) return <Navigate to="/catalog/stays" replace />;

  const checkIn = parseInputDate(params.get('checkIn'));
  const checkOut = parseInputDate(params.get('checkOut'));
  const nights = nightsBetween(checkIn, checkOut);
  const guests = Number(params.get('guests')) || undefined;
  const nightly = stayNightlyPrice(stay.basePricePerNight);
  const host = mockGuides.find((g) => g.id === stay.ownerId);
  const isOwner = user?.id === stay.ownerId;

  const facts = [
    { icon: Users, label: t('stays.upToGuests', { count: stay.maxGuests }) },
    { icon: DoorOpen, label: t('stays.bedrooms', { count: stay.bedrooms }) },
    { icon: BedDouble, label: t('stays.beds', { count: stay.beds }) },
    { icon: Bath, label: t('stays.bathrooms', { count: stay.bathrooms }) },
  ];

  return (
    <div className={styles.page}>
      <BackLink to="/catalog/stays" className={styles.back} />

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{t(`stays.types.${stay.propertyType}`)}</p>
          <h1 className={styles.title}>{stay.title}</h1>
          <p className={styles.location}>
            <MapPin size={16} aria-hidden="true" />
            {stay.location} · {t(`regions.${stay.regionId}.name`)}
          </p>
        </div>
        <FavoriteButton id={stay.id} variant="plain" />
      </header>

      {stay.status === 'draft' && <p className={styles.draftNote}>{t('stays.draftPreview')}</p>}
      {stay.source === 'local' && stay.status === 'published' && <p className={styles.draftNote}>{t('stays.localPreview')}</p>}

      {stay.photos.length > 0 ? (
        <Gallery photos={stay.photos} name={stay.title} layout="hero" className={styles.gallery} />
      ) : (
        <div className={styles.noPhotos}>{t('stays.noPhotos')}</div>
      )}

      <div className={styles.layout}>
        <div className={styles.main}>
          <Reveal>
            <ul className={styles.facts}>
              {facts.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Icon size={20} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('stays.about')}</h2>
              <p className={styles.description}>{stay.description}</p>
            </section>
          </Reveal>

          {stay.amenities.length > 0 && (
            <Reveal>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('stays.amenitiesTitle')}</h2>
                <ul className={styles.amenities}>
                  {stay.amenities.map((a) => {
                    const Icon = AMENITY_ICONS[a];
                    return (
                      <li key={a}>
                        <span className={styles.amenityIcon}>
                          <Icon size={18} strokeWidth={1.8} />
                        </span>
                        {t(`stays.amenities.${a}`)}
                      </li>
                    );
                  })}
                </ul>
              </section>
            </Reveal>
          )}

          {host && (
            <Reveal>
              <section className={styles.host}>
                <img src={host.avatarUrl} alt="" className={styles.hostPhoto} />
                <div>
                  <p className={styles.hostLabel}>{t('stays.hostedBy')}</p>
                  <p className={styles.hostName}>{host.fullName ?? host.name}</p>
                  <p className={styles.hostRole}>{host.roleTitle}</p>
                </div>
                <Link to={`/guides/${host.id}`} className={styles.hostLink}>
                  {t('common.viewProfile')}
                </Link>
              </section>
            </Reveal>
          )}
        </div>

        <aside className={styles.aside}>
          <div className={styles.priceCard}>
            <p className={styles.price}>
              <strong>{fmt.price(nightly)}</strong> <span>{t('stays.perNight')}</span>
            </p>
            <p className={styles.flatNote}>{t('stays.flatPrice')}</p>
            {nights > 0 && (
              <dl className={styles.breakdown}>
                <div className={styles.breakdownTotal}>
                  <dt>
                    {fmt.price(nightly)} × {t('booking.nights', { count: nights })}
                  </dt>
                  <dd>{fmt.price(stayTotalPrice(stay.basePricePerNight, nights))}</dd>
                </div>
              </dl>
            )}

            {isOwner ? (
              <Link to="/cabinet?tab=listings" className={styles.bookBtn}>
                {t('stays.manageOwn')}
              </Link>
            ) : (
              <button
                type="button"
                className={styles.bookBtn}
                disabled={stay.status !== 'published'}
                onClick={() =>
                  openBookingModal({
                    type: 'stay',
                    itemId: stay.id,
                    itemTitle: stay.title,
                    basePricePerNight: stay.basePricePerNight,
                    photoUrl: stay.photos[0] ?? '',
                    checkIn: checkIn ?? undefined,
                    checkOut: checkOut ?? undefined,
                    guests,
                  })
                }
              >
                {t('booking.submit')}
              </button>
            )}
            {stay.source === 'seed' && host && (
              <StartChatButton listingType="guide" listingId={host.id} ownerId={host.id} className={styles.chatBtn}>
                {t('stays.writeHost')}
              </StartChatButton>
            )}
            <p className={styles.note}>{t('booking.note')}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};
