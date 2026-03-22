import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  status: 'available' | 'held' | 'sold';
  heldBy?: string;
}

interface Room {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdBy: string;
}

interface RoomStore {
  room: Room | null;
  products: Product[];
  userName: string;
  isVendor: boolean;

  setRoom: (room: Room) => void;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProductStatus: (
    productId: string,
    status: 'available' | 'held' | 'sold',
    heldBy?: string
  ) => void;
  setUserName: (name: string) => void;
  setIsVendor: (val: boolean) => void;
  reset: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  products: [],
  userName: '',
  isVendor: false,

  setRoom: (room) => set({ room }),
  setProducts: (products) => set({ products }),

  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),

  updateProductStatus: (productId, status, heldBy) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, status, heldBy } : p
      ),
    })),

  setUserName: (userName) => set({ userName }),
  setIsVendor: (isVendor) => set({ isVendor }),

  reset: () => set({ room: null, products: [], userName: '', isVendor: false }),
}));