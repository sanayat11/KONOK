import React from 'react';
import { MountainSnow, Tent, UsersRound } from 'lucide-react';
import styles from './WhyKyrgyzstan.module.scss';

const HorseIcon: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 21v-6.5L3.5 12l1.5-1.5h4l3-4V4l2 1.5L17 5l3 4-1.5 1.5L17 10v3l1 8" />
    <path d="M9 10.5V21" />
    <path d="M14 13.5V21" />
    <path d="M17 13H9" />
  </svg>
);

const FEATURES = [
  {
    title: 'Природа без границ',
    text: 'Горы, озёра, долины и уникальные места, где хочется задержаться подольше.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    icon: <MountainSnow size={30} strokeWidth={1.6} />,
    tone: 'blue',
  },
  {
    title: 'Живая культура',
    text: 'Юрты, традиции, ремёсла и быт, которые здесь остаются частью повседневной жизни.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    icon: <Tent size={30} strokeWidth={1.6} />,
    tone: 'peach',
  },
  {
    title: 'Настоящее гостеприимство',
    text: 'Познакомьтесь с местными жителями, разделите с ними стол и почувствуйте себя гостем, а не туристом.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    icon: <UsersRound size={30} strokeWidth={1.6} />,
    tone: 'green',
  },
  {
    title: 'Незабываемый опыт',
    text: 'Конные прогулки, жизнь в горах, национальная кухня и истории местных жителей.',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    icon: <HorseIcon />,
    tone: 'pink',
  },
] as const;

/** Home "Почему Кыргызстан?" block: headline over a beige ornament and four feature cards. */
export const WhyKyrgyzstan: React.FC = () => (
  <section className={styles.section}>
    <div className={styles.container}>
      <div className={styles.intro}>
        <svg className={styles.peaks} viewBox="0 0 64 24" aria-hidden="true">
          <path d="M2 22 L20 4 L30 14 L40 6 L62 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <h2 className={styles.title}>Почему Кыргызстан?</h2>
        <p className={styles.subtitle}>Здесь путешествие начинается с природы, а запоминается людьми.</p>
      </div>

      <div className={styles.grid}>
        {FEATURES.map((feature) => (
          <article key={feature.title} className={styles.card}>
            <div className={styles.media}>
              <img src={feature.image} alt="" loading="lazy" />
              <span className={styles.icon} data-tone={feature.tone}>
                {feature.icon}
              </span>
            </div>
            <div className={styles.body}>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardText}>{feature.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
