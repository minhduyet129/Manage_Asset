import LayoutAdmin from '../layout/LayoutAdmin';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getApiAssets } from './assetsApi';
import '../TableView.css';
import AssetsTable from './AssetsTable';
import {  toast } from 'react-toastify';
function Asset() {
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
        toast('Asset Deleted');
      }
    })
    .catch(() => {
      toast(
        'Delete Failed'
      );
    });
  }

  const getAssetId = async (rowIndex) => {
    if (!usersRef.current) return;
    const id = usersRef.current[rowIndex].id;
    if (id) {
      history.push(`/admin/assets/edit/${id}`);
    }
  }

  const handleState = (value) => {
    if(value === 0) return "Available"
    if(value === 1) return "Waiting For Approval"
    if(value === 2) return "Not Available"
    if(value === 3) return "Assigned"
    if(value === 4) return "Waiting For Recycling"
    if(value === 5) return "Recycled"
    return null;
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
        accessor: (d) => <div>{handleState(d.state)}</div>,
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span className='font' onClick={() => getAssetId(rowIdx)}>
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
