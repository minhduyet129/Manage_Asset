import React, { useState, useEffect } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm, Controller } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import { getApiAssets } from './assetsApi';
import {  toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  assetName: Yup.string().required('Asset Name is required').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  specification: Yup.string().required('Specification is required').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  installedDate: Yup.date()
    .required('Installed Date is required')
    .typeError('Installed Date is required'),
  categoryId:Yup.string().required('Select Category is required'),
  state:Yup.string().required('Select State is required')
});

const CreateAsset = () => {
  const [installedDate, setInstalledDate] = useState();
  const [categories, setCategories] = useState([]);
  const history = useHistory();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await handleAsset(data);
    console.log(data);
  };

  function handleAsset(assets) {
    

    console.log(assets)
    return getApiAssets
      .createAsset(assets)
      .then((response) => {
        if (response.status === 200) {
          toast('Add asset sucessfully');
          history.push('/admin/assets');
        }
      })
      .catch((error) => {
        toast('Add asset failed!');
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
            <input {...register('assetName')} 
            className={`input ${errors.assetName ? 'is-invalid' : ''}`}

            />
          </div>
          <p className='invalid-feedback'>{errors.assetName?.message}</p>

          <div className='form__field'>
            <label>Category</label>
            <div className='custom__select'>
              {categories && (
                <select {...register('categoryId')}
                className={`input ${errors.categoryId ? 'is-invalid' : ''}`}
                >
                  <option value=''>Select</option>
                  {categories.map((category) => (
                    <option value={(category.id)}>{category.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <p className='invalid-feedback'>{errors.categoryId?.message}</p>

          <div className='form__field'>
            <label>Specification</label>
            <textarea
              defaultValue={''}
              {...register('specification')}
              className={`input ${errors.specification ? 'is-invalid' : ''}`}
            />
          </div>
          <p className='invalid-feedback'>{errors.specification?.message}</p>

          <div className='form__field'>
            <label>Installed Date</label>
            <Controller
              control={control}
              name='installedDate'
              render={({ field: { onChange } }) => (
                <ReactDatePicker
                  id='installedDate'
                  selected={installedDate}
                  onChange={(e) => {
                    let d = new Date(e.setHours(e.getHours() + 10));
                    onChange(d);
                    setInstalledDate(d);
                    console.log(d);
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
                  styles={{ width: '200px' }}
                  error={errors.installedDate}
                />
              )}
            />
          </div>
          <p className='invalid-feedback'>{errors.installedDate?.message}</p>

          <div className='form__field'>
            <label>State</label>
            <div className='custom__select'>
              <select {...register('state')}
              className={`input ${errors.categoryId ? 'is-invalid' : ''}`}
              >
                <option value=''>Select</option>
                <option value={0}>Available</option>
                <option value={1}>Waiting For Approval</option>
                <option value={2}>Not Available</option>
                <option value={3}>Assigned</option>
                <option value={4}>Waiting For Recycling</option>
                <option value={5}>Recycled</option>
              </select>
            </div>
          </div>
          <p className='invalid-feedback'>{errors.state?.message}</p>

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
