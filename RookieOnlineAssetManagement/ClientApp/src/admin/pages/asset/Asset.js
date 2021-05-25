import LayoutAdmin from '../layout/LayoutAdmin';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getApiAssets } from './assetsApi';
import '../TableView.css';
import AssetsTable from './AssetsTable';

function Asset(props) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const usersRef = useRef(null);
  const history = useHistory();

  const getassets = () => {
    setLoading(true);
    getApiAssets
      .getAssets()
      .then((res) => {
        usersRef.current = res.data.data;
        setAssets(res.data.data);
        console.log(res.data);
        // setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  console.log(assets)

  useEffect(getassets, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Asset Code',
        accessor: 'assetCode', // accessor is the "key" in the data
      },
      {
        Header: 'Asset Name',
        accessor: 'assetName',
      },
      {
        Header: 'Category',
        accessor: 'categoryName',
      },
      {
        Header: 'State',
        accessor: 'state',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: (props) => {
          // const rowIdx = props.row.id;
          return (
            <div>
              <span className='font' onClick={''}>
                <i className='bx bx-edit'></i>
              </span>
              &emsp;
              <span className='font' onClick={''}>
                <i className='fas fa-times'></i>
              </span>
            </div>
          );
        },
      },
    ],
    []
  );
  return (
    <LayoutAdmin>
      <AssetsTable columns={columns} data={assets} loading={loading} />
    </LayoutAdmin>
  );
}

export default Asset;
