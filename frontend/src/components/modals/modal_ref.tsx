import React from 'react';
import styles from './modal_ref.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalRef: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} // Предотвращение закрытия при клике внутри окна
      >
        <h2>WIP</h2>
      </div>
    </div>
  );
};
