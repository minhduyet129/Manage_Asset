function CreateReturningRequestModal({
  onCloseModal,
  onCreateRequestForReturning,
}) {
  return (
    <div className='confirm-modal'>
      <div className='confirm-close-btn' onClick={onCloseModal}>
        <i className='fas fa-times'></i>
      </div>
      <div className='confirm-modal-body'>
        <div>Are you sure?</div>
        <p>Create a returning request for the asset?</p>
      </div>
      <div className='confirm-modal-footer'>
        <div
          className='confirm-btn delete'
          onClick={onCreateRequestForReturning}
        >
          Yes
        </div>
        <div className='confirm-btn cancel' onClick={onCloseModal}>
          No
        </div>
      </div>
    </div>
  );
}

export default CreateReturningRequestModal;
