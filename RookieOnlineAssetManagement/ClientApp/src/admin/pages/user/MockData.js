// import React,{useState, useEffect } from 'react';
// import { useQuery } from 'react-query';
// import axios from 'axios';
// import User from './User'

// const fetchData = () => axios.get(`https://609bede52b549f00176e4bd7.mockapi.io/api/users/users`);

// export const MockData = () => {
//   const [tableData, setTableData] = useState(null);

//   const { data: apiResponse, isLoading } = useQuery('users', fetchData);

//   useEffect(() => {
//     setTableData(apiResponse?.data);
//   }, [apiResponse]);

//   if (isLoading || !tableData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div></div>
//   );
// };
