import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Link, useLocation } from "react-router-dom";
import { loginRequest } from "../../../authConfig";
import unosquarelogo from "../../../assets/unosquare.webp";
export function NavigationComponent() {
    const location = useLocation();
    const { instance } = useMsal();
    function isLinkActive(path) {
        return location.pathname === path;
    }

    let activeAccount;

    if (instance) {
        activeAccount = instance.getActiveAccount();
    }

    const handleLoginPopup = () => {
        /**
         * When using popup and silent APIs, we recommend setting the redirectUri to a blank page or a page
         * that does not implement MSAL. Keep in mind that all redirect routes must be registered with the application
         * For more information, please follow this link: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/login-user.md#redirecturi-considerations
         */
        instance
            .loginPopup({
                ...loginRequest,
                redirectUri: '/',
            })
            .catch((error) => console.warn(error));
    };
 

    const handleLogoutPopup = () => {
        instance
            .logoutPopup({
                mainWindowRedirectUri: '/', // redirects the top level app after logout
                account: instance.getActiveAccount(),
            })
            .catch((error) => console.log(error));
    };

    return (
        <nav className="navbar navbar-expand-md bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src={unosquarelogo} alt="Logo" width="150" height="50" />
                    DP Tracker
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navBarMain" aria-controls="navBarMain" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navBarMain">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isLinkActive("/") ? "active" : ""}`}
                                aria-current="page"
                                to="/"
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isLinkActive("/about") ? "active" : ""}`}
                                to="/about"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <AuthenticatedTemplate>
                                <button type="button" className="btn btn-nav" onClick={handleLogoutPopup}>Logout</button>
                            </AuthenticatedTemplate>
                            <UnauthenticatedTemplate>
                                <button type="button" className="btn btn-nav" onClick={handleLoginPopup}>Login</button>
                            </UnauthenticatedTemplate>
                        </li>
                        <AuthenticatedTemplate>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isLinkActive("/mentor") ? "active" : ""}`}
                                to="/mentor"
                            >
                                Mentor
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${isLinkActive("/dp") ? "active" : ""}`}
                                to="/dp"
                            >
                                D P
                            </Link>
                        </li>
                        </AuthenticatedTemplate>
                        <li className="nav-item">
                            <a href="https://dev.azure.com/UnoquareCSharpCoE" rel="noreferrer" target="_blank" className="nav-link">🌐 Azure DevOps</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}