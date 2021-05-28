import axios from "axios";
import React from "react";
import Modal from "react-modal";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import ReactPaginate from "react-paginate";
import { useEffect, useRef, useState } from "react";

import useDebounce from "../../../useDebounce";
import AssignmentTable from "./AssignmentTable";
import LayoutAdmin from "../layout/LayoutAdmin";
import "./Assignment.css";
import DeleteModal from "./DeleteModal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

function Assignment() {
  const [assignments, setAssignments] = useState([]);
  const [assignment, setAssignment] = useState();
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState();
  const [filterState, setFilterState] = useState();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();

  const [sort, setSort] = useState({
    sortBy: "assetCode",
    asc: true,
  });

  const history = useHistory();

  const assignmentsRef = useRef([]);

  const callAssignmentsAPI = () => {
    let url = `api/Assignments?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}`;
    if (searchText) {
      url = `api/Assignments?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}&keyword=${searchText}`;
    }
    if (filterState) {
      url = `api/Assignments?PageNumber=${pageNumber}&PageSize=10&sortBy=${sort.sortBy}&asc=${sort.asc}&filterState=${filterState}`;
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
    if (id) {
      history.push(`/admin/assignments/${id}/edit`);
    }
  };

  const HandleClickDeleteBtn = (rowIndex) => {
    if (!assignmentsRef.current) return;
    const id = assignmentsRef.current[rowIndex].id;
    if (id) {
      setDeleteId(id)
    }
    setDeleteModal(true)
  };

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

  useDebounce(
    () => {
      callAssignmentsAPI();
    },
    500,
    [searchText, filterState]
  );

  const handleFilterState = (value) => {
    setFilterState(Number(value));
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const handleOnClickAssignment = (value) => {
    setAssignment(value);
    openModal();
  };

  const handleDeleteAssignment = () => {
    axios.delete(`/api/Assignments/${deleteId}`)
      .then((res) => {
        callAssignmentsAPI();
        setDeleteModal(false);
        toast.success("Delete Successfully")
      })
      .catch(err => {
        toast.success("Delete Failed")
        console.log(err);
      })
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
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
            <div id="actions" style={{ display: "flex" }}>
              <span className="font" onClick={() => getAssignmentId(rowIdx)}>
                <i className="bx bx-edit"></i>
              </span>
              &emsp;
              <span className="font" onClick={() => HandleClickDeleteBtn(rowIdx)}>
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
        onFilterState={handleFilterState}
        onClickAssignment={handleOnClickAssignment}
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
      {assignment && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <div className="modal-wrapper">
            <div className="modal-close-btn" onClick={closeModal}>
              <i class="fas fa-times"></i>
            </div>
            <div className="modal-header">
              <span>Assignment Details</span>
            </div>
            <div className="modal-body">
              <div className="body-row">
                <div className="row-title">Asset Code</div>
                <div className="row-value">{assignment.assetCode}</div>
              </div>
              <div className="body-row">
                <div className="row-title">Asset Name</div>
                <div className="row-value">{assignment.assetName}</div>
              </div>
              <div className="body-row">
                <div className="row-title">Assigned to</div>
                <div className="row-value">{assignment.assignTo}</div>
              </div>
              <div className="body-row">
                <div className="row-title">Assigned by</div>
                <div className="row-value">{assignment.assignBy}</div>
              </div>
              <div className="body-row">
                <div className="row-title">Assigned Date</div>
                <div className="row-value">
                  {assignment.assignDate.slice(0, 10)}
                </div>
              </div>
              <div className="body-row">
                <div className="row-title">State</div>
                <div className="row-value">{assignment.state}</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      <Modal
          isOpen={deleteModal}
          style={customStyles}
        >
          <DeleteModal
            closeDeleteModal={closeDeleteModal}
            onDeleteAssignment={handleDeleteAssignment}
          />
        </Modal>
    </LayoutAdmin>
  );
}

export default Assignment;
