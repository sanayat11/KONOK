import React from 'react';
import { HeroSearch } from '@/widgets/HeroSearch';
import { SubNav } from '@/widgets/SubNav';
import { WhyKyrgyzstan } from '@/widgets/WhyKyrgyzstan';
import { InteractiveMap } from '@/widgets/InteractiveMap';
import { GuideCard } from '@/entities/guide/ui/GuideCard';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { mockGuides } from '@/shared/api/mocks';
import styles from './HomePage.module.scss';

export const HomePage: React.FC = () => (
  <>
    <HeroSearch />
    <SubNav />
    <WhyKyrgyzstan />

    <div className={styles.page}>
      <section className={styles.section}>
        <SectionHeading
          title="Познакомьтесь с жителями"
          subtitle="Выбери не просто место — выбери человека, с которым хочется познакомиться"
          className={styles.heading}
        />
        <div className={styles.grid}>
          {mockGuides.slice(0, 4).map((guide) => (
            <GuideCard key={guide.id} guide={guide} showProfileButton={false} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeading
          title="Откройте регионы Кыргызстана"
          subtitle="У каждого региона — свои люди, истории и впечатления"
          className={styles.heading}
        />
        <InteractiveMap />
      </section>
    </div>
  </>
);
