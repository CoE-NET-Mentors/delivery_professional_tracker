import React from "react";
import { createRoot } from "react-dom/client";
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { App } from "./app/App";
import { msalConfig } from './authConfig';
const msalInstance = new PublicClientApplication(msalConfig);
// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getActiveAccount()[0]);
}

// Listen for sign-in event and set active account
msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        const account = event.payload.account;
        msalInstance.setActiveAccount(account);
    }
});

const container = document.getElementById("dptracker");
const root = createRoot(container);
root.render(<React.StrictMode><App instance={msalInstance} /></React.StrictMode>);
