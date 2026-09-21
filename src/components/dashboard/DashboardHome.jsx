import React, { useCallback, useEffect, useState, useContext } from 'react';
import { dashboardAccordionList } from '../utils/constants';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  // addProgress,
  getProgress,
} from '../../firebase';
import { BsLockFill } from 'react-icons/bs';
import Loader from '../common/Loader';
import VideoModal from '../common/VideoModal';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../../firebase';

const triggerMintAll = httpsCallable(getFunctions(app), 'triggerMintAll');

const DashboardHome = () => {
  const { setToastContent, setToastVariant, setToastOpen } = useContext(AppContext);

  const [metaProgress, setMetaProgress] = useState(0);
  const [classProgress, setClassProgress] = useState(0);
  const [moduleNumber, setModuleNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  // const saveProgress = async (module) => {
  //   var email = localStorage.getItem('userEmail');

  //   const progress = {
  //     email,
  //     moduleNumber: module,
  //   };

  //   try {
  //     await addProgress(email, progress);
  //     setToastContent('Progress updated');
  //     setToastVariant('alert-success');
  //     setToastOpen(true);
  //   } catch (error) {
  //     console.log(error)
  //     setToastContent('Error updating progress');
  //     setToastVariant('alert-error');
  //     setToastOpen(true);
  //   }
  // };

  const openMetaverse = (link, title) => {
    setMetaProgress((prev) => prev + 1);
    setClassProgress((prev) => prev + 1);
    setActiveVideo({ title, url: link });
    // saveProgress(progress + 1);
  };

  const getPlayerProgress = useCallback(async () => {
    setLoading(true);

    try {
      var email = localStorage.getItem('userEmail');

      const moduleNumber = await getProgress(email);

      setModuleNumber(moduleNumber);
      setClassProgress(moduleNumber);
      setMetaProgress(moduleNumber);
    } catch (error) {
      setToastContent(`${error}`);
      setToastVariant('alert-error');
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const requestCertificate = async () => {
    // set button to loading state
    setButtonLoading(true);

    // Toast initiating request
    setToastContent(`Initialising Request..`);
    setToastVariant('alert-info');
    setToastOpen(true);

    // try-catch making request to the callable function
    try {
      const { data } = await triggerMintAll();

      setToastContent(
        data?.message || 'Mint queue populated: 9 module NFTs + 1 certificate.'
      );
      setToastVariant('alert-success');
      setToastOpen(true);
    } catch (error) {
      setToastContent(error.message || 'Error making Request..');
      setToastVariant('alert-error');
      setToastOpen(true);
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    getPlayerProgress();
  }, [getPlayerProgress]);

  return (
    <div className='p-5'>
      {loading ? (
        <Loader />
      ) : (
        <div>
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
                      onClick={() =>
                        openMetaverse(
                          module.content.metaverse,
                          module.content.videoTitle || module.title
                        )
                      }
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
        </div>
      )}

      <div className='mt-4'>
        <button
          onClick={requestCertificate}
          className={`btn btn-success ${moduleNumber === 9 ? '' : 'btn-disabled'} btn-block`}
        >
          {buttonLoading ? <Loader /> : 'Request Completion Certificate'}
        </button>
      </div>

      <VideoModal
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        title={activeVideo?.title}
        src={activeVideo?.url}
      />
    </div>
  );
};

export default DashboardHome;
