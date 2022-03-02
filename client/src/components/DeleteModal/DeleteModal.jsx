import React from 'react';
import 'react-responsive-modal/styles.css';
import '../DeleteModal/deleteModal.scss';


function DeleteModal(props) {

     return (
        <div className="modal">
            <h3 className="modal__header">Delete profile?</h3>
            <p className="modal__alert">Please confirm that you'd like to delete your profile. You won't be able to undo this action.</p>
            <div className="modalButton">
                <button onClick={props.closeModal} className="modalButton__cancel">Cancel</button>
                <button onClick={props.delete} className="modalButton__delete">Delete </button>
            </div>
        </div>
    );
};


export default DeleteModal