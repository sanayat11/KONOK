import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import type { UserProfile } from '@/entities/types';
import { createId } from '@/shared/lib/date';
import { IMAGES, responsiveImage } from '@/shared/lib/images';
import { useT } from '@/shared/i18n';
import { OrnamentPanel } from '@/shared/ui/OrnamentPanel';
import { LoginStep } from './steps/LoginStep';
import { RoleStep } from './steps/RoleStep';
import { GuestFormStep, GuestOtpStep, GuestPassportStep } from './steps/GuestSteps';
import { HostAboutStep, HostAccountStep, HostHospitalityStep, HostIdentityStep } from './steps/HostSteps';
import styles from './AuthPage.module.scss';

type Flow =
  | { kind: 'role' }
  | { kind: 'guest'; step: 1 | 2 | 3 }
  | { kind: 'host'; step: 1 | 2 | 3 | 4 };

/** Login and the guest / host registration flows, in a split layout with photography. */
export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useT();
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') === 'login' ? 'login' : 'register';
  const { touristForm, hostForm, register, setSelectedRole } = useAuthStore();
  // `?role=host` (e.g. from "Become a host") opens the host flow directly.
  const [flow, setFlow] = useState<Flow>(() => (params.get('role') === 'host' ? { kind: 'host', step: 1 } : { kind: 'role' }));

  const finish = (user: UserProfile) => {
    register(user);
    navigate('/cabinet?tab=profile');
  };

  // Built at submit time (event handler), not during render.
  const base = () => ({
    bannerUrl: IMAGES.defaultBanner,
    daysTravelled: 0,
    tripsCount: 0,
    memberSince: new Date().toLocaleDateString('ru-RU'),
    visitedRegions: [],
  });

  const finishGuest = () =>
    finish({
      ...base(),
      id: createId('user'),
      name: touristForm.fullName.split(' ')[0] || t('auth.defaultGuestName'),
      fullName: touristForm.fullName || t('auth.defaultGuestName'),
      email: touristForm.email,
      phone: touristForm.phone,
      avatarUrl: '',
      bio: '',
      role: 'tourist',
      languages: [{ name: 'ru', level: 'Fluent' }],
    });

  const finishHost = () =>
    finish({
      ...base(),
      id: createId('host'),
      name: hostForm.fullName.split(' ')[0] || t('auth.defaultHostName'),
      fullName: hostForm.fullName || t('auth.defaultHostName'),
      email: hostForm.email,
      phone: hostForm.phone,
      avatarUrl: hostForm.avatarUrl,
      bio: hostForm.about,
      role: 'host',
      languages: hostForm.languages.map((name) => ({ name, level: 'Fluent' })),
    });

  let content: React.ReactNode;
  let stepKey: string;
  if (mode === 'login') {
    stepKey = 'login';
    content = <LoginStep onDone={() => navigate('/cabinet?tab=profile')} onRegister={() => setParams({ mode: 'register' })} />;
  } else if (flow.kind === 'role') {
    stepKey = 'role';
    content = (
      <RoleStep
        onSelect={(role) => {
          setSelectedRole(role);
          setFlow(role === 'tourist' ? { kind: 'guest', step: 1 } : { kind: 'host', step: 1 });
        }}
      />
    );
  } else if (flow.kind === 'guest') {
    stepKey = `guest-${flow.step}`;
    content =
      flow.step === 1 ? (
        <GuestFormStep onBack={() => setFlow({ kind: 'role' })} onNext={() => setFlow({ kind: 'guest', step: 2 })} />
      ) : flow.step === 2 ? (
        <GuestOtpStep onBack={() => setFlow({ kind: 'guest', step: 1 })} onNext={() => setFlow({ kind: 'guest', step: 3 })} />
      ) : (
        <GuestPassportStep onBack={() => setFlow({ kind: 'guest', step: 2 })} onDone={finishGuest} />
      );
  } else {
    stepKey = `host-${flow.step}`;
    const back = () => setFlow(flow.step === 1 ? { kind: 'role' } : { kind: 'host', step: (flow.step - 1) as 1 | 2 | 3 });
    const next = () => setFlow({ kind: 'host', step: (flow.step + 1) as 2 | 3 | 4 });
    content =
      flow.step === 1 ? (
        <HostAccountStep onBack={back} onNext={next} />
      ) : flow.step === 2 ? (
        <HostAboutStep onBack={back} onNext={next} />
      ) : flow.step === 3 ? (
        <HostHospitalityStep onBack={back} onNext={next} />
      ) : (
        <HostIdentityStep onBack={back} onNext={finishHost} />
      );
  }

  // Panel colour follows the Figma screens: light for role/host, sage for the guest form, forest for verification.
  const tone = mode === 'login' ? 'beige' : flow.kind === 'guest' ? (flow.step === 1 ? 'sage' : 'forest') : 'beige';

  return (
    <div className={styles.page}>
      <img {...responsiveImage(IMAGES.authAside, '100vw')} alt="" className={styles.hero} />
      <div className={styles.container}>
        <OrnamentPanel tone={tone} className={styles.panel}>
          <div className={styles.panelInner}>
            <div key={stepKey} className={styles.stepEnter}>
              {content}
            </div>
          </div>
        </OrnamentPanel>
      </div>
    </div>
  );
};
