"use client"
import React, { useState } from 'react'
import styles from "./component.module.css"
import { AnimatePresence } from 'framer-motion'
import SvgFilter from "@/public/assets/funnel.svg"
import SvgClose from "@/public/assets/x.svg"
import SideMenuForm from '../SideMenuForm'

function NavSideBar() {

    const [openFiltersMenu, setOpenFiltersMenu] = useState(false)

    const setMenuState: (value: boolean) => void = async (value: boolean) => {

        setOpenFiltersMenu(value)

    }

    return (
        <>

            {/* SHOWS ON MOBILE */}
            <button
                id={styles.btn_filters}
                onClick={() => setOpenFiltersMenu(!openFiltersMenu)}
                data-active={openFiltersMenu}
            >
                {openFiltersMenu ? (
                    <>
                        <SvgClose width={16} height={16} alt="Close" /> FILTERS
                    </>
                ) : (
                    <>
                        <SvgFilter width={16} height={16} alt="Filter" /> FILTERS
                    </>
                )}
            </button>

            {/* ONLY ON MOBILE */}
            <AnimatePresence
                initial={false}
                mode='wait'
            >
                {(openFiltersMenu == true) && (
                    <SideMenuForm
                        currValue={openFiltersMenu}
                        onClick={setMenuState as (parameter: boolean) => void}
                        mobileVersion={true}
                    />
                )}

            </AnimatePresence>

            {/* ONLY ON DESKTOP */}
            <SideMenuForm
                currValue={openFiltersMenu}
                onClick={setMenuState as (parameter: boolean) => void}
                mobileVersion={false}
            />
        </>
    )
}

export default NavSideBar