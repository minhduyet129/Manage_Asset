import React, { useEffect, useMemo, useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { getApiReport } from './reportApi';
import ReportTable from './ReportTable';
function Report() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);


  const getreports = () => {

    setLoading(true);
    getApiReport
      .getReports()
      .then((res) => {
        setReports(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(getreports, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Category',
        accessor: 'categoryName',
      },
      {
        Header: 'Total',
        accessor: 'total',
      },
      {
        Header: 'Assgined',
        accessor: 'assgined',
      },
      {
        Header: 'Available',
        accessor: 'available',
      },
      {
        Header: 'Not Available',
        accessor: 'notAvailable',
      },
      {
        Header: 'Waiting For Recycling',
        accessor: 'waitingForRecycling',
      },
      {
        Header: 'Waiting For Approval',
        accessor: 'waitingForApproval',
      },
    ],
    []
  );


  return (
    <LayoutAdmin>
      <div className='table__view'>
        <ReportTable columns={columns} data={reports} loading={loading} />
      </div>
    </LayoutAdmin>
  );
}

export default Report;
