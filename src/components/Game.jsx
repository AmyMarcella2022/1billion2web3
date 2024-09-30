import React, { useState, useEffect, useContext } from 'react';
import {
  module1,
  module2,
  module3,
  module4,
  module5,
  module6,
  module7,
  module8,
  module9,
} from '../utils';
import styles from '../styles';
// import { getCurrentUser } from '../firebase';
// import { setDoc, doc } from 'firebase/firestore';
// import { db } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
// import useAlertModal from '../hooks/useAlertModal';
import Loader from './common/Loader';
import { AppContext } from '../context/AppContext';
import logo from '../assets/1billweb3logo.png';
import { updateProgress } from '../firebase';

const Game = () => {
  const { setToastContent, setToastOpen, setToastVariant, setModuleNumber, setMetaLink } =
    useContext(AppContext);

  // const alertModal = useAlertModal();

  // const user = getCurrentUser();

  const { id } = useParams();

  const moduleNumber = parseInt(id);

  const navigate = useNavigate();

  const name = localStorage.getItem('userName');

  const [questions, setQuestions] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [Qanswer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [player, setPlayer] = useState({ name: name, score: 0 });

  const questionLength = questions.length;

  const saveProgress = async (module) => {
    setLoading(true);

    var email = localStorage.getItem('userEmail');

    const progress = {
      email: email,
      moduleNumber: module,
    };

    await updateProgress(progress);
  };

  const submitScore = () => {
    setLoading(true);

    try {
      switch (moduleNumber) {
        case 1:
          saveProgress(1);
          setModuleNumber(1);
          setMetaLink('https://www.voxels.com/spaces/e4de4917-6a2c-4312-bb52-340c02c328d2/play');
          navigate('/success');
          return;
        case 2:
          saveProgress(2);
          setModuleNumber(2);
          setMetaLink('https://www.voxels.com/spaces/e4de4917-6a2c-4312-bb52-340c02c328d2/play');
          navigate('/success');
          return;
        case 3:
          saveProgress(3);
          setModuleNumber(3);
          setMetaLink('https://www.voxels.com/spaces/1af3ad5b-6d3e-458d-b8e6-19ee1d984fb0/play');
          navigate('/success');
          return;
        case 4:
          saveProgress(4);
          setModuleNumber(4);
          setMetaLink('https://www.voxels.com/spaces/1af3ad5b-6d3e-458d-b8e6-19ee1d984fb0/play');
          navigate('/success');
          return;
        case 5:
          saveProgress(5);
          setModuleNumber(5);
          setMetaLink('https://www.voxels.com/spaces/d2adfb7c-8059-4e22-aff4-794b48d6283e/play');
          navigate('/success');
          return;
        case 6:
          saveProgress(6);
          setModuleNumber(6);
          setMetaLink('https://www.voxels.com/spaces/d2adfb7c-8059-4e22-aff4-794b48d6283e/play');
          navigate('/success');
          return;
        case 7:
          saveProgress(7);
          setModuleNumber(7);
          setMetaLink('https://www.voxels.com/spaces/e8baf729-786c-4a35-98d6-19d0fe7429d2/play');
          navigate('/success');
          return;
        case 8:
          saveProgress(8);
          setModuleNumber(8);
          setMetaLink('https://www.voxels.com/spaces/e8baf729-786c-4a35-98d6-19d0fe7429d2/play');
          navigate('/success');
          return;
        case 9:
          saveProgress(9);
          setModuleNumber(9);
          setMetaLink('');
          navigate('/success');
          return;
        default:
          console.log(moduleNumber);
          return;
      }
    } catch (error) {
      setToastContent('Server error. Try again later.');
      setToastVariant('alert-error');
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const checkScore = async (e) => {
    e.preventDefault();

    if (Qanswer === '') {
      setToastContent('Please select a valid option.');
      setToastVariant('alert-info');
      setToastOpen(true);
      return;
    }

    const currentQuestion = questions[questionNumber];
    const correctAnswer = currentQuestion.answer;

    if (Qanswer.toLowerCase() != correctAnswer.toLowerCase()) {
      setToastContent('Incorrect option. Try again');
      setToastVariant('alert-error');
      setToastOpen(true);
      return;
    }

    if (Qanswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setPlayer({
        ...player,
        score: player.score + 1,
      });
      // setScore((score) => score + 1);
    }

    if (questionNumber === questionLength - 1) {
      submitScore();
      return;
    }

    setQuestionNumber((questionNumber) => questionNumber + 1);
    setAnswer('');
  };

  useEffect(() => {
    switch (moduleNumber) {
      case 1:
        setQuestions(module1);
        break;
      case 2:
        setQuestions(module2);
        break;
      case 3:
        setQuestions(module3);
        break;
      case 4:
        setQuestions(module4);
        break;
      case 5:
        setQuestions(module5);
        break;
      case 6:
        setQuestions(module6);
        break;
      case 7:
        setQuestions(module7);
        break;
      case 8:
        setQuestions(module8);
        break;
      case 9:
        setQuestions(module9);
        break;
      default:
        setQuestions(module1);
        break;
    }
  }, []);

  return (
    <div className='pt-20'>
      <div className='flex justify-center lg:hidden'>
        <img src={logo} className='h-20 w-20 rounded-full' alt='1Bill2Web3' />
      </div>

      <h2 className='text-center font-bold text-2xl my-4'>Module {moduleNumber}</h2>
      <div className='card card-compact text-black overflow-y-scroll'>
        <div className='card-body'>
          <div className='card-title'>
            {loading ? (
              <div className='flex flex-col items-center justify-center h-full'>
                <div className='loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 mb-4'></div>
                <h3 className='text-center'>Loading...</h3>
              </div>
            ) : (
              <div className='flex flex-row justify-start gap-2'>
                <div className={`w-10 h-10 rounded-full ${styles.flexCenter} bg-dimBlue`}>
                  {questionNumber + 1}
                </div>
                <h4 className='font-poppins font-semibold text-black text-[20px] leading-[23px]'>
                  {questions[questionNumber]?.question}
                </h4>
              </div>
            )}
          </div>
          {questions[questionNumber]?.options.map((option, index) => (
            <label key={index} className='inline-flex items-center'>
              <input
                type='radio'
                className='form-radio h-4 w-4'
                name='qOption'
                checked={Qanswer === option}
                value={option}
                onClick={(e) => setAnswer(e.target.value)}
              />
              <span className='ml-3 mb-2 font-poppins font-normal text-black text-[18px]'>
                {option}
              </span>
            </label>
          ))}
          <div className='card-actions justify-end'>
            {loading ? (
              <Loader />
            ) : (
              <button
                onClick={checkScore}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                type='button'
              >
                {questionNumber === questionLength - 1 ? 'Mark Module As Done' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
