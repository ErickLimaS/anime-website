import React from "react";
import styles from "./footerComponent.module.css";
import Link from "next/link";
import FooterHeading from "./components/footerHeading";
import NavLinks from "./components/navLinks";

function Footer() {
  const currYear = new Date().getFullYear();

  return (
    <footer id={styles.footer}>
      <section id={styles.info_container}>
        <FooterHeading />

        <span id={styles.span_border1}></span>

        <NavLinks />
      </section>

      <section id={styles.copyright_section} className="">
        <div className="center display_flex_row">
          <div>
            <small>
              Copyright © {currYear}, AniProject. All Rights Reserved*
            </small>
          </div>

          <div>
            <Link href="#">
              <small>Privacy Police</small>
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
