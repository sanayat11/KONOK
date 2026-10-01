import { create } from 'zustand';
import { BookingItem } from '@/entities/types';
import { mockUserBookings } from '@/shared/api/mocks/itinerary';

interface BookingModalData {
  isOpen: boolean;
  type: 'guide' | 'car' | 'place';
  itemId: string;
  itemTitle: string;
  pricePerDay?: number;
  photoUrl: string;
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
