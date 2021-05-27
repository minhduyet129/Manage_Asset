import { useForm, Controller } from "react-hook-form";
import LayoutAdmin from "../layout/LayoutAdmin";
import ReactDatePicker from "react-datepicker";
import DatePicker from "react-datepicker";
import { useHistory } from "react-router";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";

import SelectUser from "./SelectUser/SelectUser";
import SelectAsset from "./SelectAsset/SelectAsset";
import "./Assignment.css";
import axios from "axios";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function CreateAssignment() {
  const [userModal, setUserModal] = useState(false);
  const [assetModal, setAssetModal] = useState(false);
  const [fullName, setFullName] = useState();
  const [assetName, setAssetName] = useState();
  const [submitData, setSubmitData] = useState({
    assignToId: "",
    assetId: "",
    assignedDate: "",
    assignById: 2
  });

  const { register, handleSubmit, control, formState, reset } = useForm();

  const onSubmit = (data) => {
    axios.post('/api/Assignments', data)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  };

  const openUserModal = () => {
    setUserModal(true);
  };

  const openAssetModal = () => {
    setAssetModal(true);
  };

  const handleSaveUserModal = () => {
    setUserModal(false);
    reset({
      ...submitData,
      assignToId: submitData.user,
    });
  };

  const handleCancelUserModal = () => {
    setUserModal(false);
    setFullName("");
    reset({
      ...submitData,
      assignToId: "",
    });
  };

  const handleSaveAssetModal = () => {
    setAssetModal(false);
    reset({
      ...submitData,
      assetId: submitData.assetId,
    });
  };

  const handleCancelAssetModal = () => {
    setAssetModal(false);
    setAssetName("");
    reset({
      ...submitData,
      assetId: "",
    });
  };

  const handleSelectUser = (value) => {
    setSubmitData((prev) => {
      return {
        ...prev,
        assignToId: value.id,
      };
    });
    setFullName(value.firstName + " " + value.lastName);
  };

  const handleSelectAsset = (value) => {
    setSubmitData((prev) => {
      return {
        ...prev,
        assetId: value.id,
      };
    });
    setAssetName(value.assetName);
  };

  const handleSetAssignedDate = (e, onChange) => {
    let utcDate = new Date(e.setHours(e.getHours() + 10));
    onChange(utcDate);
    setSubmitData((prev) => {
      return {
        ...submitData,
        assignedDate: utcDate,
      };
    });
  };

  return (
    <LayoutAdmin>
      <div className="table__view">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form__title">Create Assignment</div>

          <div className="form__field">
            <label>User</label>
            <input className="input" {...register("assignToId")} hidden />
            <input className="input" value={fullName} disabled />
            <div className="search-btn" onClick={openUserModal}>
              <i class="fas fa-search"></i>
            </div>
          </div>

          <div className="form__field">
            <label>Asset</label>
            <input className="input" {...register("assetId")} hidden />
            <input className="input" value={assetName} disabled />
            <div className="search-btn" onClick={openAssetModal}>
              <i class="fas fa-search"></i>
            </div>
          </div>

          <div className="form__field">
            <label>Assigned Date</label>
            <Controller
              control={control}
              name="assignedDate"
              required={true}
              render={({ field: { onChange } }) => (
                <ReactDatePicker
                  id="doB"
                  selected={submitData.assignedDate}
                  onChange={(e) => handleSetAssignedDate(e, onChange)}
                  placeholderText="MM/DD/YY"
                  isClearable
                  withPortal
                  showYearDropdown
                  showMonthDropdown
                  dateFormatCalendar="MMMM"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  dropdownMode="select"
                  className="input"
                />
              )}
              rules={{
                required: true,
              }}
            />
          </div>

          <div className="form__field">
            <label>Note</label>
            <textarea
              className="input"
              {...register("note")}
              onChange={(e) =>
                setSubmitData((prev) => {
                  return {
                    ...submitData,
                    note: e.target.value,
                  };
                })
              }
            />
            <div className="search-btn" onClick={openAssetModal}>
              <i class="fas fa-search"></i>
            </div>
          </div>

          <div className="form__field">
            <input type="submit" className="btn" value="Submit" />
            <Link to="/admin/assets/">
              <button className="btn__cancel">Cancel</button>
            </Link>
          </div>
        </form>
      </div>
      <button onClick={openUserModal}>Open Modal</button>

      <Modal
        isOpen={userModal}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeUserModal}
        style={customStyles}
      >
        <div className="modal-wrapper">
          <div className="modal-body">
            <SelectUser
              onSelectUser={handleSelectUser}
              onSaveUserModal={handleSaveUserModal}
              onCancelUserModal={handleCancelUserModal}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={assetModal}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeAssetModal}
        style={customStyles}
      >
        <div className="modal-wrapper">
          <div className="modal-body">
            <SelectAsset
              onSelectAsset={handleSelectAsset}
              onSaveAssetModal={handleSaveAssetModal}
              onCancelAssetModal={handleCancelAssetModal}
            />
          </div>
        </div>
      </Modal>
    </LayoutAdmin>
  );
}

export default CreateAssignment;
