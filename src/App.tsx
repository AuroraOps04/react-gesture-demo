import { useDrag } from "@use-gesture/react";
import styles from "./App.module.css";
import clamp from "lodash.clamp";
import { useRef } from "react";
import { useAnimate, motion, DynamicAnimationOptions } from "framer-motion";
function App() {
  const index = useRef(0);
  const imgs = [
    "https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    "https://images.pexels.com/photos/733853/pexels-photo-733853.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    "https://images.pexels.com/photos/4016596/pexels-photo-4016596.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    "https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    "https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  ];
  const [scope, animate] = useAnimate();
  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], cancel }) => {
      const opts: DynamicAnimationOptions = {
        type: "spring",

        stiffness: 10000,
        damping: 1000,
      };
      if (active && Math.abs(mx) > window.innerWidth / 2) {
        index.current = clamp(index.current - xDir, 0, imgs.length - 1);
        cancel();
      }
      const scale = active ? 1 - Math.abs(mx) / window.innerWidth / 2 : 1;
      imgs.forEach((_, i) => {
        if (i < index.current - 1 || i > index.current + 1) return;
        const selector = `.${styles.box}:nth-child(${i + 1})`;
        const childSelector = `${selector} .${styles.img}`;
        animate([
          [childSelector, { scale }, opts],
          [
            selector,
            {
              x: window.innerWidth * (i - index.current) + (active ? mx : 0),
            },
            {
              at: 0,
              ...opts,
            },
          ],
        ]);
      });
    },
  );
  return (
    <section ref={scope} className={styles.wrapper}>
      {imgs.map((img, i) => (
        <motion.div
          style={{
            x: window.innerWidth * (i - index.current),
          }}
          key={i}
          className={styles.box}
        >
          <div
            {...bind()}
            className={styles.img}
            style={{
              // left: index * window.innerWidth + mx,
              backgroundImage: `url(${img})`,
            }}
          ></div>
        </motion.div>
      ))}
    </section>
  );
}

export default App;
