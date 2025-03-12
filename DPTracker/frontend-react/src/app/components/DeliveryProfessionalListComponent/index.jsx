import React from 'react';

export function DeliveryProfessionalListComponent({searchResults, searchMentee, handleAddSpecificMentee, onSearchChange}) {
    return (
        <div className="card">
            <div className="card-header">
                <h4>Add New Mentee</h4>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search for delivery professionals..."
                            value={searchMentee}
                            onChange={onSearchChange}
                        />
                    </div>
                </div>

                {searchResults.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {searchResults.map(prof => (
                                <tr key={prof.id}>
                                    <td>{prof.displayName}</td>
                                    <td>{prof.emailAddress || prof.email}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleAddSpecificMentee(prof.id)}
                                        >
                                            Add as Mentee
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {searchMentee.length >= 2 && searchResults.length === 0 && (
                    <div className="alert alert-info">
                        No delivery professionals found or all are already your mentees
                    </div>
                )}
            </div>
        </div>
    );
}