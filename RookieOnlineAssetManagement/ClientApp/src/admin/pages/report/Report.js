import React, { useEffect, useMemo, useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import { getApiReport } from './reportApi';
import ReportTable from './ReportTable';

function Report() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileName = 'Report File';

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
        Header: 'Waiting For Approval',
        accessor: 'waitingForApproval',
      },
      {
        Header: 'Waiting For Recycling',
        accessor: 'waitingForRecycling',
      },
      {
        Header: 'Recycled',
        accessor: 'recycled',
      },
    ],
    []
  );

  return (
    <LayoutAdmin>
      <div className='table__view'>
        <ReportTable
          columns={columns}
          data={reports}
          loading={loading}
          fileName={fileName}
        />
      </div>
    </LayoutAdmin>
  );
}

export default Report;
