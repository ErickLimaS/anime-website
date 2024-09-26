"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { AppStore } from "@/app/lib/redux/store";
import { userCustomStore } from "../user/anilistUserLoginOptions";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    // storeRef.current = makeStore()
    storeRef.current = userCustomStore;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
