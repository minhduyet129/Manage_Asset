// import React, { useState } from 'react';
// import LayoutAdmin from '../layout/LayoutAdmin';
// import { useForm, Controller } from 'react-hook-form';
// import { Link, useHistory } from 'react-router-dom';
// import ReactDatePicker from 'react-datepicker';

// const EditAsset = (props) => {
//   const [installedDate, setInstalledDate] = useState(null);
//   const history = useHistory();

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     alert('Edit successfully!');
//     history.push('/admin/assets');
//     console.log(data);
//   };

//   return (
//     <LayoutAdmin>
//       <div className='table__view'>
//         <form className='form' onSubmit={handleSubmit(onSubmit)}>
//           <div className='form__title'>Edit Asset</div>
//           <div className='form__field'>
//             <label>Name</label>
//             <input className='input' {...register('assetName')} />
//           </div>

//           <div className='form__field'>
//             <label>Specification</label>
//             <textarea
//               className='textarea'
//               defaultValue={''}
//               {...register('specification')}
//             />
//           </div>

//           <div className='form__field'>
//             <label>Installed Date</label>
//             <Controller
//               control={control}
//               name='installedDate'
//               required={true}
//               render={({ field: { onChange } }) => (
//                 <ReactDatePicker
//                   id='doB'
//                   selected={installedDate}
//                   onChange={(e) => {
//                     onChange(e);
//                     setInstalledDate(e);
//                   }}
//                   placeholderText='MM/DD/YY'
//                   isClearable
//                   withPortal
//                   showYearDropdown
//                   showMonthDropdown
//                   dateFormatCalendar='MMMM'
//                   yearDropdownItemNumber={100}
//                   scrollableYearDropdown
//                   dropdownMode='select'
//                 />
//               )}
//               rules={{
//                 required: true,
//               }}
//             />
//           </div>

//           <div className='form__field'>
//             <label>State</label>
//             <div className='custom__select'>
//               <select {...register('name')}>
//                 <option value=''>Select</option>
//                 <option value={0}>Available</option>
//                 <option value={1}>Not Available</option>
//                 <option value={2}>Waiting for recycling</option>
//                 <option value={3}>Recycled</option>
//               </select>
//             </div>
//           </div>

//           <div className='form__field'>
//             <input type='submit' className='btn' value='Submit' />
//             <Link to='/admin/assets/'>
//               <button className='btn__cancel'>Cancel</button>
//             </Link>
//           </div>
//         </form>
//       </div>
//     </LayoutAdmin>
//   );
// };

// export default EditAsset;
