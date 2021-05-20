import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm, Controller } from 'react-hook-form';
import { useCreateUser } from './UserHooks';
import ReactDatePicker from 'react-datepicker';
export const EditUser = () => {
  const [startDate, setStartDate] = useState();
  const [joinedDate, setJoinedDate] = useState(null);
  const [users, setUsers] = useState([]);
  const { id } = useParams();
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };
  console.log(id);

  const loadUsers = () => {
    const result = useCreateUser
      .edit(id)
      .then((res) => {
        setUsers(res.data.data);
        setStartDate(setDateTime(res.data.data.doB));
        setJoinedDate(setDateTime(res.data.data.joinedDate));
        reset({
          firstName: res.data.data.firstName,
          lastName: res.data.data.lastName,
          gender: res.data.data.gender,
          location: res.data.data.location,
          userName: res.data.data.userName,
          roleType: res.data.data.roleType[0],
        });
      })
      .catch((err) => {
        console.log(err);
      });

    setUsers(result.data);
  };

  console.log(users);

  useEffect(() => {
    loadUsers();
  }, [id]);

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

  const setDateTime = (date) => {
    date = date.slice(0, 10);
    let newDate = date.split('-').join(',');
    return new Date(newDate);
  };

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
                    console.log(e);
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
            {users && users.length > 0 && (
              <select {...register('gender')}>
                {users.map((user) => (
                  <option value={user.gender = user.gender === 0 ? 0 : 1}>{user.gender}</option>
                ))}
              </select>
            )}
            {errors.gender && <span>Please input</span>}
            <label className='form__label' htmlFor='gender'>
              Gender
            </label>
          </div>
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
