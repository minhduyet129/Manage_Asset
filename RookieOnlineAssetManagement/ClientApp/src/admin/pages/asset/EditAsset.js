import React, { useEffect, useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm, Controller } from 'react-hook-form';
import { Link, useHistory, useParams } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import { getApiAssets } from './assetsApi';
const EditAsset = (props) => {
  const [installedDate, setInstalledDate] = useState(null);
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  const loadAssets = async () => {
    await getApiAssets
      .getAsset(id)
      .then((res) => {
        setAssets(res.data);
        setInstalledDate(setDateTime(res.data[0].installedDate))
        console.log(res.data);
        reset({
          id: res.data[0].id,
          assetCode: res.data[0].assetCode,
          assetName: res.data[0].assetName,
          specification: res.data[0].specification,
          installedDate: res.data[0].installedDate,
          categoryName: res.data[0].categoryName,
          assetState: res.data[0].assetState,
        });
      })
      .catch((err) => {
        setError(err);
        console.log(err);
      });
  };

  const setDateTime = (date) => {
    date = date.slice(0, 10);

    let newDate = date.split('-').join(',');
    return new Date(newDate);
  };

  function updateAssets(assets) {
    return getApiAssets
      .updateAsset(assets, id)
      .then((response) => {
        if (response.status === 200) {
          alert('Update asset sucessfully');
          //history.push('/admin/assets');
        }
      })
      .catch((error) => {
        setError(error);
        alert('Update asset failed');
      });
  }

  useEffect(() => {
    loadAssets();
  }, []);

  const { register, handleSubmit, control, reset, formState } = useForm();

  const { errors } = formState;

  const onSubmit = (data) => {
      updateAssets(data)
    // alert('Edit successfully!');
    // history.push('/admin/assets');
    console.log(data);
  };

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <div className='form__title'>Edit Asset</div>
          <div className='form__field'>
            <label>Name</label>
            <input className='input' {...register('assetName')} />
          </div>
          <div className='form__field'>
            <label>Category</label>
            <input className='input' {...register('categoryName')} disabled />
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
            <label>State</label>
            <div className='custom__select'>
              <select {...register('assetState')}>
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

export default EditAsset;
