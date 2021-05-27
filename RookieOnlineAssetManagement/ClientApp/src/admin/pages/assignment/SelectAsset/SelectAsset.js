import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Waypoint } from "react-waypoint";
import useDebounce from "../../../../useDebounce";
import SelectAssetTable from "./SelectAssetTable";

function SelectAsset({onSelectAsset, onSaveAssetModal, onCancelAssetModal}) {
  const [assets, setAssets] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(1);
  const [searchText, setSearchText] = useState();
  const [sort, setSort] = useState({
    sortBy: "assetCode",
    asc: true,
  });

  const usersRef = useRef([]);

  const callUsersAPI = () => {
    
  };

  useEffect(() => {
    let url = `api/Assets?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}`;
    if (searchText) {
      url = `api/Assets?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}&keyword=${searchText}`;
    }
    axios
      .get(url)
      .then((res) => {
        usersRef.current = res.data.data;
        setTotalRecords(res.data.totalRecords);
        setAssets(prevState => [
            ...prevState,
            ...res.data.data
          ]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageNumber, sort]);

  const handleSortIcon = (sortBy) => {
    if (sort.sortBy === sortBy) {
      if (sort.asc) {
        return <i class="fas fa-caret-down"></i>;
      }
      return <i class="fas fa-caret-up"></i>;
    }
    return <i class="fas fa-caret-down"></i>;
  };

  const handleSortBy = (sortBy) => {
    setSort((prevSort) => {
      if (prevSort.sortBy === sortBy) {
        return {
          ...prevSort,
          asc: !prevSort.asc,
        };
      }
      return {
        ...prevSort,
        sortBy: sortBy,
        asc: true,
      };
    });
  };

  const handleSearchChange = (value) => {
    setSearchText(value);
  };

  // useDebounce(
  //   () => {
  //     // callUsersAPI();
  //   },
  //   500,
  //   [searchText]
  // );

  // console.log(users)

  const columns = React.useMemo(
    () => [
      {
        Header: " ",
        Cell: (d) => (
          <>
            <Waypoint
              onEnter={() => {
                if (assets.length - 1 === Number(d.row.id) && Number(d.row.id) < totalRecords - 1) {
                  setPageNumber(prev => prev + 1)
                }
              }}
            />
            <input type="radio" name="selectAsset" id={d.row.id} />
          </>
        ),
      },
      {
        Header: "Asset Code",
        accessor: "assetCode",
      },
      {
        Header: "Asset Name",
        accessor: "assetName",
      },
      {
        Header: "Category",
        accessor: "categoryName",
      },
    ],
    [assets]
  );
  return (
    <SelectAssetTable
      columns={columns}
      data={assets}
      onSelectAsset={onSelectAsset}
      onSaveAssetModal={onSaveAssetModal}
      onCancelAssetModal={onCancelAssetModal}
    />
  );
}

export default SelectAsset;
