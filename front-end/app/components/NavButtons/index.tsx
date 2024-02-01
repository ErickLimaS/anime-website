"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import ChevronLeftSvg from "@/public/assets/chevron-left.svg"
import ChevronRightSvg from "@/public/assets/chevron-right.svg"

type PropsType = {
    functionReceived: (parameter: string | number) => void,
    options: OptionsType[],
    actualValue?: string | number,
    previousAndNextButtons?: boolean,
    customForPagination?: boolean
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
                    <ChevronLeftSvg alt="Icon to left side" width={16} height={16} />
                </button>
            )}

            {props.options.length <= 4 && (
                props.options.slice(0, 3).map((item, key: number) => (
                    <button
                        key={key}
                        data-active={lastValueReceived == (item.value)}
                        onClick={() => toggleStateAndReturnValue(item.value)}
                    >
                        {item.name}
                    </button >
                ))
            )}

            {((props.options.length > 4) && (lastValueReceived != props.options.length - 1)) && (
                <>

                    <div id={styles.dynamic_container}>
                        {props.options.slice(0, 3).map((item, key: number) => (
                            <button
                                key={key}
                                data-active={lastValueReceived == (Number(lastValueReceived) - (7 * key) <= 3 ? key + 1 : (Number(lastValueReceived) - (7 * key)))}
                                onClick={() => toggleStateAndReturnValue(Number(lastValueReceived) - (7 * key) <= 3 ? key + 1 : (Number(lastValueReceived) - (7 * key)))}
                            >
                                {Number(lastValueReceived) - (7 * key) <= 3 ? key + 1 : (Number(lastValueReceived) - (7 * key))}
                            </button >
                        ))}
                    </div>

                    <span>...</span>
                </>
            )}

            {props.options.length > 4 && (
                <button
                    data-active={lastValueReceived == (props.options[props.options.length - 1].value)}
                    onClick={() => toggleStateAndReturnValue(props.options[props.options.length - 1].value)}
                >
                    {props.options[props.options.length - 1].name}
                </button >
            )}

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