import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CartItem } from "@/lib/tanstack-api";

type CartState = {
  itemCount: number;
  items: CartItem[];
};

const initialState: CartState = {
  itemCount: 0,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartState: (
      state,
      action: PayloadAction<{
        itemCount: number;
        items: CartItem[];
      }>,
    ) => {
      state.itemCount = action.payload.itemCount;
      state.items = action.payload.items;
    },
    addCartItemOptimistic: (state, action: PayloadAction<CartItem>) => {
      const alreadyExists = state.items.some(
        (item) => item.bookId === action.payload.bookId,
      );

      if (alreadyExists) {
        return;
      }

      state.items = [action.payload, ...state.items];
      state.itemCount = state.items.length;
    },
    resetCartState: (state) => {
      state.itemCount = 0;
      state.items = [];
    },
  },
});

export const { setCartState, addCartItemOptimistic, resetCartState } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export type { CartState };
