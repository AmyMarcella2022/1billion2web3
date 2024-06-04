import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AppProvider } from './context/AppContext';
import ToastNotification from './components/utils/ToastNotification';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminHome } from './components/admin/AdminHome';
import { UsersTable } from './components/admin/UsersTable';
import Login from './components/auth/Login';

let toastNotification = <ToastNotification />;

function App() {
  return (
    <AppProvider>
      <div className='w-full h-full overflow-hidden'>
        <BrowserRouter>
          {toastNotification}
          <div className=''>
            <Routes>
              <Route
                path='/'
                element={
                  <Login />
                }
              />
              <Route
                path='/admin-home'
                element={
                  <AdminLayout>
                    <AdminHome />
                  </AdminLayout>
                }
              />
              <Route
                path='/admin-users'
                element={
                  <AdminLayout>
                    <UsersTable />
                  </AdminLayout>
                }
              />
              {/* <Route path='/login' element={<Login />} /> */}
              {/* <Route path='/register' element={<Register />} /> */}
              {/* <Route
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
              /> */}
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </AppProvider>
  );
}

export default App;
