import React from 'react';
import { useStateContext } from "./contexts/ContextProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { Navbar, Sidebar, ThemeSettings, Footer, Logout } from "./components";
import { CreateNewOrder, CreateOrder, Home, Login } from "./pages";
import './App.css';
import Orders from './pages/Order/Orders';
import OrdersPage from './pages/Order/OrdersPage';

function App() {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext()
  return (
    <>
      {localStorage.getItem('user_info') === null ? <Login /> :
        <>
          {console.log('load home')}
          <div className={currentMode === 'Dark' ? 'dark' : ''}>
            <Router>
              <div className='flex relative dark:bg-main-dark-bg'>
                <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
                  <div>
                    <button
                      type='button'
                      className="
                                   text-3xl p-3
                                   hover:drop-shadow-xl
                                   hover:bg-light-gray
                                   text-white"
                      style={{ backgroundColor: currentColor, borderRadius: '50%' }}
                      onClick={() => setThemeSettings(true)}
                    >
                      <FiSettings />
                    </button>
                 </div>
                </div>
                {activeMenu ? (
                  <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
                    <Sidebar />
                  </div>
                ) : (
                  <div className="w-0 dark:bg-secondary-dark-bg">
                    <Sidebar />
                  </div>
                )}
                <div className={
                  `dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}`
                }>
                  <div className={'fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'}>
                    <Navbar />
                  </div>
                  <div>
                    {themeSettings && <ThemeSettings />}
                    <Routes>
                      <Route path='/' element={<Home />} />
                      <Route path='/home' element={<Home />} />
                      <Route path='/orders' element={<OrdersPage />} />
                      <Route path='/orders/create' element={<CreateOrder />} />
                      <Route path='/logout' element={<Logout />} />
                    </Routes>
                  </div>
                  <Footer />
                </div>
              </div>
            </Router>
          </div>

        </>}
    </>
  );
}

export default App;
