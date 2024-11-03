import { LampWallUpIcon } from "@/assets/icons/LampWallUpIcon"
import { useState } from "react"
import styles from './LampWallUp.module.css'

export const LampWallUp = () => {
    const [isOn, setIsOn] = useState(false)

    return (
        <button
            type="button"
            className={`opacity-0 hover:opacity-100 transition-all size-8 flex place-content-center place-items-center ${isOn ? 'opacity-100' : ''}`}
            onClick={() => setIsOn(!isOn)}
        >
            <LampWallUpIcon />
            <div
                className={`${isOn ? 'block' : 'hidden'} ${styles.light}`}
            />
        </button>
    )
}