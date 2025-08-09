import Image from "next/image";
import FacebookSvg from "@/public/assets/facebook.svg";
import InstagramSvg from "@/public/assets/instagram.svg";
import YoutubeSvg from "@/public/assets/youtube.svg";
import TwitterSvg from "@/public/assets/twitter-x.svg";
import Link from "next/link";
import React from "react";
import styles from "../footerComponent.module.css";

function FooterHeading() {
  return (
    <div id={styles.social_links_container} className="display_flex_row">
      <Link id={styles.img_container} href="/">
        <Image
          src="/logo.png"
          alt="Aniproject Site Logo"
          fill
          sizes="91px"
        ></Image>
      </Link>

      <div id={styles.social_media_container}>
        <ul className="display_flex_row">
          <li>
            <Link href="#">
              <FacebookSvg width={16} height={16} title="Facebook" />{" "}
              <span>Facebook</span>
            </Link>
          </li>
          <li>
            <Link href="#">
              <TwitterSvg width={16} height={16} title="Twitter" />{" "}
              <span>Twitter</span>
            </Link>
          </li>
          <li>
            <Link href="#">
              <InstagramSvg width={16} height={16} title="Instagram" />{" "}
              <span>Instagram</span>
            </Link>
          </li>
          <li>
            <Link href="#">
              <YoutubeSvg width={16} height={16} title="YouTube" />{" "}
              <span>YouTube</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FooterHeading;
