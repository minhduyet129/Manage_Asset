import axios from "axios";
import React, { useEffect, useState } from "react";
import { Waypoint } from "react-waypoint";
import useDebounce from "../../../../useDebounce";
import SelectUserTable from "./SelectUserTable";

function SelectUser({ onSelectUser, onSaveUserModal, onCancelUserModal }) {
  const [users, setUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({
    sortBy: "id",
    asc: true,
  });

  useEffect(() => {
    if (searchText !== "") {
      setUsers([]);
      setPageNumber(1);
    }
  }, [searchText]);

  useEffect(() => {
    if (searchText === "") {
      let url = `api/Users?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}`;
      axios
        .get(url)
        .then((res) => {
          setTotalPages(res.data.totalPages);
          setUsers((prevState) => {
            return [...prevState, ...res.data.data];
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [pageNumber, sort, searchText]);

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
      setUsers([]);
      setPageNumber(1);
      if (prevSort.sortBy === sortBy) {
        return {
          ...prevSort,
          asc: !prevSort.asc,
        };
      } else {
        return {
          ...prevSort,
          sortBy: sortBy,
          asc: true,
        };
      }
    });
  };

  const handleSearchChange = (value) => {
    setSearchText(value);
  };

  useDebounce(
    () => {
      if (searchText !== "") {
        let url = `api/Users?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}&keyword=${searchText}`;
        axios
          .get(url)
          .then((res) => {
            setTotalPages(res.data.totalPages);
            setUsers((prevState) => {
              return [...prevState, ...res.data.data];
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    500,
    [searchText, sort, pageNumber]
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
                if (
                  users.length - 1 === Number(d.row.id) &&
                  pageNumber < totalPages
                ) {
                  setPageNumber((prev) => prev + 1);
                }
              }}
            />
            <input type="radio" name="selectUser" id={d.row.id} />
          </>
        ),
      },
      {
        Header: () => {
          return (
            <div
              className="table-header"
              onClick={() => handleSortBy("staffCode")}
            >
              <span>Staff Code</span>
              {handleSortIcon("staffCode")}
            </div>
          );
        },
        accessor: "staffCode",
      },
      {
        id: "firstName",
        Header: () => {
          return (
            <div
              className="table-header"
              onClick={() => handleSortBy("firstName")}
            >
              <span>Full Name</span>
              {handleSortIcon("firstName")}
            </div>
          );
        },
        accessor: (d) => <div>{d.firstName + " " + d.lastName}</div>,
      },
      {
        Header: () => {
          return (
            <div className="table-header" onClick={() => handleSortBy("type")}>
              <span>Type</span>
              {handleSortIcon("type")}
            </div>
          );
        },
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
      onSearchChange={handleSearchChange}
    />
  );
}

export default SelectUser;
