import { useState } from 'react';
import Modal from 'react-modal';
import LayoutUser from '../layout/LayoutUser';
import UserHomeTable from './UserHomeTable';
import CreateReturningRequestModal from './CreateReturningRequestModal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const UserHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const onCreateRequestForReturning = () => {};

  return (
    <LayoutUser>
      <div className='table__view'>
        {/* <UserHomeTable /> */}
        <Modal isOpen={isModalOpen} style={customStyles}>
          <CreateReturningRequestModal
            onCloseModal={onCloseModal}
            onCreateRequestForReturning={onCreateRequestForReturning}
          />
        </Modal>
        <h2>Hello User</h2>
      </div>
    </LayoutUser>
  );
};

export default UserHome;
