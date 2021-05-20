import React from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';

const EditAsset = (props) => {
  const history = useHistory();

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
  };

  return (
    <LayoutAdmin>
      <div className='table__view'></div>
    </LayoutAdmin>
  );
};

export default EditAsset;
