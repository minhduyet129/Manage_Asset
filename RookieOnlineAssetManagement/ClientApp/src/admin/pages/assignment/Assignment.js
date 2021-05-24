import axios from "axios";
import React from "react";
import { format } from "date-fns";
import { useHistory } from "react-router";
import ReactPaginate from 'react-paginate';
import { useEffect, useRef, useState } from "react";

import AssignmentTable from "./AssignmentTable";
import LayoutAdmin from "../layout/LayoutAdmin";
import './Assignment.css';

function Assignment() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const history = useHistory();

  const assignmentsRef = useRef([]);

  const callAssignmentsAPI = () => {
    axios
      .get(`/api/Assignment?PageNumber=${pageNumber}&PageSize=10`)
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
    setLoading(true)
    callAssignmentsAPI();
  }, [pageNumber]);

  const getAssignmentId = (rowIndex) => {
    if (!assignmentsRef.current) return;
    const id = assignmentsRef.current[rowIndex].id;
    if (id) {
      history.push(`/admin/users/edit/${id}`);
    }
  };

  const DisableAssignments = () => {};

  const handlePageClick = (data) => {
    const currentPage = data.selected
    setPageNumber(currentPage + 1)
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "No.",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return <span>{Number(rowIdx) + 1}</span>;
        },
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
        Header: "Assigned to",
        accessor: "assignTo",
      },
      {
        Header: "Assigned by",
        accessor: "assignBy",
      },
      {
        Header: "Assigned Date",
        accessor: "assignDate",
        Cell: ({ value }) => {
          return format(new Date(value), "dd/MM/yyyy");
        },
      },
      {
        Header: "State",
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
    []
  );

  return (
    <LayoutAdmin>
      <AssignmentTable columns={columns} data={assignments} loading={loading} />
      <div className="paging-box">
        <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
      </div>
    </LayoutAdmin>
  );
}

export default Assignment;
