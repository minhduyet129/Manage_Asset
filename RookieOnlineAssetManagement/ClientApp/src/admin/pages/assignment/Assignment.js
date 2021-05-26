import axios from "axios";
import React from "react";
import { format } from "date-fns";
import { useHistory } from "react-router";
import ReactPaginate from "react-paginate";
import { useEffect, useRef, useState } from "react";

import useDebounce from "../../../useDebounce";
import AssignmentTable from "./AssignmentTable";
import LayoutAdmin from "../layout/LayoutAdmin";
import "./Assignment.css";

function Assignment() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState();

  const [sort, setSort] = useState({
    sortBy: "assetCode",
    asc: true,
  });

  const history = useHistory();

  const assignmentsRef = useRef([]);

  const callAssignmentsAPI = () => {
    let url = `api/Assignment?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}`;
    if (searchText) {
      url = `api/Assignment?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}&keyword=${searchText}`;
    }

    axios
      .get(url)
      .then((res) => {
        assignmentsRef.current = res.data.data;
        setAssignments(res.data.data);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    callAssignmentsAPI();
  }, [pageNumber, sort]);

  const getAssignmentId = (rowIndex) => {
    if (!assignmentsRef.current) return;
    const id = assignmentsRef.current[rowIndex].id;
    // if (id) {
    //   history.push(`/admin/users/edit/${id}`);
    // }
  };

  const DisableAssignments = () => {};

  const handlePageClick = (data) => {
    const currentPage = data.selected;
    setPageNumber(currentPage + 1);
  };

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

  useDebounce(() => {
    callAssignmentsAPI();
  }, 500, [searchText]);


  const columns = React.useMemo(
    () => [
      {
        Header: "No.",
        accessor: "id",
      },
      {
        Header: () => {
          return (
            <div
              className="table-header"
              onClick={() => handleSortBy("assetCode")}
            >
              <span>Asset Code</span>
              {handleSortIcon("assetCode")}
            </div>
          );
        },
        accessor: "assetCode",
      },
      {
        Header: () => {
          return (
            <div
              className="table-header"
              onClick={() => handleSortBy("assetName")}
            >
              <span>Asset Name</span>
              {handleSortIcon("assetName")}
            </div>
          );
        },
        accessor: "assetName",
          },

      {
        Header: () => {
          return (
            <div
              className="table-header"
              onClick={() => handleSortBy("assignTo")}
            >
              <span>Assigned to</span>
              {handleSortIcon("assignTo")}
            </div>
          );
        },
        accessor: "assignTo",
      },
      {
        Header: () => {
          return (
            <div
              className="table-header"
              onClick={() => handleSortBy("assignBy")}
            >
              <span>Assigned by</span>
              {handleSortIcon("assignBy")}
            </div>
          );
        },
        accessor: "assignBy",
      },
      {
        Header: () => {
          return (
            <div
              className="table-header"
              onClick={() => handleSortBy("assignDate")}
            >
              <span>Assigned Date</span>
              {handleSortIcon("assignDate")}
            </div>
          );
        },
        accessor: "assignDate",
        Cell: ({ value }) => {
          return format(new Date(value), "dd/MM/yyyy");
        },
      },
      {
        Header: () => {
          return (
            <div className="table-header" onClick={() => handleSortBy("state")}>
              <span>State</span>
              {handleSortIcon("state")}
            </div>
          );
        },
        accessor: "state",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;

          return (
            <div>
              <span className="font" onClick={() => getAssignmentId(rowIdx)}>
                <i className="bx bx-edit"></i>
              </span>
              &emsp;
              <span className="font" onClick={() => DisableAssignments(rowIdx)}>
                <i className="fas fa-times "></i>
              </span>
              &emsp;
              <span className="font undo-icon">
                <i class="fas fa-undo"></i>
              </span>
            </div>
          );
        },
      },
    ],
    [sort]
  );

  return (
    <LayoutAdmin>
      <AssignmentTable
        columns={columns}
        data={assignments}
        loading={loading}
        onSearch={handleSearchChange}
      />
      <div className="paging-box">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </LayoutAdmin>
  );
}

export default Assignment;
