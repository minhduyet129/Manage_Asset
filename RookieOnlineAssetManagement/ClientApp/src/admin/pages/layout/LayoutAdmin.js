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
          <div class='toggle' onClick={showSidebar}>
            <i class='bx bx-menu'></i>
          </div>
          <form class='search'>
            <label htmlFor=''></label>
            <input type='text' placeholder='Search here' />
            <i class='bx bx-search'></i>
          </form>
          <div>
            <Link to='/admin/login'>
              <button className='logout__button'>Logout</button>
            </Link>
          </div>
        </div>

        {/* The rest of the page */}
        {children}
      </main>
    </div>
  );
}

export default LayoutAdmin;
