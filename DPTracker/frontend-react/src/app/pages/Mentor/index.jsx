import { useState } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from '../../../authConfig';
import { ApiService } from '../../services/ApiService';
import { RecordsModalComponent } from '../../components/RecordsModalComponent';
import { MenteeListComponent } from '../../components/MenteeListComponent';
import { DeliveryProfessionalListComponent } from '../../components/DeliveryProfessionalListComponent';

export function MentorPage() {
  const recordsModalId = 'recordsModal';
  const [token, setToken] = useState();
  const [mentor, setMentor] = useState("----");
  const [mentees, setMentees] = useState([]);
  const [deliveryProfessionals, setDeliveryProfessionals] = useState([]);
  const { instance } = useMsal();

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
          if (response.hasOwnProperty('displayName')) {
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

  function handleMenteeRecordsModal(menteeId) {
    //setModalData({ type, person });
    const modal = new bootstrap.Modal(document.getElementById(recordsModalId));
    modal.show();
  }

  async function searchTermHandler(searchTerm) {
    if (token !== null && (searchTerm ?? '').length >= 3) {
      ApiService.searchDeliveryProfessionals(token, searchTerm).then(response => {
        const dp = Array.from(deliveryProfessionals).concat(response).reduce((acc, obj) => {
          if (!acc.some(o => o.id === obj.di)) {
            acc.push(obj);
          }
          return acc;
        }, []);
        setDeliveryProfessionals(dp);
      });
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
              <MenteeListComponent mentees={mentees} handleMenteeRecordsModal={handleMenteeRecordsModal} />
              <DeliveryProfessionalListComponent deliveryProfessionals={deliveryProfessionals} searchTermHandler={searchTermHandler} />
            </>
          )}
        </div>
      </AuthenticatedTemplate>

      <RecordsModalComponent modalId={recordsModalId} />
    </div>
  );
}
