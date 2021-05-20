import React from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm } from 'react-hook-form';
import { useCreateUser } from './UserHooks';
import { Link, useHistory } from 'react-router-dom';

const CreateUser = () => {
  const history = useHistory();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const userInfo = useCreateUser();

  const onSubmit = (data) => {
    alert('Add successfully!');
    // redirect to users list view after submit
    history.push('/admin/users');
    console.log(data);
  };

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <h2 className='form__title'>Create User</h2>
          <div className='form__field'>
            <label className='form__label' htmlFor='firstname'>
              First Name
            </label>
            <input className='form__input' {...register('firstname')} />
          </div>
          <div className='form__field'>
            <label className='form__label' htmlFor='username'>
              Last Name
            </label>
            <input
              className='form__input'
              {...register('username', { required: true })}
            />
          </div>
          <div className='form__field'>
            <label className='form__label' htmlFor='date'>
              Date of Birth
            </label>
            <input className='form__input' type='date' {...register('date')} />
          </div>
          <div className='form__field'>
            <label className='form__label' htmlFor='date'>
              Joined Date
            </label>
            <input className='form__input' type='date' {...register('date')} />
          </div>
          <div className='form__field'>
            <label className='form__label' htmlFor='gender'>
              Gender
            </label>
            <div className='custom__select'>
              <select className='form__input' {...register('gender')}>
                <option value={0}>female</option>
                <option value={1}>male</option>
              </select>
            </div>
          </div>
          <div className='form__field'>
            <label className='form__label' htmlFor='username'>
              Location
            </label>
            <input className='form__input' {...register('location')} />
          </div>
          <div className='form__field'>
            <label className='form__label' htmlFor='username'>
              Type
            </label>
            <input
              className='form__input'
              {...register('type', { required: true })}
            />
          </div>
          {errors.exampleRequired && <span>This field is required</span>}
          <div className='form__field'>
            <input className='btn' type='submit' value='Submit' />
            <Link to='/admin/users/'>
              <button className='btn__cancel'>Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
};

export default CreateUser;
