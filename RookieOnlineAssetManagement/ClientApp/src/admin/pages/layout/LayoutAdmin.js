import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarDataAdmin';
import ChangePassword from './password-modals/ChangePassword';
import ChangePasswordFirstLogin from './password-modals/ChangePasswordFirstLogin';
import ChangePasswordSuccess from './password-modals/ChangePasswordSuccess';
import Modal from 'react-modal';
import axios from 'axios';
import './Navbar.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function LayoutAdmin({ children }) {
  const [sidebar, setSidebar] = useState(false);
  const [dropDown, setDropdown] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const showDropdown = () => setDropdown(!dropDown);
  const autoHideDropdown = () =>
    setTimeout(() => {
      setDropdown(!dropDown);
    }, 4000);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.reload();
  };

  const userLocalStorage = localStorage.getItem('userInfo');
  const userInfoObject = JSON.parse(userLocalStorage);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [
    isPasswordChangeSuccessModalOpen,
    setIsPasswordChangeSuccessModalOpen,
  ] = useState(false);
  const [isPasswordFirstTimeLoginModalOpen, setIsPasswordFirstTimeModalOpen] =
    useState(false);

  const openChangePasswordModal = () => setIsPasswordModalOpen(true);
  const closeChangePasswordModal = () => setIsPasswordModalOpen(false);
  const closePasswordChangeSuccessModal = () =>
    setIsPasswordChangeSuccessModalOpen(false);

  const handleChangePassword = async (data) => {
    setIsLoading(true);
    setIsError(false);

    const values = {
      userId: userInfoObject.userId,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    console.log(values);

    try {
      const response = await axios.post('/api/users/ChangePassword', values);
      console.log(response);
      setIsLoading(false);
      setIsPasswordModalOpen(false);
      setIsPasswordChangeSuccessModalOpen(true);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    }
  };

  const handleChangePasswordFirstTimeLogin = async (data) => {
    setIsLoading(true);
    setIsError(false);

    const values = {
      userId: userInfoObject.userId,
      newPassword: data.newPassword,
    };
    console.log(values);

    try {
      const response = await axios.post(
        '/api/users/ChangePasswordFirstLogin',
        values
      );
      setIsLoading(false);
      console.log(response);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }

    setIsPasswordFirstTimeModalOpen(false);
  };

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

          <div className='dropdown'>
            <span className='dropdown-username'>{userInfoObject.userName}</span>
            <span style={{ paddingRight: '10px' }}>
              <i
                className='bx bxs-chevron-down'
                onClick={showDropdown}
                onMouseLeave={autoHideDropdown}
                style={{ fontSize: '23px' }}
              ></i>
            </span>
            <div
              className={
                dropDown ? 'dropdown-content show' : 'dropdown-content'
              }
            >
              <button className='dropbtn' onClick={openChangePasswordModal}>
                <i className='bx bxs-lock-alt icon-dropdown'></i>
                Change password
              </button>
              <Link to='/login' className='dropbtn' onClick={handleLogout}>
                <i className='bx bx-log-out-circle icon-dropdown'></i>
                Logout
              </Link>
            </div>
          </div>
        </div>

        {/* The rest of the page */}
        <div className='main__wrapper'>
          {children}

          {/* --- Modals --- */}
          {/* Change password */}
          <Modal isOpen={isPasswordModalOpen} style={customStyles}>
            <ChangePassword
              handleChangePassword={handleChangePassword}
              closeChangePasswordModal={closeChangePasswordModal}
              isLoading={isLoading}
            />
          </Modal>

          {/* Change password for users when they login for the first time */}
          <Modal
            isOpen={isPasswordFirstTimeLoginModalOpen}
            style={customStyles}
          >
            <ChangePasswordFirstLogin
              handleChangePasswordFirstTimeLogin={
                handleChangePasswordFirstTimeLogin
              }
              isLoading={isLoading}
            />
          </Modal>

          {/* If changing password is success, pop up a message to user */}
          <Modal isOpen={isPasswordChangeSuccessModalOpen} style={customStyles}>
            <ChangePasswordSuccess
              closePasswordChangeSuccessModal={closePasswordChangeSuccessModal}
            />
          </Modal>
        </div>
      </main>
    </div>
  );
}

export default LayoutAdmin;
