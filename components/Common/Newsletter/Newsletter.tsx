import Image from 'next/image';
import { image1, image2 } from '@/public/newsletter';
import styles from './newsletter.module.scss';

export default function Newsletter() {
  return (
    <div className={styles.container}>
    <div className={styles.wrapper}>
      <Image className={styles.image} src={image1} alt="Newsletter Decoration 1" priority />
      <div className={styles.subContainer}>
        <div className={styles.content}>
          <h1 className={styles.heading}>Subscribe To Our Newsletter</h1>
          <p className={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.Scelerisque duis  ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin
          </p>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="michael@ymail.com"
          />
          <button className={styles.subscribeBtn}>Subscribe Now</button>
        </div>
      </div>
      <Image className={styles.image} src={image2} alt="Newsletter Decoration 2" priority />
    </div>
    </div>
  );
}