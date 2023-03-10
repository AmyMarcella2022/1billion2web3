import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Rewards from './components/Rewards'
import Name from './components/Name'


function App() {
  
  return (
    <BrowserRouter>
      <div className='bg-primary'>
        <div className='flex justify-center items-center h-screen'>
          <Routes>
            <Route path='/' element={<Name />} />
            <Route path='/rewards' element={<Rewards />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
