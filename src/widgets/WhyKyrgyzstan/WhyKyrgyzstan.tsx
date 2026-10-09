import React from 'react';
import { MountainSnow, Tent, UsersRound } from 'lucide-react';
import { useT } from '@/shared/i18n';
import { IMAGES } from '@/shared/lib/images';
import { Ornament } from '@/shared/ui/Ornament';
import { Reveal, revealItem } from '@/shared/ui/Reveal';
import styles from './WhyKyrgyzstan.module.scss';

const HorseIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 21v-6.5L3.5 12l1.5-1.5h4l3-4V4l2 1.5L17 5l3 4-1.5 1.5L17 10v3l1 8" />
    <path d="M9 10.5V21" />
    <path d="M14 13.5V21" />
    <path d="M17 13H9" />
  </svg>
);

const FEATURES = [
  { id: 'nature', image: IMAGES.nature, icon: <MountainSnow size={26} strokeWidth={1.6} />, tone: 'blue' },
  { id: 'culture', image: IMAGES.culture, icon: <Tent size={26} strokeWidth={1.6} />, tone: 'peach' },
  { id: 'hospitality', image: IMAGES.hospitality, icon: <UsersRound size={26} strokeWidth={1.6} />, tone: 'green' },
  { id: 'experience', image: IMAGES.experience, icon: <HorseIcon />, tone: 'pink' },
] as const;

/** Home "Почему Кыргызстан?" block: headline over an ornament and four feature cards. */
export const WhyKyrgyzstan: React.FC = () => {
  const { t } = useT();

  return (
    <section className={styles.section}>
      <Reveal className={styles.ornament} aria-hidden="true">
        <Ornament />
      </Reveal>
      <div className={styles.container}>
        <Reveal className={styles.intro}>
          <svg className={styles.peaks} viewBox="0 0 64 24" aria-hidden="true">
            <path d="M2 22 L20 4 L30 14 L40 6 L62 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" pathLength={1} />
          </svg>
          <h2 className={styles.title}>{t('home.whyTitle')}</h2>
          <p className={styles.subtitle}>{t('home.whySubtitle')}</p>
        </Reveal>

        <Reveal as="ul" stagger className={styles.grid}>
          {FEATURES.map((feature, index) => (
            <li key={feature.id} className={styles.card} {...revealItem(index)}>
              <div className={styles.media}>
                <img src={feature.image} alt={t(`home.features.${feature.id}.alt`)} loading="lazy" decoding="async" />
                <span className={styles.icon} data-tone={feature.tone}>
                  {feature.icon}
                </span>
              </div>
              <div className={styles.body}>
                <h3 className={styles.cardTitle}>{t(`home.features.${feature.id}.title`)}</h3>
                <p className={styles.cardText}>{t(`home.features.${feature.id}.text`)}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
};
