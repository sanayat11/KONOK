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

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Valid yyyy-mm-dd string, or null. */
export const parseInputDate = (value: string | null | undefined) =>
  value && ISO_DATE.test(value) && !Number.isNaN(new Date(value).getTime()) ? value : null;

/** Nights between two yyyy-mm-dd dates (0 when the range is missing or reversed). */
export const nightsBetween = (checkIn: string | null, checkOut: string | null) =>
  checkIn && checkOut ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / DAY_MS)) : 0;
