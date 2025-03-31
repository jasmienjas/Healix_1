import React, { useState, useEffect } from "react";
import styles from './AppOfMaria.module.css'; // Import the CSS module

const DynamicCounter = () => {
    const [count, setCount] = useState(0);
    const [inView, setInView] = useState(false);

    // Check scroll position to trigger the counter increment
    useEffect(() => {
        const handleScroll = () => {
            const isInView = window.scrollY > 100; // Check if the scroll position passes 100px
            setInView(isInView);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll); // Cleanup on component unmount
    }, []);

    // Increment counter when in view
    useEffect(() => {
        console.log("In view?", inView); // Check if scroll position is set
        if (inView) {
            const timer = setInterval(() => {
                setCount((prevCount) => {
                    if (prevCount < 100) {
                        console.log("Incrementing count:", prevCount + 1); // Check each increment
                        return prevCount + 1;
                    }
                    clearInterval(timer); // Stop the interval once 100 is reached
                    return prevCount;
                });
            }, 50); // Increment every 50ms

            return () => {
                clearInterval(timer); // Cleanup on unmount
            };
        }
    }, [inView]); // Dependency on `inView` to trigger this effect

    return (
        <div className={`${styles['counter-container']} ${inView ? styles['in-view'] : ''}`} id="counter">
            {/* Counters */}
            <div className={styles['counter']}>
                <span className={styles['counter-value']}>{count}</span>
                <p>Competent doctors</p>
            </div>

            <div className={styles['counter']}>
                <span className={styles['counter-value']}>{count * 2}</span>
                <p>Satisfied patients</p>
            </div>

            <div className={styles['counter']}>
                <span className={styles['counter-value']}>{count * 3}</span>
                <p>Successful treatments</p>
            </div>

            <div className={styles['counter']}>
                <span className={styles['counter-value']}>{count * 4}</span>
                <p>Happy families</p>
            </div>

            <div className={styles['counter']}>
                <span className={styles['counter-value']}>{count * 5}</span>
                <p>Positive reviews</p>
            </div>
        </div>
    );
};

export default DynamicCounter;
