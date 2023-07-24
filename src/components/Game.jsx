import React, { useState, useEffect } from 'react';
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
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import useAlertModal from '../hooks/useAlertModal';

const Game = () => {
  const alertModal = useAlertModal();

  const { id } = useParams();

  const moduleNumber = parseInt(id);

  const navigate = useNavigate();

  const name = sessionStorage.getItem('name');

  const [questions, setQuestions] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [Qanswer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [player, setPlayer] = useState({ name: name, score: 0 });

  const questionLength = questions.length;

  const saveProgress = async (module) => {
    try {
      await addDoc(collection(db, 'progress'), {
        username: sessionStorage.getItem('username'),
        module: module
      })
    } catch (error) {
      alert('Error saving progress')
    }
  }

  const submitScore = async () => {
    setLoading(true);

    try {
      await addDoc(collection(db, `module${moduleNumber}Scoreboard`), {
        playerName: player.name,
        score: player.score,
        date: new Date().toLocaleString(),
      });
      if(moduleNumber === 2){
        navigate(`/module/${moduleNumber + 1}`);
        return;
      }
      if(moduleNumber === 4){
        navigate(`/module/${moduleNumber + 1}`);
        return;
      }
      if(moduleNumber === 6){
        navigate(`/module/${moduleNumber + 1}`);
        return;
      }
      if(moduleNumber === 8){
        navigate(`/module/${moduleNumber + 1}`);
        return;
      }
      alertModal.setTitle('Module Finished');
      alertModal.setContent(
        'Congratulations! You have finished this series of our educational session. We hope you learned something today. Proceed to the next stage.'
      );
      alertModal.open();

      if(moduleNumber === 1){
        saveProgress(1)
        window.open('https://www.voxels.com/spaces/e4de4917-6a2c-4312-bb52-340c02c328d2/play', '_blank');
        return;
      }
      if(moduleNumber === 3){
        saveProgress(3)
        window.open('https://www.voxels.com/spaces/1af3ad5b-6d3e-458d-b8e6-19ee1d984fb0/play', '_blank');
        return;
      }
      if(moduleNumber === 5){
        saveProgress(5)
        window.open('https://www.voxels.com/spaces/d2adfb7c-8059-4e22-aff4-794b48d6283e/play', '_blank');
        return;
      }
      if(moduleNumber === 7){
        saveProgress(7)
        window.open('https://www.voxels.com/spaces/e8baf729-786c-4a35-98d6-19d0fe7429d2/play', '_blank');
        return;
      }
      if(moduleNumber === 9){
        saveProgress(9)
        navigate('/reward');
        return;
      }

    } catch (error) {
      alertModal.setTitle('Server Error');
      alertModal.setContent('Please try again later');
      alertModal.open();
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const checkScore = async (e) => {
    e.preventDefault();

    if (Qanswer === '') {
      alertModal.setTitle('Invalid Option');
      alertModal.setContent('Please select an answer');
      alertModal.open();
      return;
    }

    const currentQuestion = questions[questionNumber];
    const correctAnswer = currentQuestion.answer;

    if (Qanswer.toLowerCase() != correctAnswer.toLowerCase()) {
      alertModal.setTitle('Incorrect Option');
      alertModal.setContent('Option chosen is incorrect. Try Again');
      alertModal.open();
      return;
    }

    if (Qanswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setPlayer({
        ...player,
        score: player.score + 1,
      });
      // score += 1
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
    <div className='w-full max-w-md p-6'>
      <h2 className={`${styles.heading2} text-center`}>Web3 Quest Journey</h2>
      <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 h-[450px] md:w-[450px] overflow-y-scroll'>
        {
          loading ? (
            <div className='flex flex-col items-center justify-center h-full'>
              <div className='loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 mb-4'></div>
              <h3 className='text-center'>Loading...</h3>
            </div>
          ) : (
            <div className='flex flex-row'>
          <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`}>
            {questionNumber + 1}
          </div>
          <div className='flex-1 flex flex-col ml-3'>
            <h4 className='font-poppins font-semibold text-black text-[20px] leading-[23px] mb-1'>
              {questions[questionNumber]?.question}
            </h4>
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
                <span className='ml-5 mb-3 font-poppins font-normal text-black text-[18px] leading-[30.8px]'>{option}</span>
              </label>
            ))}
          </div>
        </div>
          )
        }
        <div className='flex justify-center items-center mt-5'>
          {loading ? (
            <div class='flex items-center justify-center'>
              <div
                className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
                role='status'
              >
                <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
                  Loading...
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={checkScore}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='button'
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
