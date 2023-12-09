import { steps } from "../constants";
import styles from "../style";
import StepCard from "./StepCard";

const  Steps = () => (
  <section id="clients" className={`${styles.paddingY} ${styles.flexCenter} flex-col relative `}>
    <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient bottom-40" />


    <div className="flex flex-wrap sm:justify-start justify-center w-full feedback-container relative z-[1]">
      {steps.map((card) => <StepCard key={card.id} {...card} />)}
    </div>
  </section>
);

export default Steps;