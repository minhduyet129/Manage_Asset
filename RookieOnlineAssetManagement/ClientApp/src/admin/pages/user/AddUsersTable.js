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
      await axios.post('https://609bede52b549f00176e4bd7.mockapi.io/api/users/users', users);
      const res = await axios.get('https://609bede52b549f00176e4bd7.mockapi.io/api/users/users');
      const data = res.data;
      setUsers(data);
    } catch (err) {
      setError(err);
    }
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    alert('Add successfully!')
    await handleUsers(data);
    history.push("/admin/users")
     
  };
  return (
    <div>
      <LayoutAdmin>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='container-1'>
            {/* register your input into the hook by invoking the "register" function */}
            FullName <input {...register('fullname')} />
          </div>
          <div className='container-1'>
            {/* include validation with required or other standard HTML validation rules */}
            UserName <input {...register('username', { required: true })} />
          </div>
            JoinDate
            <Controller
              control={control}
              name='ReactDatepicker'
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <ReactDatePicker
                  onChange={onChange}
                  onBlur={onBlur}
                  selected={value}
                />
              )}
            />
            <div className='container-1'>
            {/* include validation with required or other standard HTML validation rules */}
            Type <input {...register('type', { required: true })} />
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
