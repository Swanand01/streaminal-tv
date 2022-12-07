import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

export default function Footer({ style }) {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.footerContainer}>
        <div>
          <img
            src="/logo.png"
            alt="logo"
            className={styles.logo}
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
        <h2 className={styles.text}>
          We do not host any of the content served.{" "}
        </h2>
        <a
          href="https://github.com/Swanand01/streaminal-tv"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img src="/github.png" alt="github" className={styles.github} />
        </a>
      </div>
      <div className={styles.footerCopyrights}>© Streminal Tv</div>
    </>
  );
}
