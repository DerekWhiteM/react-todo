import { GoogleDriveContext } from "./GoogleDriveContext";
import { useContext } from "react";

export const GoogleDriveIntegration = () => {
  const { isSignedIn, gapiLoaded, gisLoaded, isLoading, savedFiles, handleSignIn, handleSignOut, saveStateToDrive, loadStateFromDrive } = useContext(GoogleDriveContext);
  return (
    <div>
      <div className="flex justify-between flex-nowrap text-nowrap items-center gap-2 pb-2">
        <h3 className="text-lg">Google Drive</h3>
        {!isSignedIn ? (
          <button
            onClick={handleSignIn}
            disabled={!gapiLoaded || !gisLoaded}
            className="flex items-center text-sm border border-border px-2 py-1 hover:bg-muted"
          >
            {(!gapiLoaded || !gisLoaded) ? 'Loading...' : 'Sign in with Google'}
          </button>
        ) : (
          <div>
            <div className="flex gap-2">

              <button className="flex items-center text-sm border border-border px-2 py-1 hover:bg-muted" onClick={handleSignOut} disabled={isLoading}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {isSignedIn && (
        <button className="text-sm border border-border px-2 py-1 w-full mt-2 mb-4 hover:bg-muted" onClick={() => saveStateToDrive()} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save State'}
        </button>
      )}


      {savedFiles.length > 0 && (
        <ul>
          {savedFiles.map(file => (
            <li key={file.id}>
              <button className="text-sm border border-border px-2 py-1 w-full mb-4 hover:bg-muted" onClick={() => loadStateFromDrive(file.id)} disabled={isLoading}>
                Load State
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
