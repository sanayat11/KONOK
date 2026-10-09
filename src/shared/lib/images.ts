/**
 * Local photography lives in /public/images as `<slug>-720.jpg` and `<slug>-1440.jpg`
 * (see public/images/CREDITS.md). Portraits in /images/people have a single size.
 */
export const image = (slug: string, size: 720 | 1440 = 720) => `/images/${slug}-${size}.jpg`;

const SIZED = /^(\/images\/[^/]+)-(720|1440)\.jpg$/;

/** `srcSet` for a local sized image URL; undefined for anything else. */
export const srcSetFor = (url: string): string | undefined => {
  const match = SIZED.exec(url);
  return match ? `${match[1]}-720.jpg 720w, ${match[1]}-1440.jpg 1440w` : undefined;
};

/** Props for an <img> that should pick the right local rendition. */
export const responsiveImage = (url: string, sizes: string) => {
  const srcSet = srcSetFor(url);
  return srcSet ? { src: url, srcSet, sizes } : { src: url };
};

/** UI-level imagery (not tied to listing data). */
export const IMAGES = {
  hero: image('son-kul-valley', 1440),
  nature: image('ala-archa-valley'),
  culture: image('yurt-interior'),
  hospitality: image('family-dastorkon'),
  experience: image('jeti-oguz-horses'),
  story: image('tunduk'),
  storySecondary: image('shyrdak'),
  host: image('yurt-dinner'),
  authAside: image('welcome-bread-salt', 1440),
  roleTourist: image('son-kul-shore'),
  roleHost: image('yurt-dinner'),
  defaultBanner: image('son-kul-valley', 1440),
  interests: {
    mountains: image('ala-archa-valley'),
    nature: image('sary-chelek'),
    horses: image('jeti-oguz-horses'),
    culture: image('shyrdak'),
    camping: image('son-kul-yurts-night'),
    cuisine: image('yurt-dinner'),
  },
} as const;
