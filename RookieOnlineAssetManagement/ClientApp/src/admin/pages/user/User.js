import React, { useEffect, useMemo } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { useQuery } from 'react-query';
import axios from 'axios';
import { COLUMNS } from './columns';
import { useTable } from 'react-table';

function User() {

  //option 1
   const getUsers = useQuery('users', () =>
    axios.get('https://609bede52b549f00176e4bd7.mockapi.io/api/users/users')
  );
  const data = React.useMemo(
    () => getUsers?.data?.data || [],
    [getUsers?.data?.data]
  )


  //option 2
  // const [users, setUser] = useState([]);

  // useEffect(() => {
  //   axios.get('https://609bede52b549f00176e4bd7.mockapi.io/api/users/users').then(res=> {
  //     setUser(res.data);
  //   })
  // }, []);
 
  // const data = React.useMemo(
  //   () => users,
  //   [users]
  // )

 
 
  const columns = React.useMemo(
    () => COLUMNS,
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })
  // const getUsers = useQuery('users', () =>
  //   axios.get('https://609bede52b549f00176e4bd7.mockapi.io/api/users/users')
  // );
  // console.log(getUsers);

  // const columns = useMemo(()  => COLUMNS, []);
  // const data = useMemo(() => getUsers?.data?.data || [], [getUsers?.data?.data]);

  // const tableInstance = useTable({
  //   columns,
  //   data
  // });

  // if (getUsers.isLoading) {
  //   return 'Loading...';
  // }

  // if (getUsers.error) {
  //   return `Error: ${getUsers.error.message}, try again!`;
  // }
  // const [users, setUser] = useState([]);

  // useEffect(() => {
  //   axios.get('https://609bede52b549f00176e4bd7.mockapi.io/api/users/users').then(res=> {
  //     setUser(res.data)
  //   console.log(res);
  //   })
  // }, []);
 

  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  //   tableInstance;

  return (
    <LayoutAdmin>
      <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
       <thead>
         {headerGroups && headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th
                 {...column.getHeaderProps()}
                 style={{
                   borderBottom: 'solid 3px red',
                   background: 'aliceblue',
                   color: 'black',
                   fontWeight: 'bold',
                 }}
               >
                 {column.render('Header')}
               </th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows && rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                     style={{
                       padding: '10px',
                       border: 'solid 1px gray',
                       background: 'papayawhip',
                     }}
                   >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
     </table>
    </LayoutAdmin>
  );
}

export default User;
