import React, { useState, useEffect } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm, Controller } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import { getApiAssets } from './assetsApi';

const CreateAsset = ({ user }) => {
  const [installedDate, setInstalledDate] = useState(null);
  const [categories, setCategories] = useState([]);
  const history = useHistory();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    handleAsset(data);
    alert('Add successfully!');
    // history.push('/admin/assets');
    console.log(data);
  };

  function handleAsset(assets) {
    return getApiAssets
      .createAsset(assets)
      .then((response) => {
        if (response.status === 200) {
          alert('Add asset sucessfully');
          //history.push('/admin/users');
        }
      })
      .catch((error) => {
        alert('Add asset failed!');
      });
  }
  useEffect(() => {
    (async () => {
      getApiAssets.getCategories()
        .then((res) => res.data)
        .then((data) => {
          setCategories(data);
          console.log(data)
        })
        .catch((err) =>(err));
    })();
  }, []);

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <div className='form__title'>Create Asset</div>

          <div className='form__field'>
            <label>Name</label>
            <input className='input' {...register('assetName')} />
          </div>

          <div className='form__field'>
            <label>Category</label>
            <div className='custom__select'>
              {categories && (
                <select {...register('id')}>
                  {categories.map((category) => (
                    <option value={category.id}>{category.categoryCode}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className='form__field'>
            <label>Specification</label>
            <textarea
              className='textarea'
              defaultValue={''}
              {...register('specification')}
            />
          </div>

          <div className='form__field'>
            <label>Installed Date</label>
            <Controller
              control={control}
              name='installedDate'
              required={true}
              render={({ field: { onChange } }) => (
                <ReactDatePicker
                  id='doB'
                  selected={installedDate}
                  onChange={(e) => {
                    onChange(e);
                    setInstalledDate(e);
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
            <label>State</label>
            <div className='custom__select'>
              <select {...register('state')}>
                <option value=''>Select</option>
                <option value={0}>Available</option>
                <option value={1}>Not Available</option>
              </select>
            </div>
          </div>

          <div className='form__field'>
            <input type='submit' className='btn' value='Submit' />
            <Link to='/admin/assets/'>
              <button className='btn__cancel'>Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
};

export default CreateAsset;
