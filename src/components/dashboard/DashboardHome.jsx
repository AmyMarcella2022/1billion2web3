import React, { useCallback, useEffect, useState, useContext } from 'react';
import { dashboardAccordionList } from '../utils/constants';
import { Link } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore'
import { AppContext } from '../../context/AppContext';
import { getCurrentUser, db } from '../../firebase';

const DashboardHome = () => {
  const { setToastContent, setToastVariant, setToastOpen } = useContext(AppContext)

  const user = getCurrentUser()

  const [progress, setProgress] = useState(1)

  const getProgress = useCallback(async () => {
      const docRef = doc(db, 'progress', `${user.email}`)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()){
        const progressData = docSnap.data()
        setProgress(progressData.module)
      } else {
        setToastContent('Error getting progress')
        setToastVariant('alert-error')
        setToastOpen(true)
      }
  }, [])

  useEffect(() => {
    getProgress()
  }, [getProgress])

  return (
    <div className='p-5'>
      {dashboardAccordionList.map((module, index) => (
        <div key={module.id} className='collapse collapse-arrow bg-base-200 my-2 md:w-[500px]'>
          <input type='radio' name='my-accordion-3' />
          <div className='collapse-title text-xl font-medium'>{module.title}</div>
          <div className='collapse-content bg-white'>
            <ul>
              <li className='m-2 rounded-lg p-2 hover:bg-base-300 flex justify-between'>
                <a href={module.content.metaverse} target='_blank'>
                  Take Metaverse Class
                </a>
                <input className='checkbox checkbox-md' checked={progress > index ? true : false} type='checkbox' />
              </li>
              <li className='m-2 rounded-lg p-2 hover:bg-base-300 flex justify-between'>
                <Link to={module.content.path}>Take module quiz</Link>
                <input className='checkbox checkbox-md' checked={progress > index ? true : false} type='checkbox' />
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardHome;
