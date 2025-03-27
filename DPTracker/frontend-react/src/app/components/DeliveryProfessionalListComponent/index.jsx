export function DeliveryProfessionalListComponent({
                                                      searchMentee,
                                                      setSearchMentee,
                                                      searchMenteeHandler,
                                                      searchResults,
                                                      handleAddSpecificMentee
                                                  }) {
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
                            onChange={(e) => {
                                setSearchMentee(e.target.value);
                                searchMenteeHandler(e.target.value);
                            }}
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
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {searchResults.map(prof => (
                                <tr key={prof.id}>
                                    <td>{prof.displayName}</td>
                                    <td>{prof.email}</td>
                                    <td className="text-center" style={{width: '50px'}}>
                                        <i
                                            className="bi bi-plus-circle text-success"
                                            style={{cursor: 'pointer', fontSize: '1.50em'}}
                                            onClick={() => handleAddSpecificMentee(prof.id)}
                                            title="Add as Mentee"
                                        ></i>
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