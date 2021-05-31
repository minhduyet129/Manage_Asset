import { useTable } from "react-table";
import { Link } from "react-router-dom";
import Select from "react-select";

import { customStyles } from "../CustomSelectStyle"

const options = [
  { value: 0, label: "Admin" },
  { value: 1, label: "User" },
];

const UsersTable = ({
  columns,
  data,
  loading,
  onSearchChange = () => {},
  onSelectType = () => {},
  onShowUserDetail = () => {},
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div>
      <div className="table__view">
        <h2>Manage User</h2>
        <div className="table__view--search">
          <form className="search">
            <label />
            <Select
                placeholder="Type"
                isSearchable={false}
                isClearable={true}
                styles={customStyles}
                className="State"
                onChange={(e) => onSelectType(e)}
                options={options}
              />
            <i className="bx bx-filter-alt" />
          </form>
          <form className="search">
            <label />
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <i className="bx bx-search" />
          </form>
          <Link to="/admin/users/create">
            <button className="btn">Create New User</button>
          </Link>
        </div>
        <div>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {loading ? (
              <div className="spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            ) : (
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                    id="tr-hover"
                    {...row.getRowProps()}
                    onClick={(e) => {
                      if (!e.target.closest("#actions")) {
                        onShowUserDetail(row.original);
                      }
                    }}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
