"use client";
import React, { useEffect } from "react";
import ErrorImg from "@/public/error-img-4.png";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./errorStyles.module.css";
import { usePathname } from "next/navigation";

function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const pathname = usePathname();

  return (
    <div id={styles.error_container}>
      <div id={styles.img_container}>
        <Image src={ErrorImg} height={240} alt={"Error 404"} />
      </div>

      <div id={styles.heading_container}>
        <h1>Something went wrong!</h1>

        <p>
          Sometimes is due to the API Hosting! <b>Reloading Page Might Work!</b>
        </p>

        {pathname.slice(0, 6) == "/watch" && (
          <p>
            On videos, try to change between <b>dub</b> and <b>sub</b> options.
          </p>
        )}

        <span>
          <b>{error.name}</b>: {error.message}
        </span>
      </div>

      <div id={styles.buttons_container}>
        <motion.button
          onClick={() => window.location.reload()}
          whileTap={{ scale: 0.9 }}
        >
          Try again
        </motion.button>

        <motion.a href={"/"} whileTap={{ scale: 0.9 }}>
          Return to Home Page
        </motion.a>
      </div>
    </div>
  );
}

export default ErrorPage;
