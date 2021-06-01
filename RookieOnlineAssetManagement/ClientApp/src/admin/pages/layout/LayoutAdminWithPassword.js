import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarDataAdmin';
import { useForm } from 'react-hook-form';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [
    isSuccessChangePasswordModalOpen,
    setIsSuccessChangePasswordModalOpen,
  ] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPasswordFirstTimeLoginModalOpen, setIsPasswordFirstTimeModalOpen] =
    useState(false);
  const [
    isPasswordChangeSuccessModalOpen,
    setIsPasswordChangeSuccessModalOpen,
  ] = useState(false);
  const [isOldPasswordShowed, setIsOldPasswordShowed] = useState(false);
  const [isNewPasswordShowed, setNewPasswordShowed] = useState(false);
  const userLocalStorage = localStorage.getItem('userInfo');
  const userInfoObject = JSON.parse(userLocalStorage);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const showSidebar = () => setSidebar(!sidebar);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.reload();
  };

  const openChangePasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closeModal = () => {
    setIsPasswordChangeSuccessModalOpen(false);
  };

  const showOldPassword = () => {
    setIsOldPasswordShowed(!isOldPasswordShowed);
  };

  const showNewPassword = () => {
    setNewPasswordShowed(!isNewPasswordShowed);
  };

  const handleChangePasswordFirstTimeLogin = async (data) => {
    // const response = await axios.post('/api/users/ChangePasswordFirstLogin', {
    //   userId: userInfoObject.userId,
    //   newPassword: data.paassword,
    // });
    // setIsPasswordFirstTimeModalOpen(false);

    setIsLoading(true);
    setIsError(false);

    try {
      const response = await axios.post('/api/users/ChangePasswordFirstLogin', {
        userId: userInfoObject.userId,
        newPassword: data.paassword,
      });
      const result = await response.data;
      setIsLoading(false);
      console.log(result);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  const handleChangePassword = async (data) => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await axios.post(
        '/api/users/ChangePassword',
        {
          userId: userInfoObject.userId,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
      setIsLoading(false);
      setIsPasswordChangeSuccessModalOpen(true);
      console.log(response);
      console.log(data);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
    console.log(data);
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
          <div style={{ marginLeft: '70%' }}>
            <button className='btn' onClick={openChangePasswordModal}>
              Change password
            </button>
          </div>
          <div>
            <Link to='/login' className='btn' onClick={handleLogout}>
              Logout
            </Link>
          </div>
        </div>

        {/* The rest of the page */}
        <div className='main__wrapper'>
          {children}

          {/* Change password */}
          <Modal isOpen={isPasswordModalOpen} style={customStyles}>
            <div className='modal'>
              <div className='modal-body'>
                <h3>Change password</h3>
                <p></p>
                <form onSubmit={handleSubmit(handleChangePassword)}>
                  <div className='form__field' style={{ padding: '10px 0' }}>
                    <label>Old Password</label>
                    <input
                      {...register('oldPassword', { required: true })}
                      type={isOldPasswordShowed ? 'text' : 'password'}
                      className='input'
                    ></input>
                    <div style={{ margin: '0 10px' }}>
                      <i className='bx bx-show' onClick={showOldPassword}></i>
                    </div>
                  </div>
                  {errors.oldPassword && (
                    <span className='form__validation'>
                      This field is required
                    </span>
                  )}
                  <div className='form__field'>
                    <label>New Password</label>
                    <input
                      {...register('newPassword', { required: true })}
                      type={isNewPasswordShowed ? 'text' : 'password'}
                      className='input'
                    ></input>
                    <div style={{ margin: '0 10px' }}>
                      <i className='bx bx-show' onClick={showNewPassword}></i>
                    </div>
                  </div>
                  {errors.newPassword && (
                    <span className='form__validation'>
                      This field is required
                    </span>
                  )}
                </form>
              </div>
              <div></div>
              <div className='modal-footer'>
                <div className='btn save' onClick={handleChangePassword}>
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

          {/* Change password for first time logged in users */}
          <Modal
            isOpen={isPasswordFirstTimeLoginModalOpen}
            style={customStyles}
          >
            <div className='modal'>
              <div className='modal-body'>
                <div>Change password for first time login</div>
                <p>
                  This is the first time you login. You need to change your
                  password to continue.
                </p>
                <form
                  onSubmit={handleSubmit(handleChangePasswordFirstTimeLogin)}
                >
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
                  onClick={handleChangePasswordFirstTimeLogin}
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

          {/* If changing password is success, pop up a message to user */}
          <Modal isOpen={isPasswordChangeSuccessModalOpen} style={customStyles}>
            <div className='modal'>
              <div className='confirm-close-btn' onClick={closeModal}>
                <i className='fas fa-times'></i>
              </div>
              <div className='modal-body'>
                <div>Change password</div>
                <p>Your password has been changed successfully.</p>
              </div>
              <div className='modal-footer'>
                <div className='btn' onClick={closeModal}>
                  Close
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

export default LayoutAdmin;
