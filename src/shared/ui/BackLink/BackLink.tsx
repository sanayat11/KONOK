import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { useT } from '@/shared/i18n';
import styles from './BackLink.module.scss';

export interface BackLinkProps {
  /** Where to go; without it the link goes back in history. */
  to?: string;
  label?: string;
  className?: string;
}

export const BackLink: React.FC<BackLinkProps> = ({ to, label, className }) => {
  const navigate = useNavigate();
  const { t } = useT();
  const content = (
    <>
      <ArrowLeft size={16} strokeWidth={1.8} className={styles.icon} />
      <span>{label ?? t('common.back')}</span>
    </>
  );

  return to ? (
    <Link to={to} className={clsx(styles.back, className)}>
      {content}
    </Link>
  ) : (
    <button type="button" className={clsx(styles.back, className)} onClick={() => navigate(-1)}>
      {content}
    </button>
  );
};
