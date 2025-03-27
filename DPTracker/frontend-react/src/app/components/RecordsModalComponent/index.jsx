import {useState, useEffect} from 'react';
import {RecordType} from '../../constants/recordTypes';
import {ApiService} from "../../services/ApiService.js";
import 'bootstrap-icons/font/bootstrap-icons.css';

function formatRecordType(recordType) {
    return recordType.replace(/([A-Z])/g, ' $1').trim();
}

function formatDateUS(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US');
}

export function RecordsModalComponent({modalId, records: initialRecords, menteeId, accessToken, deliveryProfessionals }) {
    const [records, setRecords] = useState(initialRecords || []);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        createdBy: '',
        dateAssigned: '',
        dateCompleted: '',
        recordType: '',
        recordNotes: [{note: '', createdAt: new Date().toISOString()}]
    });

    useEffect(() => {
        setRecords(initialRecords || []);
    }, [initialRecords]);

    useEffect(() => {
        const modalElement = document.getElementById(modalId);
        const handleModalHidden = () => setSelectedRowId(null);

        modalElement.addEventListener('hidden.bs.modal', handleModalHidden);
        return () => {
            modalElement.removeEventListener('hidden.bs.modal', handleModalHidden);
        };
    }, [modalId]);

    const handleAddNewRecord = async () => {
        try {
            const filteredNotes = editFormData.recordNotes.filter(note => note.note?.trim());

            const formattedRecord = {
                createdBy: editFormData.createdBy,
                dateAssigned: new Date(editFormData.dateAssigned).toISOString(),
                dateCompleted: editFormData.dateCompleted ? new Date(editFormData.dateCompleted).toISOString() : null,
                recordTypeId: parseInt(editFormData.recordType),
                recordNotes: filteredNotes.map(note => ({
                    deliveryProfessionalRecordId: '00000000-0000-0000-0000-000000000000',
                    createdAt: null,
                    createdBy: editFormData.createdBy,
                    note: note.note.trim()
                }))
            };

            const updatedRecords = await ApiService.addMenteeRecord(accessToken, menteeId, formattedRecord);
            if (updatedRecords) {
                setRecords(updatedRecords);
                setSelectedRowId(null);
            } else {
                const newRecord = {
                    id: Date.now().toString(),
                    ...editFormData,
                    recordNotes: filteredNotes
                };
                setRecords([...records, newRecord]);
            }
            resetEditForm();
        } catch (error) {
            console.error("Error adding record:", error);
        }
    };

    const handleDeleteRecord = async (recordId) => {
        try {
            await ApiService.deleteMenteeRecord(accessToken, menteeId, recordId);
            const updatedRecords = await ApiService.fetchMenteeRecords(accessToken, menteeId);
            setRecords(updatedRecords || []);
            setSelectedRowId(null);
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    const handleRowClick = (record) => {
        setSelectedRowId(record.id);
        setEditFormData({
            createdBy: record.createdBy,
            dateAssigned: new Date(record.dateAssigned).toISOString().slice(0, 16),
            dateCompleted: record.dateCompleted ? new Date(record.dateCompleted).toISOString().slice(0, 16) : '',
            recordType: record.recordType,
            recordNotes: record.recordNotes || []
        });
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleNoteChange = (index, field, value) => {
        const updatedNotes = [...editFormData.recordNotes];
        updatedNotes[index] = {
            ...updatedNotes[index],
            [field]: value
        };
        setEditFormData({
            ...editFormData,
            recordNotes: updatedNotes
        });
    };

    const handleSaveChanges = async () => {
        if (selectedRowId) {
            try {
                const filteredNotes = editFormData.recordNotes.filter(note => note.note?.trim());

                const formattedRecord = {
                    id: selectedRowId,
                    createdBy: editFormData.createdBy,
                    dateAssigned: new Date(editFormData.dateAssigned).toISOString(),
                    dateCompleted: editFormData.dateCompleted ? new Date(editFormData.dateCompleted).toISOString() : null,
                    recordTypeId: parseInt(editFormData.recordType),
                    recordNotes: filteredNotes.map(note => ({
                        deliveryProfessionalRecordId: note.deliveryProfessionalRecordId || selectedRowId,
                        createdAt: new Date(note.createdAt).toISOString(),
                        createdBy: editFormData.createdBy,
                        note: note.note.trim()
                    }))
                };

                const updatedRecords = await ApiService.updateMenteeRecord(accessToken, menteeId, selectedRowId, formattedRecord);
                if (updatedRecords) {
                    setRecords(updatedRecords);
                } else {
                    setRecords(records.map(record =>
                        record.id === selectedRowId ? {...record, ...editFormData, recordNotes: filteredNotes} : record
                    ));
                }
                setSelectedRowId(null);
                resetEditForm();
            } catch (error) {
                console.error("Error updating record:", error);
            }
        }
    };

    const resetEditForm = () => {
        setEditFormData({
            createdBy: '',
            dateAssigned: '',
            dateCompleted: '',
            recordType: '',
            recordNotes: [{note: '', createdAt: new Date().toISOString()}]
        });
    };

    const addNewNote = () => {
        setEditFormData({
            ...editFormData,
            recordNotes: [
                ...editFormData.recordNotes,
                {note: '', createdAt: new Date().toISOString()}
            ]
        });
    };

    const removeNote = (index) => {
        const updatedNotes = [...editFormData.recordNotes];
        updatedNotes.splice(index, 1);
        setEditFormData({
            ...editFormData,
            recordNotes: updatedNotes
        });
    };

    return (
        <div>
            <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby="recordsModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="recordsModalLabel">Record Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3 d-flex justify-content-between">
                                <div>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            resetEditForm();
                                            setSelectedRowId('new');
                                        }}
                                    >
                                        New Record
                                    </button>
                                </div>
                                {selectedRowId && selectedRowId !== 'new' && (
                                    <div>
                                        <button className="btn btn-danger"
                                                onClick={() => handleDeleteRecord(selectedRowId)}>
                                            Delete Record
                                        </button>
                                    </div>
                                )}
                            </div>

                            {selectedRowId === 'new' && (
                                <div className="edit-form mb-3 p-3 border rounded">
                                    <h6>New Record</h6>
                                    <div className="row mb-2">
                                        <div className="col-md-3">
                                            <label className="form-label">Created By</label>
                                            <select
                                                className="form-control"
                                                name="createdBy"
                                                value={editFormData.createdBy}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select User</option>
                                                {deliveryProfessionals.map(prof => (
                                                    <option key={prof.id} value={prof.id}>
                                                        {prof.displayName} ({prof.emailAddress || prof.email})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Date Assigned</label>
                                            <input
                                                type="datetime-local"
                                                className="form-control"
                                                name="dateAssigned"
                                                value={editFormData.dateAssigned}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Date Completed</label>
                                            <input
                                                type="datetime-local"
                                                className="form-control"
                                                name="dateCompleted"
                                                value={editFormData.dateCompleted}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Record Type</label>
                                            <select
                                                className="form-control"
                                                name="recordType"
                                                value={editFormData.recordType}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Type</option>
                                                {Object.keys(RecordType).map(key => (
                                                    <option key={key} value={RecordType[key]}>
                                                        {formatRecordType(key)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <h6 className="mt-3">Notes</h6>
                                    {editFormData.recordNotes.map((note, idx) => (
                                        <div key={idx} className="row mb-2 align-items-center">
                                            <div className="col-md-11">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={note.note}
                                                    onChange={(e) => handleNoteChange(idx, 'note', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-1 d-flex align-items-center justify-content-center">
                                                <i
                                                    className="bi bi-trash text-danger"
                                                    style={{cursor: 'pointer', fontSize: '1.50em'}}
                                                    onClick={() => removeNote(idx)}
                                                    title="Remove note"
                                                ></i>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mt-2">
                                        <i
                                            className="bi bi-plus-circle text-info"
                                            style={{cursor: 'pointer', fontSize: '1.50em'}}
                                            onClick={addNewNote}
                                            title="Add Note"
                                        ></i>
                                    </div>

                                    <div className="mt-3 d-flex justify-content-end">
                                        <button type="button" className="btn btn-primary me-2"
                                                onClick={handleAddNewRecord}>
                                            Save Record
                                        </button>
                                        <button type="button" className="btn btn-secondary"
                                                onClick={() => setSelectedRowId(null)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedRowId && selectedRowId !== 'new' && (
                                <div className="edit-form mb-3 p-3 border rounded">
                                    <h6>Edit Record</h6>
                                    <div className="row mb-2">
                                        <div className="col-md-3">
                                            <label className="form-label">Created By</label>
                                            <select
                                                className="form-control"
                                                name="createdBy"
                                                value={editFormData.createdBy}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select User</option>
                                                {deliveryProfessionals.map(prof => (
                                                    <option key={prof.id} value={prof.id}>
                                                        {prof.displayName} ({prof.emailAddress || prof.email})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Date Assigned</label>
                                            <input
                                                type="datetime-local"
                                                className="form-control"
                                                name="dateAssigned"
                                                value={editFormData.dateAssigned}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Date Completed</label>
                                            <input
                                                type="datetime-local"
                                                className="form-control"
                                                name="dateCompleted"
                                                value={editFormData.dateCompleted}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Record Type</label>
                                            <select
                                                className="form-control"
                                                name="recordType"
                                                value={editFormData.recordType}
                                                onChange={handleInputChange}
                                            >
                                                {Object.keys(RecordType).map(key => (
                                                    <option key={key} value={RecordType[key]}>
                                                        {formatRecordType(key)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <h6 className="mt-3">Notes</h6>
                                    {editFormData.recordNotes.map((note, idx) => (
                                        <div key={idx} className="row mb-2 align-items-center">
                                            <div className="col-md-11">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={note.note}
                                                    onChange={(e) => handleNoteChange(idx, 'note', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-1 d-flex align-items-center justify-content-center">
                                                <i
                                                    className="bi bi-trash text-danger"
                                                    style={{cursor: 'pointer', fontSize: '1.5rem' }}
                                                    onClick={() => removeNote(idx)}
                                                    title="Remove note"
                                                ></i>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mt-2">
                                        <i
                                            className="bi bi-plus-circle text-info"
                                            style={{cursor: 'pointer', fontSize: '1.5rem'}}
                                            onClick={addNewNote}
                                            title="Add Note"
                                        ></i>
                                    </div>

                                    <div className="mt-3">
                                        <button type="button" className="btn btn-primary me-2"
                                                onClick={handleSaveChanges}>
                                            Save Changes
                                        </button>
                                        <button type="button" className="btn btn-secondary"
                                                onClick={() => setSelectedRowId(null)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead className="table-light">
                                    <tr>
                                        <th>Created By</th>
                                        <th>Date Assigned</th>
                                        <th>Date Completed</th>
                                        <th>Record Type</th>
                                        <th>Notes Count</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {records.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center">No records available</td>
                                        </tr>
                                    ) : (
                                        records.map(record => (
                                            <tr
                                                key={record.id}
                                                onClick={() => handleRowClick(record)}
                                                className={selectedRowId === record.id ? 'table-primary' : ''}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <td>{deliveryProfessionals.find(dp => dp.id === record.createdBy)?.displayName || record.createdBy}</td>
                                                <td>{formatDateUS(record.dateAssigned)}</td>
                                                <td>{formatDateUS(record.dateCompleted)}</td>
                                                <td>{formatRecordType(Object.keys(RecordType).find(key => RecordType[key] === record.recordType))}</td>
                                                <td>{record.recordNotes?.length || 0}</td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}