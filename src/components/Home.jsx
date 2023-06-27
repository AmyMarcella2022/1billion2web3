import React from 'react';
import styles from '../styles';

const Home = () => {
  
  return (
    <>
      <div className={`max-w-md p-3`}>
        <h2 className={`${styles.flexCenter} ${styles.heading2}`}>Welcome to</h2>
        <h4 className={`${styles.flexCenter} ${styles.paragraph}`}>1Billion2Web3Initiative</h4>
        <div className={`${styles.flexCenter} my-5`}>
          <a href='https://www.voxels.com/spaces/21012e4a-4c02-491e-b71a-13481a56eb66/play' target='_blank' className='bg-white hover:bg-slate-100 text-black font-bold py-2 px-4 rounded-full'>
            Start Your Web3 Journey
          </a>
        </div>
      </div>
    </>
  );
};

export default Home;
