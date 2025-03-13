import 'bootstrap-icons/font/bootstrap-icons.css';

export function MenteeListComponent({
                                       mentees,
                                       handleMenteeRecordsModal,
                                       handleDeleteMentee
                                   }) {
    return (
        <div className="card">
            <div className="card-header">
                <h4>Current Mentees</h4>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {mentees.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center">No mentees assigned</td>
                            </tr>
                        ) : (
                            mentees.map(mentee => (
                                <tr
                                    key={mentee.deliveryProfessionalId}
                                    onClick={() => handleMenteeRecordsModal(mentee.deliveryProfessionalId)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <td>{mentee.displayName}</td>
                                    <td>{mentee.email}</td>
                                    <td onClick={(e) => e.stopPropagation()} className="text-center" style={{width: '50px'}}>
                                        <i
                                            className="bi bi-trash text-danger"
                                            style={{cursor: 'pointer', fontSize: '1.50em'}}
                                            onClick={() => handleDeleteMentee(mentee.deliveryProfessionalId)}
                                            title="Remove mentee"
                                        ></i>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}