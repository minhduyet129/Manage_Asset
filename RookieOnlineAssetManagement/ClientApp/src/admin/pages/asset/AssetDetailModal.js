function AssetDetailModal({ closeModal, asset }) {
  const handleState = (value) => {
    if (value === 0) return "Available";
    if (value === 1) return "Waiting For Approval";
    if (value === 2) return "Not Available";
    if (value === 3) return "Assigned";
    if (value === 4) return "Waiting For Recycling";
    if (value === 5) return "Recycled";
    return null;
  };
console.log(asset)
  return (
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
          <div className='row-title'>State</div>
          <div className='row-value'>{handleState(asset.state)}</div>
        </div>
        <div className='body-row'>
          <div className='row-title'>History of Assignment</div>
          <div className='row-value'>{asset.assignments}</div>
        </div>
        {/* <div className='body-row'>
          <div className='row-title'>Location</div>
          <div className='row-value'>{user.location}</div>
        </div> */}
      </div>
    </div>
  );
}

export default AssetDetailModal;
