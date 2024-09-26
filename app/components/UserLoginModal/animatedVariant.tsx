"use client";
import { Auth } from "firebase/auth";
import { AnimatePresence } from "framer-motion";
import UserModal from ".";

export default function ShowUpLoginPanelAnimated({
  apperanceCondition,
  customOnClickAction,
  auth,
}: {
  apperanceCondition: boolean;
  customOnClickAction?: () => void;
  auth: Auth;
}) {
  return (
    <AnimatePresence initial={false} mode="wait">
      {apperanceCondition && (
        <UserModal onClick={customOnClickAction} auth={auth} />
      )}
    </AnimatePresence>
  );
}
