import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Waypoint } from "react-waypoint";
import useDebounce from "../../../../useDebounce";
import SelectUserTable from "./SelectUserTable";

function SelectUser({onSelectUser, onSaveUserModal, onCancelUserModal}) {
  const [users, setUsers] = useState([]);
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
    let url = `api/Users?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}`;
    if (searchText) {
      url = `api/Users?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}&keyword=${searchText}`;
    }
    axios
      .get(url)
      .then((res) => {
        usersRef.current = res.data.data;
        setTotalRecords(res.data.totalRecords);
        setUsers(prevState => [
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
                if (users.length - 1 === Number(d.row.id) && Number(d.row.id) < totalRecords - 1) {
                  setPageNumber(prev => prev + 1)
                }
              }}
            />
            <input type="radio" name="selectUser" id={d.row.id} />
          </>
        ),
      },
      {
        Header: "StaffCode",
        accessor: "staffCode",
      },
      {
        Header: "FullName",
        accessor: (d) => <div>{d.firstName + " " + d.lastName}</div>,
      },
      {
        Header: "Type",
        accessor: "roles",
      },
    ],
    [users]
  );
  return (
    <SelectUserTable
      columns={columns}
      data={users}
      onSelectUser={onSelectUser}
      onSaveUserModal={onSaveUserModal}
      onCancelUserModal={onCancelUserModal}
    />
  );
}

export default SelectUser;