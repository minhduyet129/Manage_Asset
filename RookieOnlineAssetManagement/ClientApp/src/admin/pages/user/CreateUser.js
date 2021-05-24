import React, { useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm, Controller } from 'react-hook-form';
import { useCreateUser } from './UserHooks';
import ReactDatePicker from 'react-datepicker';
import { Link, useHistory } from 'react-router-dom';

const CreateUser = () => {
  const [startDate, setStartDate] = useState(null);
  const [joinedDate, setJoinedDate] = useState(null);
  const history = useHistory();
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  function handlerUser(users) {
    users.gender = users.gender === 0 ? 0 : 1;
    return useCreateUser
      .create(users)
      .then((response) => {
        if (response.status === 200) {
          alert('Add user sucessfully');
        }
        console.log(users);
      })
      .catch((error) => {
        alert('Something went wrong!');
      });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = async (data) => {
    await handlerUser(data);
    history.push('/admin/users');
    console.log(data);
    console.log(startDate);
  };

  // console.log(startDate.getDay())

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <h2 className='form__title'>Create User</h2>
          <div className='form__field'>
            <label className='form__label' htmlFor='firstname'>
              First Name
            </label>
            <input
              id='firstname'
              className='input'
              {...register('firstName')}
            />
            {errors.firstName && <span>This field is required</span>}
          </div>
          <div className='form__field'>
            <label className='form__label' htmlFor='lastName'>
              Last Name
            </label>
            <input
              id='lastName'
              className='input'
              {...register('lastName', { required: true })}
            />
          </div>
          <div className='form__field'>
            <label className='date-picker__label' htmlFor='doB'>
              Date of Birth
            </label>
            <Controller
              control={control}
              name='doB'
              required={true}
              render={({ field: { onChange } }) => (
                <ReactDatePicker
                  id='doB'
                  selected={startDate}
                  onChange={(e) => {
                    onChange(e);
                    setStartDate(e);
                  }}
                  placeholderText='MM/DD/YY'
                  isClearable
                  withPortal
                  showYearDropdown
                  showMonthDropdown
                  dateFormatCalendar='MMMM'
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  dropdownMode='select'
                  className='input'
                />
              )}
              rules={{
                required: true,
              }}
            />
          </div>

          <div className='form__field'>
            <label className='date-picker__label' htmlFor='joinedDate'>
              Joined Date
            </label>
            <Controller
              control={control}
              name='joinedDate'
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <ReactDatePicker
                  id='joinedDate'
                  selected={joinedDate}
                  onChange={(e) => {
                    onChange(e);
                    setJoinedDate(e);
                  }}
                  filterDate={isWeekday}
                  placeholderText='MM/DD/YY'
                  isClearable
                  withPortal
                  showYearDropdown
                  showMonthDropdown
                  dateFormatCalendar='MMMM'
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  dropdownMode='select'
                  className='input'
                />
              )}
              rules={{
                required: true,
              }}
            />
          </div>

          <div className='form__field'>
            <label className='form__label' htmlFor='gender'>
              Gender
            </label>
            <div className='custom__select'>
              <select {...register('gender')} id='gender'>
                <option value={0}>Female</option>
                <option value={1}>Male</option>
              </select>
            </div>
          </div>
          {errors.gender && <span>This field is required</span>}
          <div className='form__field'>
            <label className='form__label' htmlFor='roles'>
              Type
            </label>
            <div className='custom__select'>
              <select {...register('roles')} id='roles'>
                <option value='User'>User</option>
                <option value='Admin'>Admin</option>
              </select>
            </div>
          </div>
          <input
            id='location'
            hidden
            className='form__input'
            {...register('location')}
          />
          {errors.type && <span>This field is required</span>}
          <div className='form__field'>
            <input type='submit' className='btn' value='Submit' />
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
