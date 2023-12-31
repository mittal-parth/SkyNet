import React from 'react';
import styles from "../style";
import { Billing, Business, CardDeal, Clients, CTA, Footer, Navbar, Stats, Steps, Hero , DataRow, ModelRow} from "../components";

export default function Landing() {
    return (
        <>
        <div className="bg-primary w-full overflow-hidden">
    

    <div className={`bg-primary ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>
    
    <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        {/* <Business /> */}
        <div className='flex justify-center'>
        <Steps />
        </div>
        {/* <Stats /> */}
        {/* <Clients /> */}
        <DataRow />
        <ModelRow />
        {/* <Billing /> */}
        {/* <CardDeal /> */}
        <CTA />
        {/* <Footer /> */}
      </div>
    </div>
  </div>
        </>
    );
}