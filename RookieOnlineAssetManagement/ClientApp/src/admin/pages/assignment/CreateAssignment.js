import React, { useState } from "react";
import LayoutAdmin from "../layout/LayoutAdmin";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

function CreateAssignment() {
  const { register, handleSubmit, control, formState } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <LayoutAdmin>
      <div className="table__view">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="form__title">Create User</h2>
          <div className="form__field">
            <label className="form__label" htmlFor="firstname">
              First Name
            </label>
            <input id="firstname" {...register("firstName")} />
            <label className="form__label" htmlFor="firstname">
              First Name
            </label>
          </div>

          <div className="form__div">
            <Controller
              control={control}
              name="doB"
              required={true}
              render={({ field: { onChange } }) => (
                <DatePicker
                  id="doB"
                  //   selected={startDate}
                  //   onChange={(e) => {
                  //     onChange(e)
                  //     setStartDate(e);
                  //     console.log(e)
                  //   }}

                  placeholderText="MM/DD/YY"
                  isClearable
                  withPortal
                  showYearDropdown
                  showMonthDropdown
                  dateFormatCalendar="MMMM"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  dropdownMode="select"
                />
              )}
            />
          </div>

          <div className="form__field">
            <input type="submit" className="btn" value="Submit" />
            <Link to="/admin/users/">
              <button className="btn__cancel">Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}

export default CreateAssignment;
