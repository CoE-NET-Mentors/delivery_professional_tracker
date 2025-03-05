export function MenteeListComponent({ mentees, handleMenteeRecordsModal }) {
    return (
        <div>
            <h3>Mentees</h3>
            <ul className="list-group">
                {mentees.map(mentee => (
                    <li key={mentee.id} className="list-group-item d-flex justify-content-between">
                        {mentee.displayName}
                        <div>
                            <button className='btn btn-sm btn-info me-2' onClick={() => handleMenteeRecordsModal(mentee.id)}>Edit</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}