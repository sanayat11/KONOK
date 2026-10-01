import { create } from 'zustand';

interface FavoritesState {
  favorites: string[]; // item IDs (guides, places, cars)
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('konok_favorites') : null;
  const initialFavs: string[] = stored ? JSON.parse(stored) : ['guide-8', 'place-tash-rabat', 'car-toyota-4runner'];

  return {
    favorites: initialFavs,
    toggleFavorite: (id: string) => {
      const { favorites } = get();
      const updated = favorites.includes(id)
        ? favorites.filter((item) => item !== id)
        : [...favorites, id];

      if (typeof window !== 'undefined') {
        localStorage.setItem('konok_favorites', JSON.stringify(updated));
      }
      set({ favorites: updated });
    },
    isFavorite: (id: string) => get().favorites.includes(id),
  };
});
