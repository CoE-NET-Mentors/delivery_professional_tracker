import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
export function HomePage() {
  const { instance } = useMsal();

  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  return (
    <div className="row">
      <div className="col">
        <h2>Welcome</h2>
        <AuthenticatedTemplate>
          <h3>Authenticated</h3>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <h3>You need to login</h3>
        </UnauthenticatedTemplate>
      </div>
    </div>
  );
}
