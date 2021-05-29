import React, { useEffect, useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm, Controller } from 'react-hook-form';
import { Link, useHistory, useParams } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import { getApiAssets } from './assetsApi';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  assetName: Yup.string()
    .required('Asset Name is required')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
  specification: Yup.string()
    .required('Specification is required')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
  installedDate: Yup.date()
    .required('Installed Date is required')
    .typeError('Installed Date is required'),
  state: Yup.string().required('Select State is required'),
});
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
        setInstalledDate(setDateTime(res.data[0].installedDate));
        console.log(res.data);
        reset({
          id: res.data[0].id,
          assetCode: res.data[0].assetCode,
          assetName: res.data[0].assetName,
          specification: res.data[0].specification,
          installedDate: res.data[0].installedDate,
          categoryName: res.data[0].categoryName,
          state: res.data[0].assetState,
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
          toast('Update asset sucessfully');
           history.push('/admin/assets');
        }
      })
      .catch((error) => {
        setError(error);
        toast('Update asset failed');
      });
  }

  useEffect(() => {
    loadAssets();
  }, []);

  const { register, handleSubmit, control, reset, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const onSubmit = (data) => {
    updateAssets(data);
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
            <input className={`input ${errors.assetName ? 'is-invalid' : ''}`} {...register('categoryName')} disabled />
          </div>
          <p className='invalid-feedback'>{errors.assetName?.message}</p>

          <div className='form__field'>
            <label>Specification</label>
            <textarea
              className={`input ${errors.specification ? 'is-invalid' : ''}`}
              defaultValue={''}
              {...register('specification')}
            />
          </div>
          <p className='invalid-feedback'>{errors.specification?.message}</p>

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
                <option value={0}>Available</option>
                <option value={1}>Not Available</option>
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

export default EditAsset;
