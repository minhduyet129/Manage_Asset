import LayoutAdmin from '../layout/LayoutAdmin';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getApiAssets } from './assetsApi';
import '../TableView.css';
import AssetsTable from './AssetsTable';

function Asset(props) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changes, setChanges] = useState(false);
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
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  console.log(assets)

  useEffect(getassets, [changes]);

  const DeleteAsset = async (index) => {
    if (!usersRef.current) return;
    const id = usersRef.current[index].id;
    await getApiAssets.deleteAsset(id)
    .then((res) => {
      setChanges((prev) => {
        const current = !prev;
        return current;
      });
      if (res.status === 200) {
        alert('Asset Deleted');
      }
    })
    .catch(() => {
      alert(
        'Delete Failed'
      );
    });
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Asset Code',
        accessor: 'assetCode',
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
          const rowIdx = props.row.id;
          return (
            <div>
              <span className='font' onClick={''}>
                <i className='bx bx-edit'></i>
              </span>
              &emsp;
              <span className='font' onClick={() => DeleteAsset(rowIdx)}>
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
