import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import axios from 'axios'

function Login() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const userLocalStorage = localStorage.getItem('userInfo');
  const userInfoObject = JSON.parse(userLocalStorage);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onLogin = async (data) => {
    setIsLoading(true);
    const response = await axios.post('api/users/login', {
      username: data.username,
      password: data.password,
    });
    const result = await response.data;
    setIsLoading(false);
    localStorage.setItem('userInfo', JSON.stringify(result));
  };

  // Redirect users to different URL according to their roles
  useEffect(() => {
    if (userLocalStorage) {
      if (userInfoObject.role === 'Admin') {
        history.push('/admin');
        window.location.reload();
      } else if (userInfoObject.role === 'User') {
        history.push('/');
        window.location.reload();
      } else {
        history.push('/login');
        window.location.reload();
      }
    }
  }, [history, userInfoObject, userLocalStorage]);

  return (
    <>
      <div className='wrapper-form'>
        <form className='form__login' onSubmit={handleSubmit(onLogin)}>
          <h2 className='form__title'>Login</h2>

          <div className='form__field'>
            <label htmlFor='username'>Username</label>
            <input className='input' {...register('username')} />
          </div>
          {errors.username && (
            <span className='form__validation'>This field is required</span>
          )}

          <div className='form__field'>
            <label htmlFor='password'>Password</label>
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
      </div>

      {isLoading && (
        <span
          className='spinner'
          style={{ position: 'absolute', top: '500px' }}
        >
          <i className='fas fa-spinner fa-spin'></i>
        </span>
      )}
    </>
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
