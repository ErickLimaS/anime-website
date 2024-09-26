import React from "react";
import styles from "./component.module.css";

function DubbedCheckboxButton({
  isDubActive,
  clickAction,
  styleRow,
}: {
  isDubActive: boolean;
  clickAction: () => void;
  styleRow?: boolean;
}) {
  function handleDubbedInputValueChange() {
    localStorage.setItem("dubEpisodes", isDubActive ? "false" : "true");

    clickAction();
  }

  return (
    <div
      id={styles.dub_input_container}
      className={styleRow ? `${styles.row}` : ""}
    >
      <label>
        <input
          type="checkbox"
          name="isDubbed"
          checked={isDubActive}
          aria-label="Dubbed Episodes"
          onChange={() => handleDubbedInputValueChange()}
        />
        <span />
      </label>

      <p>Dubbed</p>
    </div>
  );
}

export default DubbedCheckboxButton;
