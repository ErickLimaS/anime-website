"use client";
import React from "react";
import SvgFilter from "@/public/assets/filter-right.svg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./component.module.css";

function SelectSort({
  customSelectInputOptions,
}: {
  customSelectInputOptions?: { name: string; value: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleNewUrlParams(element: HTMLSelectElement) {
    const currentUrlParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    currentUrlParams.set("sort", `${element.value}`);

    const newUrlParams = currentUrlParams ? `?${currentUrlParams}` : "";

    router.push(`${pathname}${decodeURI(newUrlParams)}`, { scroll: false });
  }

  return (
    <div id={styles.container} className="display_flex_row align_items_center">
      <SvgFilter height={16} width={16} alt="Filter Icon" />

      <form>
        <select
          aria-label="Sort Options"
          onChange={(e) => handleNewUrlParams(e.target)}
          defaultValue={
            new URLSearchParams(Array.from(searchParams.entries())).get(
              "sort"
            ) || "title_asc"
          }
        >
          {customSelectInputOptions ? (
            customSelectInputOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))
          ) : (
            <React.Fragment>
              <option value="title_asc">From A to Z</option>
              <option value="title_desc">From Z to A</option>
              <option value="releases_desc">Release Desc</option>
              <option value="releases_asc">Release Asc</option>
            </React.Fragment>
          )}
        </select>
      </form>
    </div>
  );
}

export default SelectSort;
