import React from "react";
import ReactPaginate from "react-paginate";
import styles from "./components.module.css";
import ChevronLeftSvg from "@/public/assets/chevron-left.svg";
import ChevronRightSvg from "@/public/assets/chevron-right.svg";

type NavTypes = {
  onPageChange: (event: { selected: number }) => void;
  pageCount: number;
  redirectToPage?: number;
};

export default function PaginationButtons({
  onPageChange,
  pageCount,
  redirectToPage,
}: NavTypes) {
  function maxBtnsByScreenSize() {
    if (window.matchMedia("(max-width: 440px)").matches) {
      return 1;
    } else if (window.matchMedia("(max-width: 760px)").matches) {
      return 2;
    }

    return 4;
  }

  const pageRange = typeof window !== "undefined" ? maxBtnsByScreenSize() : 1;

  return (
    <ReactPaginate
      nextLabel={
        <ChevronRightSvg alt="Icon to Right side" width={16} height={16} />
      }
      previousLabel={
        <ChevronLeftSvg alt="Icon to left side" width={16} height={16} />
      }
      onPageChange={onPageChange}
      pageRangeDisplayed={pageRange}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      forcePage={redirectToPage || 0}
      pageClassName={styles.li_item}
      pageLinkClassName="page-link"
      previousLinkClassName="page-link"
      previousClassName={styles.previous_btn}
      nextClassName={styles.next_btn}
      nextLinkClassName="page-item"
      breakLabel="..."
      breakClassName={styles.span_on_range}
      breakLinkClassName="page-link"
      containerClassName={styles.container}
      activeClassName={styles.active}
      renderOnZeroPageCount={null}
    />
  );
}
