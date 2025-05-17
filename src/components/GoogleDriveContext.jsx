import { createContext, useEffect, useState } from "react";

const CLIENT_ID = "618537968380-pcen9n85vd35jpfkjc9325ehekr4akl9.apps.googleusercontent.com";
const API_KEY = "AIzaSyBw-3FXfjfHA6AxvZySURnQQDhAieqysCY";

const SCOPES = "https://www.googleapis.com/auth/drive.appdata";

export const GoogleDriveContext = createContext({
    isSignedIn: false,
    gapiLoaded: false,
    gisLoaded: false,
    isLoading: false,
    savedFiles: [],
    handleSignIn: () => null,
    handleSignOut: () => null,
    saveStateToDrive: () => null,
    loadStateFromDrive: () => null,
});

export const GoogleDriveContextProvider = ({
    appState,
    setAppState,
    children,
}) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [savedFiles, setSavedFiles] = useState([]);
    const [tokenClient, setTokenClient] = useState(null);
    const [gisLoaded, setGisLoaded] = useState(false);
    const [gapiLoaded, setGapiLoaded] = useState(false);

    useEffect(() => {
        // Load the Google API client library
        const loadGapiScript = () => {
            const script = document.createElement("script");
            script.src = "https://apis.google.com/js/api.js";
            script.async = true;
            script.defer = true;
            script.onload = initializeGapiClient;
            document.body.appendChild(script);
            return () => document.body.removeChild(script);
        };

        // Load the Google Identity Services library
        const loadGisScript = () => {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = initializeGisClient;
            document.body.appendChild(script);
            return () => document.body.removeChild(script);
        };

        const gsiCleanup = loadGisScript();
        const gapiCleanup = loadGapiScript();

        return () => {
            gsiCleanup();
            gapiCleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Periodically refresh access token
    useEffect(() => {
        if (!isSignedIn) return;
        const refreshInterval = setInterval(() => {
            if (tokenClient && isSignedIn) {
                tokenClient.requestAccessToken({ prompt: "" });
            }
        }, 45 * 60 * 1000); // 45 minutes
        return () => clearInterval(refreshInterval);
    }, [isSignedIn, tokenClient]);

    // Handle API calls that might fail due to token expiration
    const handleApiCall = async apiCall => {
        try {
            return await apiCall();
        } catch (error) {
            if (error.status === 401) {
                console.log("Token expired during session, requesting new token");
                localStorage.removeItem("gapi_token");
                // Request new token if token client is available
                if (tokenClient) {
                    tokenClient.requestAccessToken();
                    return null;
                } else {
                    // Force sign out if token client is not available
                    setIsSignedIn(false);
                    setSavedFiles([]);
                }
            }
            throw error;
        }
    };

    // Initialize the Google API client
    const initializeGapiClient = async () => {
        try {
            await new Promise((resolve, reject) => {
                window.gapi.load("client", { callback: resolve, onerror: reject });
            });

            await window.gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
            });

            setGapiLoaded(true);

            // Check if we have a valid token already
            const token = localStorage.getItem("gapi_token");
            if (token) {
                try {
                    // Set the token in gapi
                    window.gapi.client.setToken(JSON.parse(token));

                    // Verify the token is still valid with a simple API call
                    await handleApiCall(() =>
                        window.gapi.client.drive.about.get({ fields: "user" })
                    );

                    // If we reach here without errors, token is valid
                    setIsSignedIn(true);
                    // List files after a short delay to ensure everything is initialized
                    setTimeout(() => listFiles(), 1000);
                } catch (error) {
                    console.log("Stored token is invalid or expired, clearing");
                    localStorage.removeItem("gapi_token");
                    // Token is invalid, will need to sign in again
                }
            }
        } catch (error) {
            console.error("Error initializing GAPI client:", error);
        }
    };

    // Initialize the Google Identity Services client
    const initializeGisClient = () => {
        try {
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: handleTokenResponse,
            });
            setTokenClient(client);
            setGisLoaded(true);
        } catch (error) {
            console.error("Error initializing Google Identity Services:", error);
        }
    };

    // Handle the token response from Google Identity Services
    const handleTokenResponse = tokenResponse => {
        if (tokenResponse && tokenResponse.access_token) {
            setIsSignedIn(true);
            const token = window.gapi.client.getToken();
            localStorage.setItem("gapi_token", JSON.stringify(token));
            listFiles();
        } else {
            setIsSignedIn(false);
            setSavedFiles([]);
        }
    };

    // Handle sign-in button click
    const handleSignIn = () => {
        if (tokenClient) {
            tokenClient.requestAccessToken();
        }
    };

    // Handle sign-out button click
    const handleSignOut = () => {
        if (window.google && window.google.accounts && window.google.accounts.oauth2) {
            window.google.accounts.oauth2.revoke(window.gapi.client.getToken().access_token, () => {
                localStorage.removeItem("gapi_token");
                setIsSignedIn(false);
                setSavedFiles([]);
            });
        }
    };

    // Save app state to Google Drive in the appData folder
    const saveStateToDrive = async (fileName = "todo-app-state.json") => {
        if (!gapiLoaded || !isSignedIn) return;

        setIsLoading(true);

        try {
            // Convert app state to a file
            const stateBlob = new Blob([JSON.stringify(appState)], { type: "application/json" });

            // Create the file metadata
            const metadata = {
                name: fileName,
                mimeType: "application/json",
                parents: ["appDataFolder"],
            };

            // Check if file already exists
            const existingFiles = await handleApiCall(() =>
                window.gapi.client.drive.files.list({
                    spaces: "appDataFolder",
                    q: `name='${fileName}' and trashed=false`,
                    fields: "files(id, name)",
                })
            );

            if (!existingFiles) return;

            if (existingFiles.result.files.length > 0) {
                // Update existing file
                const fileId = existingFiles.result.files[0].id;

                // Get the current token
                const token = window.gapi.client.getToken().access_token;

                try {
                    const response = await fetch(
                        `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
                        {
                            method: "PATCH",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(appState),
                        }
                    );

                    if (response.status === 401) {
                        // Token expired
                        localStorage.removeItem("gapi_token");
                        if (tokenClient) {
                            tokenClient.requestAccessToken({ prompt: "" });
                            return;
                        }
                    } else if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
                    }

                    console.log("File updated successfully");
                } catch (error) {
                    console.error("Error updating file:", error);
                }
            } else {
                // Create new file
                const form = new FormData();
                form.append(
                    "metadata",
                    new Blob([JSON.stringify(metadata)], { type: "application/json" })
                );
                form.append("file", stateBlob);

                const token = window.gapi.client.getToken().access_token;

                try {
                    const response = await fetch(
                        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
                        {
                            method: "POST",
                            headers: new Headers({ Authorization: "Bearer " + token }),
                            body: form,
                        }
                    );

                    if (response.status === 401) {
                        // Token expired
                        localStorage.removeItem("gapi_token");
                        if (tokenClient) {
                            tokenClient.requestAccessToken({ prompt: "" });
                            return;
                        }
                    } else if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }

                    console.log("File created successfully");
                } catch (error) {
                    console.error("Error creating file:", error);
                }
            }

            listFiles();
        } catch (error) {
            console.error("Error saving to Google Drive:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load app state from Google Drive
    const loadStateFromDrive = async fileId => {
        if (!gapiLoaded || !isSignedIn) return;

        setIsLoading(true);

        try {
            // Get the file
            const response = await handleApiCall(() =>
                window.gapi.client.drive.files.get({
                    fileId: fileId,
                    alt: "media",
                })
            );

            if (!response) return;

            // Parse and set app state
            const loadedState = JSON.parse(response.body);
            const { tasks, taskLists } = loadedState;
            if (tasks && taskLists) {
                setAppState(tasks, taskLists);
            }
            console.log("State loaded successfully");
        } catch (error) {
            console.error("Error loading from Google Drive:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // List saved state files
    const listFiles = async () => {
        try {
            const response = await handleApiCall(() =>
                window.gapi.client.drive.files.list({
                    spaces: "appDataFolder",
                    q: "mimeType='application/json'",
                    fields: "files(id, name, modifiedTime)",
                })
            );
            if (!response) return;
            setSavedFiles(response.result.files);
        } catch (error) {
            console.error("Error listing files:", error);
        }
    };

    return (
        <GoogleDriveContext.Provider
            value={{
                isSignedIn,
                gapiLoaded,
                gisLoaded,
                isLoading,
                savedFiles,
                handleSignIn,
                handleSignOut,
                saveStateToDrive,
                loadStateFromDrive,
            }}
        >
            {children}
        </GoogleDriveContext.Provider>
    );
};
