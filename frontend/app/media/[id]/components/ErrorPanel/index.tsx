import React from "react";
import ErrorImg from "@/public/error-img-2.png";
import Image from "next/image";
import styles from "./component.module.css";

export default function ErrorPanel({
  errorText,
}: {
  errorText: React.ReactNode;
}) {
  return (
    <div id={styles.no_episodes_container}>
      <Image src={ErrorImg} alt="Error" height={200} />

      <p>{errorText}</p>
    </div>
  );
}
