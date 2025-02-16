"use client";
import { useEffect, useState } from "react";
import styles from "./countdown.module.scss";

export default function Countdown() {
  const [targetDate, setTargetDate] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (targetDate === null) {
      setTargetDate(Date.now() + 48 * 60 * 60 * 1000);
    }
  }, []);

  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const difference = targetDate - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]); 

  if (!targetDate) return <p>Loading countdown...</p>;

  return (
    <div className={styles.countdown}>
      {["Days", "Hr", "Mins", "Sec"].map((label, i) => (
        <div className={styles.box} key={label}>
          <h3>{String([timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds][i]).padStart(2, "0")}</h3>
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
}
