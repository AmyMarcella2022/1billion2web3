import React, { useState } from 'react'
import styles from '../styles'
import Game from './Game'

const Name = () => {

  const [name, setName] = useState('')
  // const [difficulty, setDiffuculty] = useState('easy')
  const [screen, setScreen] = useState(1)

  const continueGame = (e) => {
    e.preventDefault()

    if(name === ''){
      alert('Please input your name!')
      return;
    }
    
    setScreen(2)
  }

  return (
    <>
      {
        screen === 1 ? (
          <div className={`w-full max-w-md p-3`}>
            <h2 className={`${styles.heading2} text-center`}>
              Welcome to 
            </h2>
            <h4 className={`${styles.paragraph} text-center text-dimWhite`}>
              1Billion2Web3Initiative
            </h4>
  <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Please enter your name:
      </label>
      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}  />
    </div>
    {/* <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Select Difficulty
      </label>
      <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={difficulty} onChange={(e) => setDiffuculty(e.target.value)}>
        <option value='easy'>Easy</option>
        <option value='medium'>Medium</option>
        <option value='hard'>Hard</option>
      </select>
    </div> */}
    <div className="flex justify-center items-center">
      <button onClick={continueGame} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
        Continue
      </button>
    </div>
  </form>
</div>
        ) : (
          <Game name={name} />
        )
      }
    </>
  )
}

export default Name

