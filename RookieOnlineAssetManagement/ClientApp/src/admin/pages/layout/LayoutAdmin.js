import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarDataAdmin';
import './Navbar.css';

function LayoutAdmin({ children }) {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <div className='container'>
      {/* Start Layout */}
      <nav className={sidebar ? 'nav active' : 'nav'}>
        {/* Render each item of the side bar */}
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
      {/* End Layout */}

      <main className={sidebar ? 'main active' : 'main'}>
        <div className='topbar'>
          <div className='toggle' onClick={showSidebar}>
            <i className='bx bx-menu'></i>
          </div>
          <div>
            <Link to='/admin/login'>
              <button className='btn'>Logout</button>
            </Link>
          </div>
        </div>

        {/* The rest of the page */}
        <div className='main__wrapper'>{children}</div>
      </main>
    </div>
  );
}

export default LayoutAdmin;
