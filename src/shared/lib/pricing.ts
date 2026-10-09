/**
 * Accommodation pricing. Every stay is offered to guests at one flat nightly price.
 * Listings still keep the host's own `basePricePerNight` internally, but everything a guest sees
 * (cards, details, booking totals) goes through these helpers — never through the stored price.
 */
export const STAY_PRICE_PER_NIGHT = 500;

/** Final nightly price shown to guests, in KGS. The host's base price doesn't change it. */
export const stayNightlyPrice = (_basePricePerNight: number) => STAY_PRICE_PER_NIGHT;

/** Final price for a stay of `nights` nights: final nightly price × nights. */
export const stayTotalPrice = (basePricePerNight: number, nights: number) =>
  stayNightlyPrice(basePricePerNight) * Math.max(1, Math.round(nights));
