import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { api } from '../api';

function Login() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const history = useHistory();
  const userInfoObject = JSON.parse(localStorage.getItem('userInfo'));
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onLogin = async (data) => {
    const response = await api.post('/users/login', {
      username: data.username,
      password: data.password,
    });
    const result = await response.data;
    localStorage.setItem('userInfo', JSON.stringify(result));

    if (userInfoObject.role === 'Admin') {
      history.push('/admin');
    }
    if (userInfoObject.role === 'User') {
      history.push('/');
    }
    // history.push(`/${userInfoObject.role.toLowerCase()}`);
  };

  // This is just for demo for log out
  const onRemoveLocalStorage = () => {
    localStorage.removeItem('userInfo');
    history.push('/login');
  };

  // Redirect users to different URL according to their roles
  useEffect(() => {
    if (localStorage.getItem('userInfo')) {
      if (userInfoObject.role === 'Admin') {
        setIsAdminLoggedIn(true);
        history.push('/admin');
      } else if (userInfoObject.role === 'User') {
        setIsUserLoggedIn(true);
        history.push('/');
      } else {
        history.push('/login');
      }
    }
  }, [history, userInfoObject]);

  return (
    <div className='wrapper-form'>
      <form className='form__login' onSubmit={handleSubmit(onLogin)}>
        <h2 className='form__title'>Login</h2>

        <div className='form__field'>
          <label className='form__label' htmlFor='username'>
            Username
          </label>
          <input className='input' {...register('username')} />
        </div>
        {errors.username && (
          <span className='form__validation'>This field is required</span>
        )}

        <div className='form__field'>
          <label className='form__label' htmlFor='password'>
            Password
          </label>
          <input
            className='input'
            {...register('password', { required: true })}
            type='password'
          />
        </div>
        {errors.password && (
          <span className='form__validation'>This field is required</span>
        )}

        <input className='btn' type='submit' value='Login' />
      </form>

      <button onClick={onRemoveLocalStorage}>Remove Local Storage</button>
    </div>
  );
}

export default Login;

// const onLogin = (data) => {
//   api
//     .post('/users/login', {
//       username: data.username,
//       password: data.password,
//     })
//     .then((response) => {
//       if (!response.data) {
//         setIsLoggedIn(false);
//       }
//       localStorage.setItem('userInfo', JSON.stringify(response.data));

//       if (response.ok) {
//       }
//       setIsLoggedIn(true);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
