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
                                    <DeliveryProfessionalListComponent
                                        searchMentee={searchMentee}
                                        setSearchMentee={setSearchMentee}
                                        searchMenteeHandler={searchMenteeHandler}
                                        searchResults={searchResults}
                                        handleAddSpecificMentee={handleAddSpecificMentee}
                                    />
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-12">
                                    <MenteeListComponent
                                        mentees={mentees}
                                        handleMenteeRecordsModal={handleMenteeRecordsModal}
                                        handleDeleteMentee={handleDeleteMentee}
                                    />
                                </div>
                            </div>
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