function ChangePasswordModal({
  onCreateRequestForReturning,
  handleShowPassword,
}) {
  return (
    <div className='confirm-modal'>
      <div className='confirm-modal-body'>
        <div>Change password</div>
        <p>
          This is the first time you login. You need to change your password to
          continue.
        </p>
      </div>
      <div className='confirm-modal-footer'>
        <div
          className='confirm-btn delete'
          onClick={onCreateRequestForReturning}
        >
          Yes
        </div>
        <div className='confirm-btn cancel' onClick={handleShowPassword}>
          No
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
