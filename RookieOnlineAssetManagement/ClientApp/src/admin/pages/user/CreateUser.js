import React from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm } from 'react-hook-form';
import { useCreateUser } from './UserHooks';

const CreateUser = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const userInfo = useCreateUser();

  const onSubmit = (data) => {
    alert('Add successfully!');
    console.log(data);
  };

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <h2 className='form__title'>Create User</h2>
          <div className='form__div'>
            <input className='form__input' {...register('firstname')} />
            <label className='form__label' htmlFor='firstname'>
              First Name
            </label>
          </div>
          <div className='form__div'>
            <input
              className='form__input'
              {...register('username', { required: true })}
            />
            <label className='form__label' htmlFor='username'>
              Last Name
            </label>
          </div>
          <div className='form__div'>
            <input className='form__input' type='date' {...register('date')} />
            <label className='form__label' htmlFor='date'>
              Date of Birth
            </label>
          </div>
          <div className='form__div'>
            <select className='form__input' {...register('gender')}>
              <option value={0}>female</option>
              <option value={1}>male</option>
            </select>
            <label className='form__label' htmlFor='gender'>
              Gender
            </label>
          </div>
          <div className='form__div'>
            <input className='form__input' {...register('location')} />
            <label className='form__label' htmlFor='username'>
              Location
            </label>
          </div>
          <div className='form__div'>
            <input
              className='form__input'
              {...register('type', { required: true })}
            />
            <label className='form__label' htmlFor='username'>
              Type
            </label>
          </div>
          {errors.exampleRequired && <span>This field is required</span>}
          <div>
            <input className='btn' type='submit' value='Submit' />
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
};

export default CreateUser;
