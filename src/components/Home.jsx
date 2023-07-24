import React, { useState } from 'react';
import styles from '../styles';

const Home = () => {
  const [username, setUsername] = useState('')

  const start = () => {
    if(username.trim() === '') {
      alert('Please enter your username')
      return;
    }

    sessionStorage.setItem('username', username)

    window.open('https://www.voxels.com/spaces/21012e4a-4c02-491e-b71a-13481a56eb66/play', '_blank')
  }
  
  return (
    <>
      <div className={`max-w-md p-3`}>
        <h2 className={`${styles.flexCenter} ${styles.heading2}`}>Welcome to</h2>
        <h4 className={`${styles.flexCenter} ${styles.paragraph}`}>1Billion2Web3Initiative</h4>
        <div className={`${styles.flexCenter} flex-col items-center my-5`}>
        <div className="join">
          <input className="input input-bordered rounded-l-full join-item" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username"/>
          <button className="btn btn-accent join-item rounded-r-full" onClick={start}>Click to start</button>
        </div>
          {/* <a href='' target='_blank' className='bg-white hover:bg-slate-100 text-black font-bold py-2 px-4 rounded-full'>
            Start Your Web3 Journey
          </a> */}
        </div>
      </div>
    </>
  );
};

export default Home;
