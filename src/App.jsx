import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Leaderboard from './components/Leaderboard'
import Name from './components/Name'


function App() {
  
  return (
    <BrowserRouter>
      <div className='bg-primary'>
        <div className='flex justify-center items-center h-screen'>
          <Routes>
            <Route path='/' element={<Name />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
