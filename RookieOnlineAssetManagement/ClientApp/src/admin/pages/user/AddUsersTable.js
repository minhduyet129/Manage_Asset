import React, { useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import ReactDatePicker from 'react-datepicker';
import { useHistory } from 'react-router-dom';
function AddUsersTable() {
  let history = useHistory();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  async function handleUsers(users) {
    console.log(users);

    try {
      await axios.post(
        'http://hungbqit-001-site5.itempurl.com/api/Users',
        users
      );
      const res = await axios.get(
        'http://hungbqit-001-site5.itempurl.com/api/Users'
      );
      const data = res.data;
      setUsers(data);
    } catch (err) {
      setError(err);
    }
  }

  // type FormValues = {
  //   gender: enum;
  // };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    alert('Add successfully!');
    await handleUsers(data);
    // history.push('/admin/users');
  };
  return (
    <div>
      <LayoutAdmin>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='container-1'>
            {/* register your input into the hook by invoking the "register" function */}
            FirstName <input {...register('firstname')} />
          </div>
          <div className='container-1'>
            {/* include validation with required or other standard HTML validation rules */}
            LastName <input {...register('username', { required: true })} />
          </div>
          <div>
            Date of birth
            <Controller
              control={control}
              name='doB'
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <ReactDatePicker
                  onChange={onChange}
                  onBlur={onBlur}
                  selected={value}
                />
              )}
            />
          </div>
          <div>
            JoinedDate
            <Controller
              control={control}
              name='joinedDate'
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <ReactDatePicker
                  onChange={onChange}
                  onBlur={onBlur}
                  selected={value}
                />
              )}
            />
          </div>
          <div className='container-1'>
            Gender
            <select {...register('gender')}>
              <option value={users.gender === 0}>female</option>
              <option value={users.gender === 1}>male</option>
            </select>
          </div>
          <div className='container-1'>
            {/* register your input into the hook by invoking the "register" function */}
            Location <input {...register('location')} />
          </div>
          <div className='container-1'>
            {/* include validation with required or other standard HTML validation rules */}
            Type <input {...register('userName', { required: true })} />
          </div>
          {/* errors will return when field validation fails  */}
          {errors.exampleRequired && <span>This field is required</span>}
          <div className='container-1'>
            <input type='submit' />
          </div>
        </form>
      </LayoutAdmin>
    </div>
  );
}

export default AddUsersTable;
