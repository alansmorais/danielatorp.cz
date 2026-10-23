import React, { useEffect } from 'react';
import { ModalState } from '../types';

interface ModalProps {
  modal: ModalState;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ modal, onClose }) => {
  useEffect(() => {
    if (modal.isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [modal.isOpen, onClose]);

  if (!modal.isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card" role="dialog" aria-modal="true">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Zavřít"
        >
          &times;
        </button>
        {modal.tag && <span className="modal-tag">{modal.tag}</span>}
        <h3 className="modal-title">{modal.title}</h3>
        <div className="modal-body">
          {typeof modal.content === 'string' ? (
            <div style={{ whiteSpace: 'pre-line' }}>{modal.content}</div>
          ) : (
            modal.content
          )}
        </div>
        <div className="modal-btn-row">
          <button type="button" className="button" onClick={onClose}>
            Zavřít
          </button>
          {modal.onAction && (
            <button
              type="button"
              className="button primary"
              onClick={() => {
                modal.onAction?.();
                onClose();
              }}
            >
              {modal.actionText || 'Mám zájem / Zeptat se'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
