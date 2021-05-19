import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm, Controller } from 'react-hook-form';
import { useCreateUser } from './UserHooks';
import ReactDatePicker from 'react-datepicker';
import axios from 'axios';
export const EditUser = () => {
  const [startDate, setStartDate] = useState(null);
  const [joinedDate, setJoinedDate] = useState(null);
  const [users, setUsers] = useState([]);
  const {id} = useParams

  const history = useHistory();

  // const loadUsers = async () => {

  //   const result = axios.get(`http://hungbqit-001-site5.itempurl.com/api/Users/${id}`)
  //   reset({ id: result.data.id,
  //     staffCode: result.data.staffCode,
  //     firstName: result.data.firstName,
  //     lastName: result.data.lastName,
  //     doB: result.data.doB,
  //     joinedDate: result.data.joinedDate,
  //     gender: result.data.gender,
  //     userName: result.data.userName,
  //     roleType: result.data.roleType,
  //   });
  //   setUsers(result.data)
  // };

  // useEffect(() => {
  //   loadUsers();
  // }, []);

  console.log(users);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    //await handlerUser(data);
    // console.log(data);
    //console.log(startDate);
  };

  // console.log(startDate.getDay())

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <h2 className='form__title'>Edit User</h2>
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
                  //filterDate={isWeekday}
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
            <input
              className='form__input'
              {...register('location')}
              id='location'
            />
            <label className='form__label' htmlFor='location'>
              Location
            </label>
          </div>
          {errors.location && <span>This field is required</span>}
          <div className='form__div'>
            <input
              className='form__input'
              {...register('type', { required: true })}
              id='type'
            />
            <label className='form__label' htmlFor='type'>
              Type
            </label>
          </div>
          {errors.type && <span>This field is required</span>}
          <div>
            <input className='btn' type='submit' value='Submit' />
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
};
