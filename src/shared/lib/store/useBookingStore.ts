import { create } from 'zustand';
import { BookingItem } from '@/entities/types';
import { mockUserBookings } from '@/shared/api/mocks/itinerary';

interface BookingModalData {
  isOpen: boolean;
  type: 'guide' | 'car' | 'place' | 'stay';
  itemId: string;
  itemTitle: string;
  /** Daily price for guides and cars, used as is. */
  pricePerDay?: number;
  /** Stays: the host's base nightly price; the modal adds the markup via shared/lib/pricing. */
  basePricePerNight?: number;
  photoUrl: string;
  /** Optional prefill from the search (yyyy-mm-dd). */
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

interface BookingStoreState {
  bookings: BookingItem[];
  bookingModal: BookingModalData;
  openBookingModal: (data: Omit<BookingModalData, 'isOpen'>) => void;
  closeBookingModal: () => void;
  addBooking: (booking: BookingItem) => void;
}

export const useBookingStore = create<BookingStoreState>((set) => ({
  bookings: mockUserBookings,
  bookingModal: {
    isOpen: false,
    type: 'guide',
    itemId: '',
    itemTitle: '',
    pricePerDay: 0,
    photoUrl: '',
  },
  openBookingModal: (data) =>
    set({
      bookingModal: {
        ...data,
        isOpen: true,
      },
    }),
  closeBookingModal: () =>
    set((state) => ({
      bookingModal: {
        ...state.bookingModal,
        isOpen: false,
      },
    })),
  addBooking: (newBooking) =>
    set((state) => ({
      bookings: [newBooking, ...state.bookings],
    })),
}));
