import axios from "axios";
import Modal from "react-modal";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import ReactPaginate from "react-paginate";
import { useEffect, useRef, useState, useMemo } from "react";
import queryString from "query-string";

import AssignmentTable from "./AssignmentTable";
import LayoutAdmin from "../layout/LayoutAdmin";
import DeleteModal from "./DeleteModal";
import AssignmentDetailModal from "./AssignmentDetailModal";
import { modalCustomStyle } from "../ModalCustomStyles";
import "./Assignment.css";

Modal.setAppElement("#root");

function Assignment() {
  const [assignments, setAssignments] = useState([]);
  const [assignment, setAssignment] = useState();
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [assignedDate, setAssignedDate] = useState();
  const [pagination, setPaginaion] = useState({
    totalPages: 0,
    pageNumber: 1,
  });
  const [filters, setFilters] = useState({
    PageNumber: 1,
    assignedDate: null,
    filterState: null,
    PageSize: 10,
    keyword: null,
    sortBy: null,
    asc: true,
  });

  const history = useHistory();

  const assignmentsRef = useRef([]);
  const typingTimoutRef = useRef(null);

  const callAssignmentsAPI = async () => {
    const paramString = queryString.stringify(filters);
    axios
      .get(`api/Assignments?${paramString}`)
      .then((res) => {
        assignmentsRef.current = res.data.data;
        setAssignments(res.data.data);
        setPaginaion({
          totalPages: res.data.totalPages,
          pageNumber: res.data.pageNumber,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    callAssignmentsAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const getAssignmentId = (rowIndex) => {
    if (!assignmentsRef.current) return;
    const id = assignmentsRef.current[rowIndex].id;
    if (id) {
      history.push(`/admin/assignments/${id}/edit`);
    }
  };

  const handleClickDeleteBtn = (rowIndex) => {
    if (!assignmentsRef.current) return;
    const id = assignmentsRef.current[rowIndex].id;
    if (id) {
      setDeleteId(id);
    }
    setDeleteModal(true);
  };

  const handlePageClick = (data) => {
    const currentPage = data.selected;
    setFilters({
      ...filters,
      PageNumber: currentPage + 1,
    });
  };

  const handleSortIcon = (sortBy) => {
    if (filters.sortBy === sortBy) {
      if (filters.asc) {
        return <i className="fas fa-caret-down"></i>;
      }
      return <i className="fas fa-caret-up"></i>;
    }
    return <i className="fas fa-caret-down"></i>;
  };

  const handleSortBy = (sortBy) => {
    setPaginaion({
      totalPages: 0,
      pageNumber: 1,
    });
    setFilters((prev) => {
      if (prev.sortBy === sortBy) {
        return {
          ...prev,
          asc: !prev.asc,
          PageNumber: 1,
        };
      }
      return {
        ...prev,
        sortBy: sortBy,
        asc: true,
        PageNumber: 1,
      };
    });
  };

  const handleSearchChange = (value) => {
    if (typingTimoutRef.current) {
      clearTimeout(typingTimoutRef.current);
    }

    typingTimoutRef.current = setTimeout(() => {
      setPaginaion({
        pageNumber: 1,
        totalPages: 0,
      });
      setFilters({
        ...filters,
        keyword: value,
        PageNumber: 1,
      });
    }, 500);
  };

  const handleFilterAssignedDate = (value) => {
    setPaginaion({
      totalPages: 0,
    });

    if (!value) {
      setAssignedDate(null)
      setFilters({
        ...filters,
        PageNumber: 1,
        assignedDate: null,
      });
    } else {
      const date = format(new Date(value), "dd/MM/yyyy");
      setAssignedDate(value);
      setFilters({
        ...filters,
        PageNumber: 1,
        assignedDate: date,
      });
    }
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

  const handleSelectState = (event) => {
    setPaginaion({
      totalPages: 0,
    });
    if (!event) {
      event = {
        target: "",
        value: null,
      };
    }
    setFilters({
      ...filters,
      filterState: event.value,
      PageNumber: 1,
    });
  };

  const handleDeleteAssignment = () => {
    axios
      .delete(`/api/Assignments/${deleteId}`)
      .then((res) => {
        callAssignmentsAPI();
        setDeleteModal(false);
        toast.success("Delete Successfully");
      })
      .catch((err) => {
        toast.success("Delete Failed");
        console.log(err);
      });
  };

  const columns = useMemo(
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
              <span
                className="font"
                onClick={() => handleClickDeleteBtn(rowIdx)}
              >
                <i className="fas fa-times "></i>
              </span>
              &emsp;
              <span className="font undo-icon">
                <i className="fas fa-undo"></i>
              </span>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.sortBy]
  );

  return (
    <LayoutAdmin>
      <AssignmentTable
        columns={columns}
        data={assignments}
        loading={loading}
        filterAssignedDate={assignedDate}
        onSearch={handleSearchChange}
        onClickAssignment={handleOnClickAssignment}
        onFilterAssignedDate={handleFilterAssignedDate}
        onSelectStateOption={handleSelectState}
      />
      <div className="paging-box">
        {pagination.totalPages > 0 && (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pagination.totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        )}
      </div>
      {assignment && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={modalCustomStyle}
        >
          <AssignmentDetailModal
            closeModal={closeModal}
            assignment={assignment}
          />
        </Modal>
      )}
      <Modal isOpen={deleteModal} style={modalCustomStyle}>
        <DeleteModal
          closeDeleteModal={closeDeleteModal}
          onDeleteAssignment={handleDeleteAssignment}
        />
      </Modal>
    </LayoutAdmin>
  );
}

export default Assignment;
