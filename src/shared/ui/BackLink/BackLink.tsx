import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import styles from './BackLink.module.scss';

export interface BackLinkProps {
  /** Where to go; without it the link goes back in history. */
  to?: string;
  label?: string;
  className?: string;
}

/** Figma "← Назад": 30px arrow + 20px label. */
export const BackLink: React.FC<BackLinkProps> = ({ to, label = 'Назад', className }) => {
  const navigate = useNavigate();
  const content = (
    <>
      <ArrowLeft size={30} strokeWidth={1.5} />
      <span>{label}</span>
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
