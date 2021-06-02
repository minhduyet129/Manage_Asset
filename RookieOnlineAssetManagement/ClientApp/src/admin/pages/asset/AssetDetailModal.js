import { format } from 'date-fns';

function AssetDetailModal({ closeModal, asset, assetHistories }) {
  const handleState = (value) => {
    if (value === 0) return 'Available';
    if (value === 1) return 'Waiting For Approval';
    if (value === 2) return 'Not Available';
    if (value === 3) return 'Assigned';
    if (value === 4) return 'Waiting For Recycling';
    if (value === 5) return 'Recycled';
    return null;
  };

  const handleAssignState = (value) => {
    if (value === 0) return 'Waiting For Approval';
    if (value === 1) return 'Accepted';
    if (value === 2) return 'Declined';
    if (value === 3) return 'Assigned';
    if (value === 4) return 'Waiting For Returning';
    if (value === 5) return 'Returned';
    return null;
  };
  return (
    <>
      {assetHistories && (
        <div className='modal-wrapper'>
          <div className='modal-close-btn' onClick={closeModal}>
            <i className='fas fa-times'></i>
          </div>
          <div className='modal-header'>
            <span>Asset Details</span>
          </div>
          <div className='modal-body'>
            <div className='body-row'>
              <div className='row-title'>Asset Code</div>
              <div className='row-value'>{asset.assetCode}</div>
            </div>
            <div className='body-row'>
              <div className='row-title'>Asset Name</div>
              <div className='row-value'>{asset.assetName}</div>
            </div>
            <div className='body-row'>
              <div className='row-title'>Category Name</div>
              <div className='row-value'>{asset.categoryName}</div>
            </div>
            <div className='body-row'>
              <div className='row-title'>Asset State</div>
              <div className='row-value'>{handleState(asset.state)}</div>
            </div>
            <div className='body-row history-row'>
              <div className='row-title history-title'>Asset History</div>
              <div className='row-value0 history-value'>
                <table>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Assign By</th>
                      <th>Assign To</th>
                      <th>Assign Date</th>
                      <th>Assign State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetHistories.map((item, index) => (
                      <>
                        {item.assignBy ? (
                          <tr>
                          <td>{index + 1}</td>
                          <td>{item.assignBy}</td>
                          <td>{item.assignTo}</td>
                          <td>
                            {format(
                              new Date(item.assignDate || null),
                              'dd/MM/yyyy'
                            )}
                          </td>
                          <td>{handleAssignState(item.assignState)}</td>
                        </tr>
                        ) : (
                          <tr className="table-no-history">No History</tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* <div className='body-row'>
            <div className='row-title'>Assign Date</div>
            <div className='row-value'>{asset.assignDate} </div>
          </div>
          <div className='body-row'>
            <div className='row-title'>Assign To</div>
            <div className='row-value'>{asset.assignTo}</div>
          </div>
          <div className='body-row'>
            <div className='row-title'>Assign By</div>
            <div className='row-value'>{asset.assignBy}</div>
          </div>
          <div className='body-row'>
            <div className='row-title'>Assign State</div>
            <div className='row-value'>{asset.assignState}</div>
          </div> */}
            {/* <div className='body-row'>
            <div className='row-title'>Location</div>
            <div className='row-value'>{user.location}</div>
          </div> */}
          </div>
        </div>
      )}
    </>
  );
}

export default AssetDetailModal;
