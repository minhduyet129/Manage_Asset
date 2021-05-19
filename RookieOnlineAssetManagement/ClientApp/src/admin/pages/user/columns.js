import { Link } from 'react-router-dom';

const Delete =  async  (id) => {};

export const COLUMNS = [
  {
    Header: 'Id',
    accessor: 'id',
  },
  {
    Header: 'StaffCode',
    accessor: 'staffCode',
  },
  {
    Header: 'FirstName',
    accessor: 'firstName',
  },
  {
    Header: 'LastName',
    accessor: 'lastName',
  },
  {
    Header: 'Date of Birth',
    accessor: 'doB',
  },
  {
    Header: 'JoinedDate',
    accessor: 'joinedDate',
  },
  {
    Header: 'Gender',
    accessor: 'gender',
  },
  {
    Header: 'Location',
    accessor: 'location',
  },
  {
    Header: 'Username',
    accessor: 'userName',
  },
  {
    Header: 'Actions',
    accessor: 'actions',
    Cell: (props) => {
      return (
        <div>
          <span>
            <Link>
              <i className='far fa-edit action mr-2'></i>
            </Link>
          </span>
          &emsp;
          <span onClick={() => Delete()}>
            <i className='fas fa-trash action'></i>
          </span>
        </div>
      );
    },
  },
];
