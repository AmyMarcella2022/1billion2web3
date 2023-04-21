import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Rewards from './components/Rewards';
import Name from './components/Name';
import Game from './components/Game';

function App() {
  return (
    <BrowserRouter>
      <div className='bg-primary'>
        <div className='flex justify-center items-center'>
          <Routes>
            <Route path='/' element={<Name />} />
            <Route path='/module/:id' element={<Game />} />
            <Route path='/rewards/module/:id' element={<Rewards />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
