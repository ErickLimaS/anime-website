import React from "react";
import Image from "next/image";
import ErrorImg from "@/public/error-img-2.png";
import styles from "./component.module.css";

export default function ErrorPlaceholder() {
  return (
    <div className={styles.error_container}>
      <div className={styles.wrapper}>
        <div className={styles.img_container}>
          <Image src={ErrorImg} alt="Error" height={200} />
        </div>

        <p>A error happened while loading this section.</p>
      </div>
    </div>
  );
}
