import React from 'react'
import { useTable } from 'react-table';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

function ReportTable({columns, data , loading}) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
    return (
        <div>

      <div className='table__view'>
        <h2>Report</h2>
        <div className='table__view--search'>
        <ReactHTMLTableToExcel
                    className="btn"
                    table="table"
                    filename="tablexls"
                    sheet="Sheet"
                    buttonText="Export as Excel"/>
        </div>
        <div>
          <table id="table" {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {loading ? (
              <div className='spinner'>
                <i class='fas fa-spinner fa-spin'></i>
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
                            {cell.render('Cell')}
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
    )
}

export default ReportTable
