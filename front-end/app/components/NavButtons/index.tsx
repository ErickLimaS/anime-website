"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import ChevronLeftSvg from "@/public/assets/chevron-left.svg"
import ChevronRightSvg from "@/public/assets/chevron-right.svg"

type PropsType = {
    functionReceived: (parameter: string | number) => void,
    options: OptionsType[],
    actualValue?: string | number, 
    previousAndNextButtons?: boolean
}

type OptionsType = {
    name: string,
    value: number | string
}

function NavButtons(props: PropsType) {

    const { functionReceived } = props

    const [lastValueReceived, setLastValueReceived] = useState<string | number>()

    useEffect(() => {
        setLastValueReceived(props.actualValue || "" || 1)
    }, [])

    function toggleStateAndReturnValue(value: string | number) {

        // if user tries to make the same call, it just wont continue to do requests
        if (lastValueReceived == value) return

        // run the received function
        functionReceived(value)

        // set the actual value
        setLastValueReceived(value)

    }

    return (
        <div className={styles.nav_button_container}>

            {/* MAINLY USED ON PAGINATION OF EPISODES CONTAINER */}
            {props.previousAndNextButtons && (
                <button
                    onClick={() => toggleStateAndReturnValue((lastValueReceived as number) - 1)}
                    disabled={(lastValueReceived as number) == props.options[0].value}>
                    <ChevronLeftSvg alt="Icon to left side" width={16} height={16}/>
                </button>
            )}

            {props.options.map((item, key: number) => (
                <button
                    key={key}
                    data-active={lastValueReceived == (item.value)}
                    onClick={() => toggleStateAndReturnValue(item.value)}
                >
                    {item.name}
                </button >

            ))}

            {/* MAINLY USED ON PAGINATION OF EPISODES CONTAINER */}
            {props.previousAndNextButtons && (
                <button
                    onClick={() => toggleStateAndReturnValue((lastValueReceived as number) + 1)}
                    disabled={(lastValueReceived as number) == props.options[props.options.length - 1]?.value}
                >
                    <ChevronRightSvg alt="Icon to right side" width={16} height={16} />
                </button>
            )}
        </div>
    )

}

export default NavButtons