import { useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm, Controller } from 'react-hook-form';
import { useCreateUser } from './UserHooks';
import DatePicker from 'react-datepicker';
import { useHistory } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const schema = Yup.object().shape({
  firstName: Yup.string()
    .required('First Name is required')
    .matches(/^[aA-zZ\s 0-9]+$/, 'Invalid Input'),
  lastName: Yup.string()
    .required('Last name is required')
    .matches(/^[aA-zZ\s 0-9]+$/, 'Invalid Input'),
  doB: Yup.date()
    .required('Date of birth is required')
    .typeError('Date of birth is required')
    .test('doB', 'You must be 18 or older', function (doB) {
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 18);
      return doB <= cutoff;
    }),
  joinedDate: Yup.date()
    .required('Joined Date is required')
    .typeError('Joined Date is required')
    .min(
      Yup.ref('doB'),
      ({ min }) => `Joined Date Must be later than Date of birth`
    ),
});

const CreateUser = () => {
  const [startDate, setStartDate] = useState();
  const [joinedDate, setJoinedDate] = useState();
  const history = useHistory();
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };
  const handlerUser = (users) => {
    users.gender = users.gender === 0 ? 0 : 1;
    return useCreateUser
      .create(users)
      .then((response) => {
        if (response.status === 200) {
          toast.success('Add user sucessfully');
          history.push('/admin/users');
        }
        console.log(users);
      })
      .catch((error) => {
        if (error.response) {
          toast.error('Add user failed!');
        }
      });
  };

  const { register, handleSubmit, control, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const onSubmit = async (data) => {
    await handlerUser(data);
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
            <input
              id='firstname'
              {...register('firstName')}
              className={`input ${errors.firstName ? 'is-invalid' : ''}`}
            />
          </div>
          <p className='invalid-feedback'>{errors.firstName?.message}</p>
          <div className='form__field'>
            <label className='form__label' htmlFor='lastname'>
              Last Name
            </label>
            <input
              id='lastName'
              {...register('lastName')}
              className={`input ${errors.lastName ? 'is-invalid' : ''}`}
            />
          </div>
          <p className='invalid-feedback'>{errors.lastName?.message}</p>
          <div className='form__field'>
            <label className='form__label' htmlFor='dob'>
              Date of Birth
            </label>
            <Controller
              control={control}
              name='doB'
              required={true}
              render={({ field: { onChange } }) => (
                <DatePicker
                  id='doB'
                  selected={startDate}
                  format='YYYY-MM-D HH:m:s'
                  onChange={(e) => {
                    let d = new Date(e.setHours(e.getHours() + 7));
                    onChange(d);
                    setStartDate(d);
                  }}
                  placeholderText='MM/DD/YY'
                  withPortal
                  showYearDropdown
                  showMonthDropdown
                  dateFormatCalendar='MMMM'
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  dropdownMode='select'
                  className='input'
                  error={errors.doB}
                />
              )}
            />
          </div>
          <p className='invalid-feedback'>{errors.doB?.message}</p>

          <div className='form__field'>
            <label className='date-picker__label' htmlFor='joinedDate'>
              Joined Date
            </label>
            <Controller
              control={control}
              name='joinedDate'
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <DatePicker
                  id='joinedDate'
                  selected={joinedDate}
                  format='YYYY-MM-D HH:m:s'
                  onChange={(e) => {
                    let d = new Date(e.setHours(e.getHours() + 7));
                    onChange(d);
                    setJoinedDate(d);
                  }}
                  filterDate={isWeekday}
                  placeholderText='MM/DD/YY'
                  withPortal
                  showYearDropdown
                  showMonthDropdown
                  dateFormatCalendar='MMMM'
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  dropdownMode='select'
                  error={errors.joinedDate}
                  className='input'
                  styles={{ width: '200px' }}
                />
              )}
            />
          </div>
          <p className='invalid-feedback'>{errors.joinedDate?.message}</p>

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
            <input type='submit' className='btn' value='Create' />
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
