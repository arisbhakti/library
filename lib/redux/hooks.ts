"use client";

import { useSyncExternalStore } from "react";

import { store, type AppDispatch, type RootState } from "@/lib/redux/store";

export function useAppDispatch(): AppDispatch {
  return store.dispatch;
}

export function useAppSelector<Selected>(
  selector: (state: RootState) => Selected,
): Selected {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
}
