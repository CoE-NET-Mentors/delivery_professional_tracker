import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { NavigationComponent } from "./components/NavigationComponent";
import { MsalProvider } from '@azure/msal-react';
import { AboutPage } from "./pages/About";
import { HomePage } from "./pages/Home";
import { MentorPage } from "./pages/Mentor";
import { DeliveryProfessionalPage } from "./pages/DP";

const createAppRouter = ({ msalInstance }) => createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {                
                path: "mentor",              
                element: <MentorPage />
            },
            {
                path: "dp",              
                element: <DeliveryProfessionalPage />
            },
            {
                path: "about",
                element: <AboutPage />
            }
        ]
    }
]);

function Layout() {
    return (
        <div className="container-fluid">
            <NavigationComponent />
            <Outlet />
        </div>
    );
}

export function App({ instance }) {
    return (
        <MsalProvider instance={instance}>
            <RouterProvider router={createAppRouter({ instance })} />
        </MsalProvider>
    );
}
