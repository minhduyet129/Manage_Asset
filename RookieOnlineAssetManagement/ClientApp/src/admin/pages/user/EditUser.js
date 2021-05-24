import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm, Controller } from 'react-hook-form';
import { useCreateUser } from './UserHooks';
import ReactDatePicker from 'react-datepicker';
import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  doB: Yup.date().required('Enter New Date of Birth! ').typeError('Date of birth is required').test("doB", "You must be 18 or older", function(doB) {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 18);      
    return doB <= cutoff;
  }),
  joinedDate: Yup.date().required('Joined Date is required ').typeError('Joined Date is required').min(Yup.ref('doB'),({min}) => `Joined Date Must be later than Date of birth` )
});

const EditUser = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [joinedDate, setJoinedDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const history = useHistory();
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const loadUsers =  () => {
     useCreateUser
      .getbyid(id)
      .then((res) => {
        setUsers(res.data.data);
        setStartDate(setDateTime(res.data.data.doB));
        setJoinedDate(setDateTime(res.data.data.joinedDate));
        reset({
          id: res.data.data.id,
          staffCode: res.data.data.staffCode,
          firstName: res.data.data.firstName,
          lastName: res.data.data.lastName,
          doB: res.data.data.doB,
          joinedDate: res.data.data.joinedDate,
          gender: getGenderEnum(res.data.data.gender),
          location: res.data.data.location,
          userName: res.data.data.userName,
          roleType: res.data.data.roles,
        });
      })
      .catch((err) => {
        setError(err);
        console.log(err);
      });
  };

  function updateUsers(users) {
    return useCreateUser
      .edit(users, id)
      .then((response) => {
        if (response.status === 200) {
          alert('Update user sucessfully');
          history.push('/admin/users');
        }
      })
      .catch((error) => {
        setError(error);
        alert('Update user failed');
      });
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState,
    reset
  } = useForm(
    {
      resolver:yupResolver(schema),
    }
  );
  const { errors } = formState;


  const setDateTime = (date) => {
    date = date.slice(0, 10);
    let newDate = date.split('-').join(',');
    return new Date(newDate);
  };

  const getGenderEnum = (gender) => {
    if (gender === 'Female') return 0;
    return 1;
  };

  const onSubmit = async (data) => {
    await updateUsers(data);
    
  };
  return (
    <LayoutAdmin>
      <div className='table__view'>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <h2 className='form__title'>Edit User</h2>
          <div className='form__div'>
            <input
              id='staffCode'
              className='form__input'
              {...register('staffCode')}
              disabled
            />
            <label className='form__label' htmlFor='staffCode'>
              StaffCode
            </label>
          </div>
          <div className='form__div'>
            <input
              id='firstName'
              className='form__input'
              {...register('firstName')}
              disabled
            />
            <label className='form__label' htmlFor='firstName'>
              First Name
            </label>
          </div>
          <div className='form__div'>
            <input
              id='lastName'
              className='form__input'
              {...register('lastName')}
              disabled
            />
            <label className='form__label' htmlFor='lastName'>
              Last Name
            </label>
          </div>
          <div className='form__div'>
            <Controller
              control={control}
              name='doB'
              render={({ field: { onChange } }) => (
                <ReactDatePicker
                  id='doB'
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    console.log(date);
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
                  error={(errors.doB)}
                />
              )}
            />
            <label className='date-picker__label' htmlFor='doB'>
              Date of Birth
            </label>
          </div>
          <p className="invalid-feedback">{errors.doB?.message}</p>
          <div className='form__div'>
            <Controller
              control={control}
              name='joinedDate'
              render={({ field: { onChange } }) => (
                <ReactDatePicker
                  id='joinedDate'
                  selected={joinedDate}
                  onChange={(date) => {
                    setJoinedDate(date);
                    console.log(date);
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
                  error={(errors.joinedDate)}
                />
              )}
            />
            <label className='date-picker__label' htmlFor='joinedDate'>
              Joined Date
            </label>
          </div>
          <p className="invalid-feedback">{errors.joinedDate?.message}</p>
          <div className='form__div'>
            <select className='form__input' {...register('gender')} id='gender'>
              <option value={0}>Female</option>
              <option value={1}>Male</option>
            </select>
            {errors.gender && <span>Please input</span>}
            <label className='form__label' htmlFor='gender'>
              Gender
            </label>
          </div>
          <div className='form__div'>
            <select
              className='form__input'
              {...register('roleType')}
              id='roleType'
            >
              <option value='User'>User</option>
              <option value='Admin'>Admin</option>
            </select>
            <label className='form__label' htmlFor='roleType'>
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

export default EditUser;