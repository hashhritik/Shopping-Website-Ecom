"use client";

import React, { useEffect, useState } from "react";
import styles from "./countdown.module.scss";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = Date.now() + 48 * 60 * 60 * 1000;

    const timer = setInterval(() => {
      const difference = targetDate - Date.now();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.countdown}>
      {["days", "hours", "minutes", "seconds"].map((unit, index) => (
        <React.Fragment key={unit}>
          <h3>{String(timeLeft[unit as keyof TimeLeft]).padStart(2, "0")}</h3>
          {index < 3 && <span>:</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Countdown;
