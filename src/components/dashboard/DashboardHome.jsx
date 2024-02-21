import React, { useCallback, useEffect, useState, useContext } from 'react';
import { dashboardAccordionList } from '../utils/constants';
import { Link } from 'react-router-dom';
// import { getDoc, doc, setDoc } from 'firebase/firestore';
import { AppContext } from '../../context/AppContext';
import { addProgress, getProgress } from '../../firebase';
import { BsLockFill } from 'react-icons/bs';
import Loader from '../common/Loader';

const DashboardHome = () => {
  const { setToastContent, setToastVariant, setToastOpen } = useContext(AppContext);

  // const user = getCurrentUser();

  const [metaProgress, setMetaProgress] = useState(0);
  const [classProgress, setClassProgress] = useState(0);
  const [moduleNumber, setModuleNumber] = useState(0);
  const [loading, setLoading] = useState(false);

  const saveProgress = async (module) => {
    setLoading(true);

    var email = localStorage.getItem('userEmail');

    const progress = {
      email,
      moduleNumber: module,
    };

    try {
      await addProgress(email, progress);
      setToastContent('Progress updated');
      setToastVariant('alert-success');
      setToastOpen(true);
    } catch (error) {
      setToastContent('Error updating progress');
      setToastVariant('alert-error');
      setToastOpen(true);
    }
  };

  const openMetaverse = (link, progress) => {
    setMetaProgress((prev) => prev + 1);
    setClassProgress((prev) => prev + 1);
    window.open(link, '_blank');
    saveProgress(index + 1);
  };

  const getPlayerProgress = useCallback(async () => {
    var email = localStorage.getItem('userEmail');

    const moduleNumber = await getProgress(email);

    setModuleNumber(moduleNumber);
    setClassProgress(moduleNumber);
    setMetaProgress(moduleNumber);
  }, []);

  useEffect(() => {
    getPlayerProgress();
  }, [getPlayerProgress]);

  return (
    <div className='p-5'>
      {loading ? <Loader /> : <div></div>}
      {dashboardAccordionList.map((module, index) => (
        <div key={module.id} className='collapse collapse-arrow bg-base-200 my-2 md:w-[500px]'>
          <input type='radio' name='my-accordion-3' />
          <div className='collapse-title text-xl font-medium'>{module.title}</div>
          <div className='collapse-content bg-white'>
            <ul>
              <li
                className={`m-2 rounded-lg p-2 hover:bg-base-300 flex justify-between ${
                  metaProgress < index ? 'pointer-events-none opacity-70' : ''
                }`}
              >
                <p
                  className='cursor-pointer'
                  onClick={() => openMetaverse(module.content.metaverse, index)}
                >
                  Take Metaverse Class
                </p>
                {metaProgress < index ? (
                  <BsLockFill />
                ) : (
                  <input
                    className='checkbox checkbox-md'
                    checked={metaProgress > index ? true : false}
                    type='checkbox'
                    onChange={() => {}}
                  />
                )}
              </li>
              <li
                className={`m-2 rounded-lg p-2 hover:bg-base-300 flex justify-between ${
                  classProgress < index
                    ? 'pointer-events-none opacity-70'
                    : classProgress === index
                    ? 'pointer-events-none opacity-70'
                    : ''
                }`}
              >
                <Link to={module.content.path}>Take Module Quiz</Link>
                {classProgress < index ? (
                  <BsLockFill />
                ) : classProgress === index ? (
                  <BsLockFill />
                ) : (
                  <input
                    className='checkbox checkbox-md'
                    checked={moduleNumber > index ? true : false}
                    type='checkbox'
                    onChange={() => {}}
                  />
                )}
              </li>
            </ul>
          </div>
        </div>
      ))}
      <div className='mt-4'>
        <button className={`btn btn-success ${moduleNumber === 9 ? '' : 'btn-disabled'} btn-block`}>
          Request Completion Certificate
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;
