
export function RecordsModalComponent({modalId}) {

    return (
        <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby="actionModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`${modalId}Label`}>Delivery Professional Records</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              I am empty
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    );
}