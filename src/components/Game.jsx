import React, { useState, useEffect } from 'react'
import { questions_easy, questions_medium, questions_hard } from '../utils'
import styles from '../styles'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const Game = ({difficulty, name}) => {

    const navigate = useNavigate()

    // const [gameDifficulty, setGameDifficulty] = useState('')
    const [questions, setQuestions] = useState(questions_easy)
    const [questionNumber, setQuestionNumber] = useState(0)
    const [Qanswer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)
    // const [player, setPlayer] = useState({name: name, score: 0})

    const questionLength = questions.length

    var score = 0;

    const submitScore = async () => {
        setLoading(true)

        try {
            await addDoc(collection(db, 'leaderboard'), {
                playerName: name,
                score: score,
                date: new Date().toLocaleString()
            })
            alert('Game Over. See Leaderboard now.')
            navigate('/leaderboard')
        } catch (error) {
            
        } finally {
            setLoading(false)
        }
    }

    const checkScore = async (e) => {
        e.preventDefault()


        if(Qanswer === ''){
            alert('Please type an answer!')
            return;
        }

        const currentQuestion = questions[questionNumber]
        const correctAnswer = currentQuestion.answer

        if(Qanswer.toLowerCase() === correctAnswer.toLowerCase()){
            // setPlayer((player) => player.score + 1)
            score += 1
        }

        if(questionNumber === questionLength - 1){
            submitScore()
            return;
        }

        setQuestionNumber((questionNumber) => questionNumber + 1)
        setAnswer('')
    }

    const getGameDifficulty = () => {

        switch (difficulty) {
            case 'medium':
                setQuestions(questions_medium)
                break;
            case 'hard':
                setQuestions(questions_hard)
            default:
                setQuestions(questions_easy)
                break;
        }
    }

    useEffect(() => {
        getGameDifficulty()
    },[difficulty, getGameDifficulty])

  return (
    <div className='w-full max-w-md p-3'>
        <h2 className={`${styles.heading2} text-center`}>
            Gata-Quest
        </h2>
        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <div className='flex flex-row'>
            <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`} >
                {questionNumber + 1}
            </div>
            <div className="flex-1 flex flex-col ml-3">
                <h4 className="font-poppins font-semibold text-black text-[18px] leading-[23px] mb-1">
                    {questions[questionNumber].question}
                </h4>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" value={Qanswer} onChange={(e) => setAnswer(e.target.value)}  />
            </div>
            </div>
            <div className="flex justify-center items-center mt-5">
                {
                    loading ? (
                        <div class="flex items-center justify-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                    Loading...
                                </span>
                            </div>
                        </div>
                    ) : (
                        <button onClick={checkScore} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                            Submit
                        </button>
                    )
                }
            </div>
        </div>
    </div>
  )
}

export default Game