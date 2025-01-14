import React from 'react';
import styles from './timer.module.css';

interface TimerProps {
    timeLeft: {
        dayLeft: string;
        timeLeft: string;
    };
}

export const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
    const { dayLeft, timeLeft: hours } = timeLeft;

    return (
        <div className={styles.container}>
            {/* <div className={styles.day}>{dayLeft} d</div> */}
            <div className={styles.time}>
                {hours.split('').map((char, index) => (
                    <span
                        key={index}
                        className={char === ':' ? styles.colon : styles.digit}
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
};
