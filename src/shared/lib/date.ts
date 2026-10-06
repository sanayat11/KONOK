import { useState } from 'react';

export const DAY_MS = 86_400_000;

/** yyyy-mm-dd for <input type="date">. */
export const toInputDate = (date: Date) => date.toISOString().slice(0, 10);

/** "12 окт" */
export const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace('.', '');

/** Today's date, fixed for the lifetime of the component (keeps render pure). */
export const useToday = () => useState(() => new Date())[0];

/** Unique-enough id for locally created records. */
export const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
