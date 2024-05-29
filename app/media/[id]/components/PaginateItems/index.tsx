import React from 'react'
import ReactPaginate from 'react-paginate'
import styles from "./components.module.css"
import ChevronLeftSvg from "@/public/assets/chevron-left.svg"
import ChevronRightSvg from "@/public/assets/chevron-right.svg"

type NavTypes = {

    onPageChange: (event: { selected: number; }) => void,
    pageCount: number,
    redirectToPage?: number

}

function NavPaginateItems({ onPageChange, pageCount, redirectToPage }: NavTypes) {
    return (
        <ReactPaginate
            nextLabel={<ChevronRightSvg alt="Icon to Right side" width={16} height={16} />}
            onPageChange={onPageChange}
            pageRangeDisplayed={(typeof window !== "undefined") && window.matchMedia("(max-width: 440px)").matches ? 1 : 2}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            forcePage={redirectToPage || 0}
            previousLabel={<ChevronLeftSvg alt="Icon to left side" width={16} height={16} />}
            pageClassName={styles.li_item}
            pageLinkClassName="page-link"
            previousClassName={styles.previous_btn}
            previousLinkClassName="page-link"
            nextClassName={styles.next_btn}
            nextLinkClassName="page-item"
            breakLabel="..."
            breakClassName={styles.span_on_range}
            breakLinkClassName="page-link"
            containerClassName={styles.container}
            activeClassName={styles.active}
            renderOnZeroPageCount={null}
        />
    )
}

export default NavPaginateItems