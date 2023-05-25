import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Rewards from './components/Rewards';
import Home from './components/Home';
import Game from './components/Game';
import AlertModal from './components/common/AlertModal';

function App() {
  return (
    <BrowserRouter>
      <AlertModal />
      <div className='bg-primary'>
        <div className='flex justify-center items-center h-screen'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/module/:id' element={<Game />} />
            <Route path='/reward' element={<Rewards />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
