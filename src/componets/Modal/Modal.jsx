import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { OverlayStyle, ModalStyle } from './Modal.styled';
import PropTypes from 'prop-types';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ image, tags, onModalClose }) {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  function handleKeyDown(evt) {
    if (evt.code === 'Escape') {
      onModalClose();
    }
  }

  function handleOverlayClick(evt) {
    if (evt.currentTarget === evt.target) {
      onModalClose();
    }
  }

  return createPortal(
    <OverlayStyle onClick={handleOverlayClick}>
      <ModalStyle>
        <img src={image} alt={tags} />
      </ModalStyle>
    </OverlayStyle>,
    modalRoot
  );
}
Modal.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
};
