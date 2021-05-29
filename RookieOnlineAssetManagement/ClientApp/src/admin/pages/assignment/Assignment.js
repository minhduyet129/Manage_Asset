import axios from 'axios';
import React from 'react';
import Modal from 'react-modal';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import ReactPaginate from 'react-paginate';
import { useEffect, useRef, useState } from 'react';

import useDebounce from '../../../useDebounce';
import AssignmentTable from './AssignmentTable';
import LayoutAdmin from '../layout/LayoutAdmin';
import './Assignment.css';
import DeleteModal from './DeleteModal';
import HandleAPIUrl from './HandleAPIUrl';
import AssignmentDetailModal from './AssignmentDetailModal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

function Assignment() {
  const [assignments, setAssignments] = useState([]);
  const [assignment, setAssignment] = useState();
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [filterState, setFilterState] = useState(-1);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [filterAssignedDate, setFilterAssignedDate] = useState();
  const [sort, setSort] = useState({
    sortBy: 'assetCode',
    asc: true,
  });

  const history = useHistory();

  const assignmentsRef = useRef([]);

  const callAssignmentsAPI = async () => {
    axios
      .get(
        HandleAPIUrl(
          pageNumber,
          sort,
          filterState,
          filterAssignedDate,
          searchText
        )
      )
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
  }, [pageNumber, sort, filterState, filterAssignedDate]);

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
      setDeleteId(id);
    }
    setDeleteModal(true);
  };

  const handlePageClick = (data) => {
    const currentPage = data.selected;
    setPageNumber(currentPage + 1);
  };

  const handleSortIcon = (sortBy) => {
    if (sort.sortBy === sortBy) {
      if (sort.asc) {
        return <i class='fas fa-caret-down'></i>;
      }
      return <i class='fas fa-caret-up'></i>;
    }
    return <i class='fas fa-caret-down'></i>;
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
      setTotalPages(0);
      setPageNumber(1);
      callAssignmentsAPI();
    },
    500,
    [searchText, filterState, filterAssignedDate]
  );

  const handleFilterState = (value) => {
    setTotalPages(0);
    setPageNumber(1);
    if (value === '') {
      setFilterState(-1);
    } else {
      setFilterState(Number(value));
    }
  };

  const handleFilterAssignedDate = (value) => {
    setTotalPages(0);
    setPageNumber(1);
    setFilterAssignedDate(value);
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
    axios
      .delete(`/api/Assignments/${deleteId}`)
      .then((res) => {
        callAssignmentsAPI();
        setDeleteModal(false);
        toast.success('Delete Successfully');
      })
      .catch((err) => {
        toast.success('Delete Failed');
        console.log(err);
      });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('assetCode')}
            >
              <span>Asset Code</span>
              {handleSortIcon('assetCode')}
            </div>
          );
        },
        accessor: 'assetCode',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('assetName')}
            >
              <span>Asset Name</span>
              {handleSortIcon('assetName')}
            </div>
          );
        },
        accessor: 'assetName',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('assignTo')}
            >
              <span>Assigned to</span>
              {handleSortIcon('assignTo')}
            </div>
          );
        },
        accessor: 'assignTo',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('assignBy')}
            >
              <span>Assigned by</span>
              {handleSortIcon('assignBy')}
            </div>
          );
        },
        accessor: 'assignBy',
      },
      {
        Header: () => {
          return (
            <div
              className='table-header'
              onClick={() => handleSortBy('assignDate')}
            >
              <span>Assigned Date</span>
              {handleSortIcon('assignDate')}
            </div>
          );
        },
        accessor: 'assignDate',
        Cell: ({ value }) => {
          return format(new Date(value), 'dd/MM/yyyy');
        },
      },
      {
        Header: () => {
          return (
            <div className='table-header' onClick={() => handleSortBy('state')}>
              <span>State</span>
              {handleSortIcon('state')}
            </div>
          );
        },
        accessor: 'state',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: (props) => {
          const rowIdx = props.row.id;

          return (
            <div id='actions' style={{ display: 'flex' }}>
              <span className='font' onClick={() => getAssignmentId(rowIdx)}>
                <i className='bx bx-edit'></i>
              </span>
              &emsp;
              <span
                className='font'
                onClick={() => HandleClickDeleteBtn(rowIdx)}
              >
                <i className='fas fa-times '></i>
              </span>
              &emsp;
              <span className='font undo-icon'>
                <i class='fas fa-undo'></i>
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
        filterAssignedDate={filterAssignedDate}
        onSearch={handleSearchChange}
        onFilterState={handleFilterState}
        onClickAssignment={handleOnClickAssignment}
        onFilterAssignedDate={handleFilterAssignedDate}
      />
      <div className='paging-box'>
        {totalPages && (
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
        )}
      </div>
      {assignment && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <AssignmentDetailModal
            closeModal={closeModal}
            assignment={assignment}
          />
        </Modal>
      )}
      <Modal isOpen={deleteModal} style={customStyles}>
        <DeleteModal
          closeDeleteModal={closeDeleteModal}
          onDeleteAssignment={handleDeleteAssignment}
        />
      </Modal>
    </LayoutAdmin>
  );
}

export default Assignment;
