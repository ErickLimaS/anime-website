import React from "react";
import ErrorImg from "@/public/error-img-1.png";
import Image from "next/image";
import styles from "./notFoundStyles.module.css";

function Custom404() {
  return (
    <div id={styles.error_container}>
      <div id={styles.heading_container}>
        <div id={styles.img_container}>
          <Image src={ErrorImg} height={330} alt={"Error 404"} />
        </div>

        <h1>Page Not Found!</h1>

        <p>{`We couldn't find the page you're trying to reach.`}</p>
      </div>

      <div id={styles.button_container}>
        <a href={"/"}>Return to Home Page</a>
      </div>
    </div>
  );
}

export default Custom404;
