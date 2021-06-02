import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarDataUser';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import axios from 'axios';
import '../../../admin/pages/layout/Navbar.css';

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

function LayoutUser({ children }) {
  const userLocalStorage = localStorage.getItem('userInfo');
  const userInfoObject = JSON.parse(userLocalStorage);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isPasswordFirstTimeModalOpen, setIsPasswordFirstTimeModalOpen] =
    useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [dropDown, setDropdown] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const handleChangePasswordFirstTime = async (data) => {
    // const response = await axios.post('/api/users/ChangePasswordFirstLogin', {
    //   userId: userInfoObject.userId,
    //   newPassword: data.paassword,
    // });
    // setIsPasswordFirstTimeModalOpen(false);

    // setIsLoading(true);
    // setIsError(false);

    // try {
    //   const response = await axios.post('/api/users/ChangePasswordFirstLogin', {
    //     userId: userInfoObject.userId,
    //     newPassword: data.paassword,
    //   });
    //   const result = await response.data;
    //   setIsLoading(false);
    //   console.log(result);
    // } catch (error) {
    //   setIsLoading(false);
    //   setIsError(true);
    // }
  };

  // const handleCreateRequestForReturning = () => {
  //   setIsPasswordFirstTimeModalOpen(false);
  // };

  // Open Change password for users when they first login
  useEffect(() => {
    if (userLocalStorage) {
      if (userInfoObject.countLogin <= 1) {
        setIsPasswordFirstTimeModalOpen(true);
      }
    }
  }, [userInfoObject, userLocalStorage]);

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
              <button
                className='dropbtn'
                // onClick={openChangePasswordModal}
              >
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

          {/* Change password for first time logged in users */}
          {/* <Modal isOpen={isPasswordFirstTimeModalOpen} style={customStyles}>
            <div className='modal'>
              <div className='modal-body'>
                <div>Change password for first time login</div>
                <p>
                  This is the first time you login. You need to change your
                  password to continue.
                </p>
                <form onSubmit={handleSubmit(handleChangePasswordFirstTime)}>
                  <div className='form__field'>
                    <label>New Password</label>
                    <input
                      {...register('password', { required: true })}
                      className='input'
                    ></input>
                  </div>
                </form>
              </div>
              <div className='modal-footer'>
                <div
                  className='btn save'
                  onClick={handleChangePasswordFirstTime}
                >
                  Save
                </div>
                <div
                  className='confirm-btn cancel'
                  onClick={handleShowPassword}
                >
                  No
                </div>
              </div>
            </div>
          </Modal> */}

          {/* Change password */}
          <Modal isOpen={isPasswordModalOpen} style={customStyles}>
            <div className='modal'>
              <div className='modal-body'>
                <div>Change password for first time login</div>
                <p>
                  This is the first time you login. You need to change your
                  password to continue.
                </p>
                <form>
                  <div className='form__field'>
                    <label>New Password</label>
                    <input className='input'></input>
                  </div>
                </form>
              </div>
              <div className='modal-footer'>
                <div
                  className='btn save'
                  onClick={handleChangePasswordFirstTime}
                >
                  Save
                </div>
                {/* <div
                  className='confirm-btn cancel'
                  onClick={handleShowPassword}
                >
                  No
                </div> */}
              </div>
            </div>
          </Modal>
        </div>
      </main>
    </div>
  );
}

export default LayoutUser;
