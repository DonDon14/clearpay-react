import React from 'react';

const LogoutConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn btn-confirm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          border-radius: 10px;
          padding: 20px;
          width: 90%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .modal-actions {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }
        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .btn:hover {
          transition: 0.2s ease;
          transform: scale(1.05);
        }

        .btn-cancel {
          background: #f3f4f6;
          color: #111;
        }
        .btn-confirm {
          background: #ef4444;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default LogoutConfirmationModal;
