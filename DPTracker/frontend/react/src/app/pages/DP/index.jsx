import { useState, useEffect } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from "../../../authConfig";
import { ApiService } from '../../services/ApiService';

export function DeliveryProfessionalPage() {
  const [deliveryProfessionals, setDeliveryProfessionals] = useState([]);
  const { instance } = useMsal();
  useEffect(() => {

  }, []);

  return (
    <div className="row">
      <UnauthenticatedTemplate>
        <div className="col">
          <h3>You need to login</h3>
        </div>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <div className="col">
          <h2>Welcome to the delivery professional tracker</h2>
        </div>
      </AuthenticatedTemplate>
    </div>
  );
}
