import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <div className='wrapper-form'>
      <form className='form__login' onSubmit={handleSubmit(onSubmit)}>
        <h2 className='form__title'>Login</h2>
        <div className='form__field'>
          <label className='form__label' htmlFor='username'>
            Username
          </label>
          <input className='form__input' {...register('username')} />
        </div>
        {errors.username && (
          <span className='form__validation'>This field is required</span>
        )}
        <div className='form__field'>
          <label className='form__label' htmlFor='password'>
            Password
          </label>
          <input
            className='form__input'
            {...register('password', { required: true })}
            type='password'
          />
        </div>
        {errors.password && (
          <span className='form__validation'>This field is required</span>
        )}
        <Link to='/admin'>
          <input className='btn' type='submit' value='Login' />
        </Link>
      </form>
    </div>
  );
}

export default Login;
