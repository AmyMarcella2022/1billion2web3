import React from 'react';
import useAlertModal from '../../hooks/useAlertModal';
import Modal from '../utils/Modal';

const AlertModal = () => {
  const alertModal = useAlertModal();

  return (
    <Modal
      isOpen={alertModal.isOpen}
      onClose={alertModal.close}
      title={alertModal.title}
      body={alertModal.content}
      disabled={false}
      clear={alertModal.clearModal}
    />
  );
};

export default AlertModal;
