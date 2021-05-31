import { Link } from 'react-router-dom';
import { useTable } from 'react-table';

function AssetsTable({ columns, data, loading }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  return (
    <div>
      <div className='table__view'>
        <h2>Manage Asset</h2>
        <div className='table__view--search'>
          <form className='search'>
            <label />
            <input type='text' placeholder='State' />
            <i className='bx bx-filter-alt' />
          </form>
          <form className='search'>
            <label />
            <input type='text' placeholder='Category' />
            <i className='bx bx-filter-alt' />
          </form>
          <form className='search'>
            <label />
            <input type='text' placeholder='Name' />
            <i className='bx bx-search' />
          </form>
          <form className='search'>
            <label />
            <input type='text' placeholder='Asset Code' />
            <i className='bx bx-search' />
          </form>
          <Link to='/admin/assets/create'>
            <button href='assets' className='btn'>
              Create New Asset
            </button>
          </Link>
        </div>
        <div>
          {loading ? (
            <span className='spinner'>
              <i className='fas fa-spinner fa-spin'></i>
            </span>
          ) : (
            <table {...getTableProps()}>
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
              )
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssetsTable;
