import type { RegionId } from '@/entities/types';

/** Short region names as used in the Figma ("Хозяева в Нарыне"). */
export const REGION_NAMES: Record<RegionId, { name: string; locative: string }> = {
  bishkek: { name: 'Бишкек', locative: 'в Бишкеке' },
  'issyk-kul': { name: 'Ысык-Көл', locative: 'на Ысык-Көле' },
  naryn: { name: 'Нарын', locative: 'в Нарыне' },
  osh: { name: 'Ош', locative: 'в Оше' },
  'jalal-abad': { name: 'Жалал-Абад', locative: 'в Жалал-Абаде' },
  batken: { name: 'Баткен', locative: 'в Баткене' },
  talas: { name: 'Талас', locative: 'в Таласе' },
  chuy: { name: 'Чуй', locative: 'в Чуйской области' },
};
