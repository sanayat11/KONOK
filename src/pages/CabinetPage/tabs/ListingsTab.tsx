import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle2, Eye, House, Info, LayoutList, Pencil, Plus, Trash2 } from 'lucide-react';
import type { UserProfile } from '@/entities/types';
import { StayCard, useOwnerStays, useStaysStore, type Stay, type StayDraft, type StayStatus } from '@/entities/stay';
import { CarCard } from '@/entities/car/ui/CarCard';
import { GuideCard } from '@/entities/guide/ui/GuideCard';
import { mockCars, mockGuides } from '@/shared/api/mocks';
import { useT, type TranslationKey } from '@/shared/i18n';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Modal } from '@/shared/ui/Modal';
import { Reveal, revealItem } from '@/shared/ui/Reveal';
import { StayWizard } from './StayWizard';
import hostStyles from './HostTabs.module.scss';
import v$ from './VehiclesTab.module.scss';
import styles from './ListingsTab.module.scss';
import t$ from './tabs.module.scss';

type Editor = { stay?: Stay } | null;
type Feedback = { tone: 'success' | 'error'; key: TranslationKey; at: number } | null;

/** Host listings: own stays (created here, drafts included) plus their existing profile / car listings. */
export const ListingsTab: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { t } = useT();
  const stays = useOwnerStays(user.id);
  const status = useStaysStore((s) => s.status);
  const saveStay = useStaysStore((s) => s.saveStay);
  const removeStay = useStaysStore((s) => s.removeStay);
  const reset = useStaysStore((s) => s.reset);
  const other = useMemo(
    () => ({ cars: mockCars.filter((c) => c.owner.id === user.id), guides: mockGuides.filter((g) => g.id === user.id) }),
    [user.id],
  );
  // The last editor / listing stays in state while its modal plays the exit animation.
  const [editor, setEditor] = useState<Editor>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Stay | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 3600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const notify = (tone: 'success' | 'error', key: TranslationKey) => setFeedback({ tone, key, at: Date.now() });

  const openEditor = (stay?: Stay) => {
    setEditor({ stay });
    setEditorOpen(true);
  };

  const save = (draft: StayDraft, nextStatus: StayStatus) => {
    const result = saveStay(user.id, draft, nextStatus, editor?.stay?.id);
    if (!result.ok) return false;
    const wasPublished = editor?.stay?.status === 'published';
    notify('success', nextStatus === 'draft' ? 'listingForm.savedDraft' : wasPublished ? 'listingForm.updated' : 'listingForm.published');
    setEditorOpen(false);
    return true;
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    const ok = removeStay(toDelete.id);
    setDeleteOpen(false);
    notify(ok ? 'success' : 'error', ok ? 'listingForm.deleted' : 'listingForm.errors.deleteFailed');
  };

  const addButton = (
    <button type="button" className={clsx(t$.primaryBtn, styles.addBtn)} onClick={() => openEditor()}>
      <Plus size={18} aria-hidden="true" />
      {t('listingForm.add')}
    </button>
  );

  const hasOther = other.cars.length + other.guides.length > 0;

  let staysContent: React.ReactNode;
  if (status === 'error') {
    staysContent = (
      <EmptyState
        icon={<AlertTriangle size={22} />}
        title={t('listingForm.loadErrorTitle')}
        text={t('cabinet.vehicles.loadErrorText')}
        action={
          <button type="button" className={t$.secondaryBtn} onClick={reset}>
            {t('cabinet.vehicles.reset')}
          </button>
        }
      />
    );
  } else if (!stays.length) {
    staysContent = (
      <EmptyState icon={<House size={22} />} title={t('listingForm.emptyTitle')} text={t('listingForm.emptyText')} action={addButton} />
    );
  } else {
    staysContent = (
      <Reveal stagger className={styles.grid}>
        {stays.map((stay, i) => (
          <StayCard
            key={stay.id}
            stay={stay}
            {...revealItem(i)}
            badge={stay.status === 'draft' ? t('listingForm.statusDraft') : t('listingForm.statusPublished')}
            actions={
              <>
                <Link to={`/stays/${stay.id}`} className={styles.cardBtn}>
                  <Eye size={15} aria-hidden="true" />
                  {t('listingForm.view')}
                </Link>
                <button type="button" className={styles.cardBtn} onClick={() => openEditor(stay)}>
                  <Pencil size={15} aria-hidden="true" />
                  {t('cabinet.vehicles.edit')}
                </button>
                <button
                  type="button"
                  className={clsx(styles.cardBtn, styles.deleteBtn)}
                  onClick={() => {
                    setToDelete(stay);
                    setDeleteOpen(true);
                  }}
                  aria-label={t('cabinet.vehicles.deleteLabel', { name: stay.title })}
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </>
            }
          />
        ))}
      </Reveal>
    );
  }

  return (
    <div className={t$.tab}>
      <div className={t$.pageHeader}>
        <div>
          <h1 className={t$.pageTitle}>{t('cabinet.listings.title')}</h1>
          <p className={t$.pageSubtitle}>{t('cabinet.listings.subtitle')}</p>
        </div>
        {status === 'ready' && stays.length > 0 && addButton}
      </div>

      <p className={v$.notice}>
        <Info size={16} aria-hidden="true" />
        {t('listingForm.demoNote')}
      </p>

      <div aria-live="polite" className={v$.feedbackSlot}>
        {feedback && (
          <p key={feedback.at} className={clsx(v$.feedback, feedback.tone === 'error' && v$.feedbackError)}>
            {feedback.tone === 'success' ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
            {t(feedback.key)}
          </p>
        )}
      </div>

      <section className={styles.section}>
        <h2 className={t$.sectionTitle}>{t('listingForm.staysTitle')}</h2>
        {staysContent}
      </section>

      <section className={styles.section}>
        <h2 className={t$.sectionTitle}>{t('listingForm.otherTitle')}</h2>
        {hasOther ? (
          <Reveal stagger className={hostStyles.grid}>
            {other.guides.map((g, i) => (
              <GuideCard key={g.id} guide={g} {...revealItem(i)} />
            ))}
            {other.cars.map((c, i) => (
              <CarCard key={c.id} car={c} {...revealItem(other.guides.length + i)} />
            ))}
          </Reveal>
        ) : (
          <EmptyState icon={<LayoutList size={22} />} title={t('cabinet.listings.emptyTitle')} text={t('cabinet.listings.emptyText')} />
        )}
      </section>

      <Modal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editor?.stay ? t('listingForm.editTitle') : t('listingForm.addTitle')}
        maxWidth="lg"
      >
        {editor && (
          <StayWizard key={editor.stay?.id ?? 'new'} stay={editor.stay} onCancel={() => setEditorOpen(false)} onSave={save} />
        )}
      </Modal>

      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title={t('listingForm.deleteTitle')} maxWidth="sm">
        <p className={v$.modalText}>{t('listingForm.deleteText', { name: toDelete?.title ?? '' })}</p>
        <div className={v$.modalActions}>
          <button type="button" className={t$.secondaryBtn} onClick={() => setDeleteOpen(false)}>
            {t('common.cancel')}
          </button>
          <button type="button" className={v$.dangerBtn} onClick={confirmDelete}>
            {t('cabinet.vehicles.deleteConfirm')}
          </button>
        </div>
      </Modal>
    </div>
  );
};
