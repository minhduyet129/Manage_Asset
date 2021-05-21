import React, { useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm, Controller } from 'react-hook-form';
import { useCreateUser } from './UserHooks';
import ReactDatePicker from 'react-datepicker';
import { useHistory } from 'react-router';
const CreateUser = () => {
  const [startDate, setStartDate] = useState(null);
  const [joinedDate, setJoinedDate] = useState(null);
  const history = useHistory()
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
        console.log(users)
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
    history.push('/admin/users')
     console.log(data);
    console.log(startDate);
  };

  // console.log(startDate.getDay())

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <h2 className='form__title'>Create User</h2>
          <div className='form__div'>
            <input
              id='firstname'
              className='form__input'
              {...register('firstName')}
            />
            <label className='form__label' htmlFor='firstname'>
              First Name
            </label>
            {errors.firstName && <span>This field is required</span>}
          </div>
          <div className='form__div'>
            <input
              id='lastName'
              className='form__input'
              {...register('lastName', { required: true })}
            />
            <label className='form__label' htmlFor='lastName'>
              Last Name
            </label>
          </div>
          <div className='form__div'>
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
                />
              )}
              rules={{
                required: true,
              }}
            />
            <label className='date-picker__label' htmlFor='doB'>
              Date of Birth
            </label>
          </div>

          <div className='form__div'>
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
                />
              )}
              rules={{
                required: true,
              }}
            />
            <label className='date-picker__label' htmlFor='joinedDate'>
              Joined Date
            </label>
          </div>


          <div className='form__div'>
            <select className='form__input' {...register('gender')} id='gender'>
              <option value={0}>Female</option>
              <option value={1}>Male</option>
            </select>
            <label className='form__label' htmlFor='gender'>
              Gender
            </label>
          </div>
          {errors.gender && <span>This field is required</span>}
          <div className='form__div'>
          <select className='form__input' {...register('roles')} id='roles'>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <label className='form__label' htmlFor='roles'>
              Type
            </label>
          </div>
          <input
              id='location'
              hidden
              className='form__input'
              {...register('location')}
            />
          {errors.type && <span>This field is required</span>}
          <div>
            <input className='btn' type='submit' value='Submit' />
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
};

export default CreateUser;
