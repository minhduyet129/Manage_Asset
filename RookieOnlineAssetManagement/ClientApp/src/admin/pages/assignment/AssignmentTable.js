import React from "react";
import { useTable, usePagination } from "react-table";
import { Link } from "react-router-dom";

import "./Assignment.css";

const AssignmentsTable = ({
  columns,
  data,
  loading,
  onSearch = () => {},
  onFilterState = () => {},
  onClickAssignment = () => {},
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, usePagination);

  return (
    <div>
      <div className="table__view">
        <h2>Manage Assignment</h2>
        <div className="table__view--search">
          <div className="search">
            <div className="filter-state">
              <input
                type="text"
                placeholder="State"
                onChange={(e) => onFilterState(e.target.value)}
              />
              <i className="bx bx-filter-alt" />
            </div>
            {/* <div className="state-options">
              <label htmlFor="accepted" className="state-input">
                <input id="accepted" type="radio" name="filterState" />
                <div id="accepted">Accepted</div>
              </label>
              <label htmlFor="accepted" className="state-input">
                <input id="accepted" type="radio" name="filterState" />
                <div id="accepted">Accepted</div>
              </label>
              <label htmlFor="accepted" className="state-input">
                <input id="accepted" type="radio" name="filterState" />
                <div id="accepted">Accepted</div>
              </label>
              <label htmlFor="accepted" className="state-input">
                <input id="accepted" type="radio" name="filterState" />
                <div id="accepted">Accepted</div>
              </label>
              <label htmlFor="accepted" className="state-input">
                <input id="accepted" type="radio" name="filterState" />
                <div id="accepted">Accepted</div>
              </label>
            </div> */}
          </div>
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
                {rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      id="tr-hover"
                      {...row.getRowProps()}
                      onClick={(e) => {
                        if (!e.target.closest("#Actions")) {
                          onClickAssignment(row.original);
                        }
                      }}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td
                            id={cell.column.Header}
                            {...cell.getCellProps()}
                          >
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

export default AssignmentsTable;
