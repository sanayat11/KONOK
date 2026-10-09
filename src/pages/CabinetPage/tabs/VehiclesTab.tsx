import React, { useEffect, useState } from 'react';
import { AlertTriangle, CarFront, CheckCircle2, Info, Plus } from 'lucide-react';
import clsx from 'clsx';
import type { UserProfile } from '@/entities/types';
import { useOwnerVehicles, useVehiclesStore, VehicleCard, type HostVehicle, type VehicleDraft } from '@/entities/vehicle';
import { useT, type TranslationKey } from '@/shared/i18n';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Modal } from '@/shared/ui/Modal';
import { Reveal, revealItem } from '@/shared/ui/Reveal';
import { VehicleForm } from './VehicleForm';
import styles from './VehiclesTab.module.scss';
import hostStyles from './HostTabs.module.scss';
import t$ from './tabs.module.scss';

type Editor = { mode: 'add' } | { mode: 'edit'; vehicle: HostVehicle } | null;
type Feedback = { tone: 'success' | 'error'; key: TranslationKey; at: number } | null;

/** "Мои автомобили": the vehicles a host can offer to guests (stored in this browser only). */
export const VehiclesTab: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { t } = useT();
  const vehicles = useOwnerVehicles(user.id);
  const status = useVehiclesStore((s) => s.status);
  const saveVehicle = useVehiclesStore((s) => s.saveVehicle);
  const removeVehicle = useVehiclesStore((s) => s.removeVehicle);
  const reset = useVehiclesStore((s) => s.reset);
  // The last editor / vehicle stays in state while its modal plays the exit animation.
  const [editor, setEditor] = useState<Editor>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [toDelete, setToDelete] = useState<HostVehicle | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 3200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const notify = (tone: 'success' | 'error', key: TranslationKey) => setFeedback({ tone, key, at: Date.now() });

  const submit = (draft: VehicleDraft) => {
    if (!editor) return false;
    const result = saveVehicle(user.id, draft, editor.mode === 'edit' ? editor.vehicle.id : undefined);
    if (!result.ok) return false;
    notify('success', editor.mode === 'edit' ? 'cabinet.vehicles.updated' : 'cabinet.vehicles.added');
    setEditorOpen(false);
    return true;
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    const ok = removeVehicle(user.id, toDelete.id);
    setDeleteOpen(false);
    notify(ok ? 'success' : 'error', ok ? 'cabinet.vehicles.deleted' : 'cabinet.vehicles.errors.deleteFailed');
  };

  const openEditor = (next: NonNullable<Editor>) => {
    setEditor(next);
    setEditorOpen(true);
  };

  const askDelete = (vehicle: HostVehicle) => {
    setToDelete(vehicle);
    setDeleteOpen(true);
  };

  const addButton = (
    <button type="button" className={t$.primaryBtn} onClick={() => openEditor({ mode: 'add' })}>
      <Plus size={18} aria-hidden="true" />
      {t('cabinet.vehicles.add')}
    </button>
  );

  let content: React.ReactNode;
  if (status === 'error') {
    content = (
      <EmptyState
        icon={<AlertTriangle size={22} />}
        title={t('cabinet.vehicles.loadErrorTitle')}
        text={t('cabinet.vehicles.loadErrorText')}
        action={
          <button type="button" className={t$.secondaryBtn} onClick={reset}>
            {t('cabinet.vehicles.reset')}
          </button>
        }
      />
    );
  } else if (!vehicles.length) {
    content = (
      <EmptyState
        icon={<CarFront size={22} />}
        title={t('cabinet.vehicles.emptyTitle')}
        text={t('cabinet.vehicles.emptyText')}
        action={addButton}
      />
    );
  } else {
    content = (
      <Reveal stagger className={hostStyles.grid}>
        {vehicles.map((vehicle, i) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={(v) => openEditor({ mode: 'edit', vehicle: v })}
            onDelete={askDelete}
            {...revealItem(i)}
          />
        ))}
      </Reveal>
    );
  }

  return (
    <div className={t$.tab}>
      <div className={t$.pageHeader}>
        <div>
          <h1 className={t$.pageTitle}>{t('cabinet.vehicles.title')}</h1>
          <p className={t$.pageSubtitle}>{t('cabinet.vehicles.subtitle')}</p>
        </div>
        {status === 'ready' && vehicles.length > 0 && addButton}
      </div>

      <p className={styles.notice}>
        <Info size={16} aria-hidden="true" />
        {t('cabinet.vehicles.demoNote')}
      </p>

      <div aria-live="polite" className={styles.feedbackSlot}>
        {feedback && (
          <p key={feedback.at} className={clsx(styles.feedback, feedback.tone === 'error' && styles.feedbackError)}>
            {feedback.tone === 'success' ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
            {t(feedback.key)}
          </p>
        )}
      </div>

      {content}

      <Modal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editor?.mode === 'edit' ? t('cabinet.vehicles.editTitle') : t('cabinet.vehicles.addTitle')}
        maxWidth="lg"
      >
        {editor && (
          <VehicleForm
            key={editor.mode === 'edit' ? editor.vehicle.id : 'new'}
            vehicle={editor.mode === 'edit' ? editor.vehicle : undefined}
            onCancel={() => setEditorOpen(false)}
            onSubmit={submit}
          />
        )}
      </Modal>

      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title={t('cabinet.vehicles.deleteTitle')} maxWidth="sm">
        <p className={styles.modalText}>{t('cabinet.vehicles.deleteText', { name: toDelete?.makeModel ?? '' })}</p>
        <div className={styles.modalActions}>
          <button type="button" className={t$.secondaryBtn} onClick={() => setDeleteOpen(false)}>
            {t('common.cancel')}
          </button>
          <button type="button" className={styles.dangerBtn} onClick={confirmDelete}>
            {t('cabinet.vehicles.deleteConfirm')}
          </button>
        </div>
      </Modal>
    </div>
  );
};
