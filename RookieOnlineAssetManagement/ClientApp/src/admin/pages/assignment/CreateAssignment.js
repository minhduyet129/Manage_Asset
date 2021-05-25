import React, { useState } from "react";
import LayoutAdmin from "../layout/LayoutAdmin";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import ReactDatePicker from "react-datepicker";

function CreateAssignment() {
  const { register, handleSubmit, control, formState } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

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
                //   selected={installedDate}
                //   onChange={(e) => {
                //     onChange(e);
                //     setInstalledDate(e);
                //   }}
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
              <select {...register('name')}>
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
}

export default CreateAssignment;
