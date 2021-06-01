function DeleteModal({ closeDeleteModal, onDeleteAssignment }) {
  return (
    <div className='confirm-modal'>
      <div className='confirm-close-btn' onClick={closeDeleteModal}>
        <i className='fas fa-times'></i>
      </div>
      <div className='confirm-modal-body'>
        <div>Are you sure delete this assignment?</div>
        <p>If you delete the file you can't recover it.</p>
      </div>
      <div className='confirm-modal-footer'>
        <div className='confirm-btn cancel' onClick={closeDeleteModal}>
          Cancel
        </div>
        <div className='confirm-btn delete' onClick={onDeleteAssignment}>
          Delete
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
