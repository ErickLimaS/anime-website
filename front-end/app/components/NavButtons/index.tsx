"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"

type PropsType = {
    functionReceived: (parameter: string | number) => void,
    options: OptionsType[],
    actualValue?: string | number
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
            {props.options.map((item, key: number) => (
                <button
                    key={key}
                    data-active={lastValueReceived == (item.value)}
                    onClick={() => toggleStateAndReturnValue(item.value)}
                >
                    {item.name}
                </button >
            ))}
        </div>
    )

}

export default NavButtons