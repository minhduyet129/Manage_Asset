import { useState, useEffect } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm, Controller } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import { getApiAssets } from './assetsApi';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import ModalForm from './ModalForm';
import Select, { components } from 'react-select';

import './Asset.css'

const schema = Yup.object().shape({
  assetName: Yup.string()
    .required('Asset Name is required')
    .matches(/^[aA-zZ\s 0-9]+$/, 'Invalid keyword'),
  installedDate: Yup.date()
    .required('Installed Date is required')
    .typeError('Installed Date is required'),
    categoryId: Yup.number().required('Select Category is required'),
  state: Yup.string().required('Select State is required'),
});

const Control = ({ children, ...props }) => {
  const { onCreateCategory } = props.selectProps;
  const style = { cursor: 'pointer' };

  return (
    <components.Control {...props} className="select-category">
      {children}
      <span onMouseDown={onCreateCategory} style={style} title="Create Category">
      <i class="fas fa-plus-circle"></i>
      </span>
    </components.Control>
  );
};

const CreateAsset = (props) => {
  const [modalIsOpen, setModelIsOpen] = useState(false);
  const [installedDate, setInstalledDate] = useState();
  const [categories, setCategories] = useState([]);
  const [changes, setChanges] = useState(false);
  const history = useHistory();

  const onClick = (e) => {
    handleChange()
    e.preventDefault();
    e.stopPropagation();
  };
  const {
    register,
    handleSubmit,
    control,
    // reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await handleAsset(data);
    console.log(data);
  };

  function handleAsset(assets) {
    console.log(assets);
    return getApiAssets
      .createAsset(assets)
      .then((response) => {
        if (response.status) {
          toast('Add Asset sucessfully');
           history.push('/admin/assets');
        }
      })
      .catch((error) => {
        toast('Add asset failed!');
      });
  }

  const getCategories = () => {
    getApiAssets
      .getCategories()
      .then((res) => res.data)
      .then((data) => {
        setCategories(data);
        console.log(data);
      })
      .catch((err) => err);
  };
  useEffect(getCategories, [changes]);

  const handleChange = () => {
    setModelIsOpen(true);
  };

  const options =
    categories &&
    categories.map((category) => {
      return { label: category.name, value: category.id };
    });

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <div className='form__title'>Create Asset</div>

          <div className='form__field'>
            <label>Name</label>
            <input
              {...register('assetName')}
              className={`input ${errors.assetName ? 'is-invalid' : ''}`}
            />
          </div>
          <p className='invalid-feedback'>{errors.assetName?.message}</p>

          <div className='form__field'>
            <label>Category</label>
            <div className='custom__select'>
              {/* {categories && (
                <select
                  {...register('categoryId')}
                  className={`input ${errors.categoryId ? 'is-invalid' : ''}`}
                >
                  <option value=''>Select</option>
                  {categories.map((category) => (
                    <option value={category.id}>{category.name}</option>
                  ))}
                </select>
              )} */}
              <Controller
                name='categoryId'
                control={control}
                render={({ field }) => (
                  <Select
                    {...props}
                    isSearchable
                    options={options}
                    onChange={ e => field.onChange( e.value )}
                    value={options.find((c) => c.value === field.value)}
                    onCreateCategory={onClick}
                    components={{ Control }}
                    placeholder='Select or Create New Category'
                     error={errors.categoryId}
                  />
                )}
              />
            </div>
          </div>
           <p className='invalid-feedback'>{errors.categoryId?.message}</p> 

          <div className='form__field'>
            <label>Specification</label>
            <textarea
              defaultValue={''}
              {...register('specification')}
              className='input'
            />
          </div>

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
                    let d = new Date(e.setHours(e.getHours() + 7));
                    onChange(d);
                    setInstalledDate(d);
                    console.log(d);
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
              <select
                {...register('state')}
                className={`input ${errors.categoryId ? 'is-invalid' : ''}`}
              >
                <option value=''>Select</option>
                <option value={0}>Available</option>
                <option value={2}>Not Available</option>
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
        <ModalForm
          modalIsOpen={modalIsOpen}
          setModelIsOpen={setModelIsOpen}
          setChanges={setChanges}
        />
      </div>
    </LayoutAdmin>
  );
};

export default CreateAsset;
