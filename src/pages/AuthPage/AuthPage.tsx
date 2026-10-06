import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/shared/lib/store/useAuthStore';
import { OrnamentPanel } from '@/shared/ui/OrnamentPanel';
import type { UserProfile } from '@/entities/types';
import { createId } from '@/shared/lib/date';
import { LoginStep } from './steps/LoginStep';
import { RoleStep } from './steps/RoleStep';
import { GuestFormStep, GuestOtpStep, GuestPassportStep } from './steps/GuestSteps';
import { HostAboutStep, HostAccountStep, HostHospitalityStep, HostIdentityStep } from './steps/HostSteps';
import styles from './AuthPage.module.scss';

type Flow =
  | { kind: 'role' }
  | { kind: 'guest'; step: 1 | 2 | 3 }
  | { kind: 'host'; step: 1 | 2 | 3 | 4 };

const HERO = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85';
const BANNER = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

/** Figma "Регистрация" / "Регистрация хозяина" screens; login reuses the same card. */
export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') === 'login' ? 'login' : 'register';
  const { touristForm, hostForm, register, setSelectedRole } = useAuthStore();
  const [flow, setFlow] = useState<Flow>({ kind: 'role' });

  const finish = (user: UserProfile) => {
    register(user);
    navigate('/cabinet?tab=profile');
  };

  // Built at submit time (event handler), not during render.
  const base = () => ({
    bannerUrl: BANNER,
    daysTravelled: 0,
    tripsCount: 0,
    memberSince: new Date().toLocaleDateString('ru-RU'),
    visitedRegions: [],
  });

  const finishGuest = () =>
    finish({
      ...base(),
      id: createId('user'),
      name: touristForm.fullName.split(' ')[0] || 'Гость',
      fullName: touristForm.fullName || 'Гость',
      email: touristForm.email,
      phone: touristForm.phone,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      bio: '',
      role: 'tourist',
      languages: [{ name: 'Русский', level: 'Fluent' }],
    });

  const finishHost = () =>
    finish({
      ...base(),
      id: createId('host'),
      name: hostForm.fullName.split(' ')[0] || 'Хозяин',
      fullName: hostForm.fullName || 'Хозяин',
      email: hostForm.email,
      phone: hostForm.phone,
      avatarUrl: hostForm.avatarUrl,
      bio: hostForm.about,
      role: 'host',
      languages: hostForm.languages.map((name) => ({ name, level: 'Fluent' })),
    });

  // Panel colour follows the Figma screens: beige for role/host, sky for the guest form, navy for verification.
  const tone = flow.kind === 'guest' ? (flow.step === 1 ? 'sky' : 'navy') : 'beige';

  let content: React.ReactNode;
  if (mode === 'login') {
    content = (
      <LoginStep
        onDone={() => navigate('/cabinet?tab=profile')}
        onRegister={() => setParams({ mode: 'register' })}
      />
    );
  } else if (flow.kind === 'role') {
    content = (
      <RoleStep
        onSelect={(role) => {
          setSelectedRole(role);
          setFlow(role === 'tourist' ? { kind: 'guest', step: 1 } : { kind: 'host', step: 1 });
        }}
      />
    );
  } else if (flow.kind === 'guest') {
    content =
      flow.step === 1 ? (
        <GuestFormStep onBack={() => setFlow({ kind: 'role' })} onNext={() => setFlow({ kind: 'guest', step: 2 })} />
      ) : flow.step === 2 ? (
        <GuestOtpStep onBack={() => setFlow({ kind: 'guest', step: 1 })} onNext={() => setFlow({ kind: 'guest', step: 3 })} />
      ) : (
        <GuestPassportStep onBack={() => setFlow({ kind: 'guest', step: 2 })} onDone={finishGuest} />
      );
  } else {
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

  return (
    <div className={styles.page}>
      <img src={HERO} alt="" className={styles.hero} />
      <div className={styles.container}>
        <OrnamentPanel tone={mode === 'login' ? 'beige' : tone} className={styles.panel}>
          <div className={styles.panelInner}>{content}</div>
        </OrnamentPanel>
      </div>
    </div>
  );
};
