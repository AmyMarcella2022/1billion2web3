import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Rewards from './components/Rewards';
import Home from './components/Home';
import Game from './components/Game';
// import AlertModal from './components/common/AlertModal';
// import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import { AppProvider } from './context/AppContext';
import ToastNotification from './components/utils/ToastNotification';
import Layout from './components/dashboard/Layout';
import DashboardHome from './components/dashboard/DashboardHome';
import { SuccessPage } from './components/common/SuccessPage';
import DisclaimerModal from './components/common/DisclaimerModal';
import ChatAssistant from './components/assistant/ChatAssistant';
import AdminPage from './components/admin/AdminPage';
import ThemeToggle from './components/common/ThemeToggle';

import 'react-toastify/dist/ReactToastify.css';

let toastNotification = <ToastNotification />;

// Dashboard / quiz / success screens have the toggle inside their own header (Layout)
const LAYOUT_PATHS = ['/dashboard', '/success', '/admin'];
const FloatingThemeToggle = () => {
  const { pathname } = useLocation();
  if (LAYOUT_PATHS.includes(pathname) || pathname.startsWith('/module/')) return null;
  return <ThemeToggle variant='floating' />;
};

function App() {
  return (
    <AppProvider>
      <ToastContainer />
      <DisclaimerModal />
      <div className='w-full h-full overflow-x-hidden'>
        <BrowserRouter>
          {toastNotification}
          <div className=''>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/reward' element={<Rewards />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/admin' element={<AdminPage />} />
              <Route
                path='/module/:id'
                element={
                  <Layout>
                    <Game />
                  </Layout>
                }
              />
              <Route
                path='/dashboard'
                element={
                  <Layout>
                    <DashboardHome />
                  </Layout>
                }
              />
              <Route
                path='/success'
                element={
                  <Layout>
                    <SuccessPage />
                  </Layout>
                }
              />
            </Routes>
          </div>
          {/* Only renders on /dashboard and /success — never on quiz (/module/:id) screens */}
          <ChatAssistant />
          <FloatingThemeToggle />
        </BrowserRouter>
      </div>
    </AppProvider>
  );
}

export default App;
