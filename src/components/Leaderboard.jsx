import React, { useState, useEffect } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import styles from '../styles'
import { useNavigate } from 'react-router-dom'

const Leaderboard = ({}) => {
  const navigate = useNavigate()

  const [leaderboardArray, setLeaderboardArray] = useState([{playerName: '', score: 0, date: ''}])

  const playAgain = () => {
    navigate('/')
  }

    const sortArray = () => {
      leaderboardArray.sort((a, b) => b.score - a.score)
    }

    const getLeaderboard = async () => {
      const leaderBoardQuery = query(collection(db, "leaderboard"), orderBy('score'))
      const querySnapshot = await getDocs(leaderBoardQuery);
      var tempLeaderboard = []
      querySnapshot.forEach((doc) => {
        tempLeaderboard.push(doc.data())
      })
      setLeaderboardArray(tempLeaderboard);
      sortArray()
    }

  

  let tableBody = (
    <tbody>
      {leaderboardArray.map((player, index) => (
        <tr key={index} className='text-white'>
          <td className='border border-slate-300'>{player.playerName}</td>
          <td className='border border-slate-300'>{player.score}</td>
          <td className='border border-slate-300'>{player.date.split(',')[0]}</td>
        </tr>
      ))}
    </tbody>
  )

  useEffect(() => {
    getLeaderboard()
  },[getLeaderboard])

  return (
    <div>
      <h2 className={`${styles.heading2} text-center`}>
        Leaderboard
      </h2>
      <div className='flex justify-center items-center mt-10'>
      <table className="border-collapse border border-slate-400 table-auto">
        <thead>
          <tr className='text-white'>
            <th className='border border-slate-300'>Name</th>
            <th className='border border-slate-300'>Score</th>
            <th className='border border-slate-300'>Date</th>
          </tr>
        </thead>
        {tableBody}
      </table>
      </div>
      <div className='flex flex-1 flex-row justify-center items-center content-between mt-10 p-3'>
        <div>
          <button className='bg-white hover:bg-slate-300 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
            <a href='https://gataprotocol.org/'>Exit</a>
          </button>
        </div>
        <div>
          <button onClick={playAgain} className='bg-white hover:bg-slate-300 text-black font-bold py-2 px-4 ml-3 rounded focus:outline-none focus:shadow-outline'>
            Play Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard