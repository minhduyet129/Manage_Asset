import React from "react";
import { useTable, usePagination } from "react-table";
import { Link } from "react-router-dom";


const UsersTable = ({
  columns,
  data,
  loading,
  onSearch = () => {}
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, usePagination);

  return (
    <div>
      <div className="table__view">
        <h2>Manage Assignment</h2>
        <div className="table__view--search">
          <form className="search">
            <label />
            <input type="text" placeholder="State" />
            <i className="bx bx-filter-alt" />
          </form>
          <div className="search">
            <label />
            <input
              type="text"
              placeholder="Name"
              id="search"
              onChange={(e) => onSearch(e.target.value)}
            />
            <i className="bx bx-search" />
          </div>
          <Link to="/admin/assignments/create">
            <button className="btn">Create New Assignment</button>
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
                    <tr {...row.getRowProps()}>
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
