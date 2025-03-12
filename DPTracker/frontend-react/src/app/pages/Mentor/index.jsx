import {useEffect, useState} from 'react';
import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from '@azure/msal-react';
import {loginRequest} from '../../../authConfig';
import {ApiService} from '../../services/ApiService';
import {RecordsModalComponent} from '../../components/RecordsModalComponent';
import {MenteeListComponent} from '../../components/MenteeListComponent';
import {DeliveryProfessionalListComponent} from '../../components/DeliveryProfessionalListComponent';

export function MentorPage() {
    const recordsModalId = 'recordsModal';
    const [token, setToken] = useState();
    const [mentor, setMentor] = useState("----");
    const [mentees, setMentees] = useState([]);
    const [menteeId, setMenteeId] = useState();
    const [selectedMenteeRecords, setSelectedMenteeRecords] = useState();
    const [deliveryProfessionals, setDeliveryProfessionals] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchMentee, setSearchMentee] = useState("");
    const {instance} = useMsal();

    useEffect(() => {
        if (selectedMenteeRecords) {
            console.log('Selected mentee:', selectedMenteeRecords);
        }
    }, [selectedMenteeRecords]);

    async function handleRegister(e) {
        e.preventDefault();
        if (instance) {
            const accessToken = await instance.acquireTokenSilent(loginRequest)
                .then(response => response.accessToken)
                .catch(error => {
                    console.error(error);
                    return null;
                });
            if (accessToken !== null) {
                ApiService.registerMentor(accessToken).then(response => {
                    if (Object.prototype.hasOwnProperty.call(response, 'displayName')) {
                        const displayName = response.displayName;
                        ApiService.fetchMentees(accessToken).then(response => {
                            setToken(accessToken);
                            setMentor(displayName);
                            setMentees(response.mentees);
                            setDeliveryProfessionals(response.deliveryProfessionals);
                        });
                    }
                });
            }
        }
    }

    async function handleMenteeRecordsModal(menteeId) {
      if (token !== null) {
        setMenteeId(menteeId);

        try {
          const response = await ApiService.fetchMenteeRecords(token, menteeId);
          setSelectedMenteeRecords(response || []);

          const modal = new bootstrap.Modal(document.getElementById(recordsModalId));
          modal.show();
        } catch (error) {
          console.error('Error fetching mentee records:', error);
          setSelectedMenteeRecords([]);
          const modal = new bootstrap.Modal(document.getElementById(recordsModalId));
          modal.show();
        }
      }
    }

    async function searchTermHandler(searchTerm) {
        if (token !== null && (searchTerm ?? '').length >= 3) {
            const response = await ApiService.searchDeliveryProfessionals(token, searchTerm);
            const uniqueDeliveryProfessionals = response.reduce((acc, obj) => {
                if (!acc.some(o => o.id === obj.id)) {
                    acc.push(obj);
                }
                return acc;
            }, []);
            setDeliveryProfessionals(uniqueDeliveryProfessionals);
        }
    }

    async function searchMenteeHandler(searchTerm) {
        if (token !== null && searchTerm.length >= 2) {
            const response = await ApiService.searchDeliveryProfessionals(token, searchTerm);

            const filteredResults = response.filter(prof =>
                !mentees.some(mentee => mentee.id === prof.id)
            );

            setSearchResults(filteredResults);
        } else {
            setSearchResults([]);
        }
    }

    async function handleAddSpecificMentee(menteeId) {
        try {
            const response = await ApiService.addMenteeToMentor(token, menteeId);
            if (response) {
                const updatedMenteesResponse = await ApiService.fetchMentees(token);
                setMentees(updatedMenteesResponse.mentees);
                setSearchMentee("");
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error adding mentee to mentor:', error);
            alert("Failed to add mentee. Please try again.");
        }
    }

    async function handleDeleteMentee(menteeId) {
        if (window.confirm("Are you sure you want to remove this mentee?")) {
            try {
                const response = await ApiService.deleteMentee(token, menteeId);
                if (response) {
                    const updatedMenteesResponse = await ApiService.fetchMentees(token);
                    setMentees(updatedMenteesResponse.mentees);
                }
            } catch (error) {
                console.error('Error deleting mentee:', error);
            }
        }
    }

    return (
        <div className="row">
            <UnauthenticatedTemplate>
                <div className="col">
                    <h3>You need to login</h3>
                </div>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <div className="col">
                    <h2>Welcome to the mentor dashboard <small>{mentor}</small></h2>
                    {mentor === '----' ? (
                        <button type='button' className='btn btn-primary' onClick={handleRegister}>
                            Register / Verify as mentor
                        </button>
                    ) : (
                        <>
                            <div className="row mb-4">
                                <div className="col-12">
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
                                                            <th>Action</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {searchResults.map(prof => (
                                                            <tr key={prof.id}>
                                                                <td>{prof.displayName}</td>
                                                                <td>{prof.email}</td>
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
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-12">
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
                                                        <th>Actions</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {mentees.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="3" className="text-center">No mentees
                                                                assigned
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        mentees.map(mentee => (
                                                            <tr key={mentee.deliveryProfessionalId}>
                                                                <td>{mentee.displayName}</td>
                                                                <td>{mentee.emailAddress}</td>
                                                                <td>
                                                                    <div className="btn-group">
                                                                        <button
                                                                            className="btn btn-sm btn-info me-1"
                                                                            onClick={() => handleMenteeRecordsModal(mentee.deliveryProfessionalId)}
                                                                        >
                                                                            View Records
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm btn-danger"
                                                                            onClick={() => handleDeleteMentee(mentee.deliveryProfessionalId)}
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*<MenteeListComponent
                                mentees={mentees}
                                handleMenteeRecordsModal={handleMenteeRecordsModal}
                            />*/}

                            {/*<DeliveryProfessionalListComponent
                                deliveryProfessionals={deliveryProfessionals}
                                searchTermHandler={searchTermHandler}
                                fetchMenteeRecords={handleMenteeRecordsModal}
                            />*/}
                            <RecordsModalComponent
                                modalId={recordsModalId}
                                records={selectedMenteeRecords}
                                accessToken={token}
                                menteeId={menteeId}
                                deliveryProfessionals={deliveryProfessionals}
                            />
                        </>
                    )}
                </div>
            </AuthenticatedTemplate>
        </div>
    );
}