import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { SidebarData } from './SidebarDataUser';

function LayoutUser({ children }) {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.reload();
  };

  return (
    <div className='container'>
      <nav className={sidebar ? 'nav active' : 'nav'}>
        <ul>
          {SidebarData.map((item, index) => {
            return (
              <li key={index}>
                <Link className='link' to={item.path}>
                  <span className='icon'>
                    <i className={item.icon}></i>
                  </span>
                  <span className='title'>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <main className={sidebar ? 'main active' : 'main'}>
        <div className='topbar'>
          <div className='toggle' onClick={showSidebar}>
            <i className='bx bx-menu'></i>
          </div>
          <div>
            <Link to='/login' className='btn' onClick={handleLogout}>
              Logout
            </Link>
          </div>
        </div>

        {/* The rest of the page */}
        <div className='main__wrapper'>{children}</div>
      </main>
    </div>
  );
}

export default LayoutUser;
