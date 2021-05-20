import React, { useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm, Controller } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getCategories, createAsset } from './assetsApi';
import { api } from '../api';

const CreateAsset = ({ user }) => {
  const [installedDate, setInstalledDate] = useState(null);
  const history = useHistory();
  const queryClient = useQueryClient();
  const categoriesInfo = useQuery('categories', getCategories, { retry: 1 });
  const createNewAsset = useMutation(
    (newAsset) => api.post('/assets/', newAsset),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assets');
      },
      // onMutate: async (newAsset) => {
      //   await queryClient.cancelQueries('assets');
      //   const previousAssets = queryClient.getQueryData('todos');
      //   queryClient.setQueryData('assets', (old) => [...old, newAsset]);
      //   return { previousAssets };
      // },
      onError: (err, newAsset, context) => {
        queryClient.setQueryData('assets', context.previousAssets);
      },
      onSettled: () => {
        queryClient.invalidateQueries('assets');
      },
    }
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    alert('Add successfully!');
    history.push('/admin/assets');
    console.log(data);
    createNewAsset.mutate(data);
    // return new Promise((resolve, reject) => {
    //   createNewAsset(data, {
    //     onSuccess: resolve,
    //     onError: reject,
    //   });
    // });
  };

  return categoriesInfo.isLoading ? (
    <LayoutAdmin>
      <div className='table__view'>
        <h3>Loading...</h3>
      </div>
    </LayoutAdmin>
  ) : (
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
              {/* At the moment - 19/5/2021, 'category is named 'name' in api. Change it later */}
              <select {...register('name')}>
                {/* <option value=''>Select</option>
                <option value='laptop'>Laptop</option>
                <option value='history'>Something else</option> */}
                {categoriesInfo.data.map((categoryInfo) => (
                  <option
                    key={categoryInfo.categoryCode}
                    value={categoryInfo.categoryCode}
                  >
                    {categoryInfo.categoryCode}
                  </option>
                ))}
              </select>
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
                />
              )}
              rules={{
                required: true,
              }}
            />
          </div>

          <div className='form__field'>
            <p className='radio'>State</p>
            <span>
              <input
                name='state'
                type='radio'
                value={0}
                {...register('state')}
              />
            </span>
            <label>Available</label>
            <span>
              <input
                name='state'
                type='radio'
                value={1}
                {...register('state')}
              />
            </span>
            <label>Not Available</label>
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
