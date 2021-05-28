import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Waypoint } from "react-waypoint";
import useDebounce from "../../../../useDebounce";
import SelectAssetTable from "./SelectAssetTable";

function SelectAsset({onSelectAsset, onSaveAssetModal, onCancelAssetModal}) {
  const [assets, setAssets] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({
    sortBy: "assetCode",
    asc: true,
  });

  const usersRef = useRef([]);

  const callUsersAPI = () => {
    
  };

  useEffect(() => {
    if (searchText === "") {
      let url = `api/Assets/GetAssetAvailable?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}`;
    axios
      .get(url)
      .then((res) => {
        // console.log(res)
        usersRef.current = res.data.data;
        setTotalPages(res.data.totalPages);
        setAssets(prevState => [
            ...prevState,
            ...res.data.data
          ]);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, [pageNumber, sort, searchText]);

  useEffect(() => {
    if (searchText !== "") {
      setAssets([]);
      setPageNumber(1)
    }
  }, [searchText])

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

  useDebounce(
    () => {
      if (searchText !== "") {
        let url = `api/Assets/GetAssetAvailable?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}&keyword=${searchText}`;
        axios
          .get(url)
          .then((res) => {
            setTotalPages(res.data.totalPages);
            setAssets((prevState) => {
              return [...prevState, ...res.data.data];
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    500,
    [searchText]
  );

  // console.log(users)

  const columns = React.useMemo(
    () => [
      {
        Header: " ",
        Cell: (d) => (
          <>
            <Waypoint
              onEnter={() => {
                if (assets.length - 1 === Number(d.row.id) && Number(d.row.id) < totalPages - 1) {
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
      onSearchChange={handleSearchChange}
    />
  );
}

export default SelectAsset;
