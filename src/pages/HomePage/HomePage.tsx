import React from 'react';
import { HeroSearch } from '@/widgets/HeroSearch';
import { SubNav } from '@/widgets/SubNav';
import { WhyKyrgyzstan } from '@/widgets/WhyKyrgyzstan';
import { InteractiveMap } from '@/widgets/InteractiveMap';
import { GuideCard } from '@/entities/guide/ui/GuideCard';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Reveal, revealItem } from '@/shared/ui/Reveal';
import { mockGuides } from '@/shared/api/mocks';
import { useT } from '@/shared/i18n';
import styles from './HomePage.module.scss';

export const HomePage: React.FC = () => {
  const { t } = useT();

  return (
    <>
      <HeroSearch />
      <SubNav />
      <WhyKyrgyzstan />

      <div className={styles.page}>
        <section className={styles.section}>
          <Reveal>
            <SectionHeading
              title={t('home.residentsTitle')}
              subtitle={t('home.residentsSubtitle')}
              className={styles.heading}
            />
          </Reveal>
          <Reveal stagger className={styles.grid}>
            {mockGuides.slice(0, 4).map((guide, index) => (
              <GuideCard key={guide.id} guide={guide} showProfileButton={false} {...revealItem(index)} />
            ))}
          </Reveal>
        </section>

        <section className={styles.section}>
          <Reveal>
            <SectionHeading
              title={t('home.regionsTitle')}
              subtitle={t('home.regionsSubtitle')}
              className={styles.heading}
            />
          </Reveal>
          <Reveal>
            <InteractiveMap />
          </Reveal>
        </section>
      </div>
    </>
  );
};
