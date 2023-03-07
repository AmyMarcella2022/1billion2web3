import React, { useState } from 'react'
import { gameQuestions } from '../utils'
import styles from '../styles'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const Game = ({name}) => {

    const navigate = useNavigate()

    // const [gameDifficulty, setGameDifficulty] = useState('')
    const [questions] = useState(gameQuestions)
    const [questionNumber, setQuestionNumber] = useState(0)
    const [Qanswer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)
    const [player, setPlayer] = useState({name: name, score: 0})

    const questionLength = questions.length

    // var score = 0;

    const submitScore = async () => {
        setLoading(true)

        try {
            await addDoc(collection(db, 'leaderboard'), {
                playerName: player.name,
                score: player.score,
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
            alert('Please select an answer!')
            return;
        }

        const currentQuestion = questions[questionNumber]
        const correctAnswer = currentQuestion.answer

        if(Qanswer.toLowerCase() === correctAnswer.toLowerCase()){
            setPlayer({
                ...player,
                score: player.score + 1
            })
            // score += 1
        }

        if(questionNumber === questionLength - 1){
            submitScore()
            return;
        }

        setQuestionNumber((questionNumber) => questionNumber + 1)
        setAnswer('')
    }


  return (
    <div className='w-full max-w-md p-3'>
        <h2 className={`${styles.heading2} text-center`}>
            Web3 Quest Journey
        </h2>
        <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <div className='flex flex-row'>
            <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`} >
                {questionNumber + 1}
            </div>
            <div className="flex-1 flex flex-col ml-3">
                <h4 className="font-poppins font-semibold text-black text-[20px] leading-[23px] mb-1">
                    {questions[questionNumber].question}
                </h4>
                {
                    questions[questionNumber].options.map((option, index) => (
                        <label key={index} className='inline-flex items-center'>
                            <input type='radio' className='form-radio h-4 w-4' name='qOption' checked={Qanswer === option} value={option} onClick={(e) => setAnswer(e.target.value)} />
                            <span className={`${styles.paragraph} ml-5 mb-3`}>{option}</span>
                        </label>
                    ))
                }
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