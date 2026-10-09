import type { Stay } from '@/entities/stay/model/types';

const seeded = '2026-06-01T00:00:00.000Z';

/**
 * Sample stays offered by residents whose profiles already describe hosting guests.
 * Base prices are the hosts' own daily rates; the guest-facing price adds the platform markup.
 * They are new listings, so they carry no ratings or reviews.
 */
export const mockStays: Stay[] = [
  {
    id: 'stay-tash-rabat-yurts',
    ownerId: 'guide-2',
    title: 'Юрты у караван-сарая Таш-Рабат',
    description:
      'Войлочные юрты в долине под Таш-Рабатом на высоте 3 200 м. Вечером — ужин у очага, утром — свежее молоко и лепёшки. Отсюда удобно уходить в конные походы к озеру Кёль-Суу.',
    regionId: 'naryn',
    location: 'Таш-Рабат, Ат-Башинский район',
    propertyType: 'yurt',
    basePricePerNight: 3500,
    maxGuests: 10,
    bedrooms: 3,
    beds: 10,
    bathrooms: 1,
    amenities: ['breakfast', 'horses', 'view', 'parking', 'kids'],
    photos: ['/images/tash-rabat-1440.jpg', '/images/son-kul-yurt-1440.jpg', '/images/yurt-interior-1440.jpg', '/images/family-dastorkon-1440.jpg'],
    status: 'published',
    source: 'seed',
    createdAt: seeded,
    updatedAt: seeded,
  },
  {
    id: 'stay-son-kul-yurt',
    ownerId: 'guide-9',
    title: 'Юрта на берегу Сон-Көла',
    description:
      'Летний юрточный лагерь на северном берегу озера Сон-Көл. Шырдаки ручной работы внутри, звёздное небо снаружи. Хозяин проводит мастер-класс по войлоку и ведёт конные переходы через перевал.',
    regionId: 'naryn',
    location: 'Озеро Сон-Көл, Кочкорский район',
    propertyType: 'yurt',
    basePricePerNight: 3100,
    maxGuests: 6,
    bedrooms: 1,
    beds: 6,
    bathrooms: 1,
    amenities: ['breakfast', 'horses', 'view', 'fireplace'],
    photos: ['/images/son-kul-shore-1440.jpg', '/images/son-kul-yurts-night-1440.jpg', '/images/tunduk-1440.jpg', '/images/shyrdak-1440.jpg'],
    status: 'published',
    source: 'seed',
    createdAt: seeded,
    updatedAt: seeded,
  },
  {
    id: 'stay-altyn-arashan',
    ownerId: 'guide-1',
    title: 'Юрты в долине Алтын-Арашан',
    description:
      'Юрты среди тянь-шаньских елей в долине горячих источников. До источников — несколько минут пешком, рядом начинаются тропы к перевалу Ала-Кёль.',
    regionId: 'issyk-kul',
    location: 'Алтын-Арашан, Ак-Суйский район',
    propertyType: 'yurt',
    basePricePerNight: 3200,
    maxGuests: 6,
    bedrooms: 2,
    beds: 6,
    bathrooms: 1,
    amenities: ['breakfast', 'hotWater', 'view', 'heating'],
    photos: ['/images/altyn-arashan-1440.jpg', '/images/altyn-arashan-horses-1440.jpg', '/images/karakol-gorge-1440.jpg'],
    status: 'published',
    source: 'seed',
    createdAt: seeded,
    updatedAt: seeded,
  },
  {
    id: 'stay-talas-ethno-yurt',
    ownerId: 'guide-7',
    title: 'Этно-юрта рядом с Манас-Ордо',
    description:
      'Семейная юрта в Таласской долине с войлочными коврами и вышивкой ручной работы. Хозяйка рассказывает об эпосе «Манас» и проводит этно-мастерские.',
    regionId: 'talas',
    location: 'Манас-Ордо, Таласский район',
    propertyType: 'yurt',
    basePricePerNight: 2700,
    maxGuests: 4,
    bedrooms: 1,
    beds: 4,
    bathrooms: 1,
    amenities: ['breakfast', 'kitchen', 'parking', 'kids'],
    photos: ['/images/yurt-interior-1440.jpg', '/images/shyrdak-1440.jpg', '/images/yurt-dinner-1440.jpg'],
    status: 'published',
    source: 'seed',
    createdAt: seeded,
    updatedAt: seeded,
  },
];
