// GoogleCalendarIntegration.js
import React, { useEffect, useState } from 'react';

const CLIENT_ID = '136489118700-01i1ugnukt8ao8pfjcvehnjib3qll8ps.apps.googleusercontent.com';
const API_KEY = 'AIzaSyC1-VWF0gYgZdC7xJN5UD96WD4WdLHcotc';
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];
// For read/write access, change the scope to "https://www.googleapis.com/auth/calendar"
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const GoogleCalendarIntegration = () => {
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log("useEffect: Checking for gapi");
    if (!window.gapi) {
      console.log("gapi not found, loading script...");
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        console.log("gapi script loaded");
        window.gapi.load("client:auth2", initClient);
      };
      script.onerror = () => console.error("Error loading gapi script");
      document.body.appendChild(script);
    } else {
      console.log("gapi already exists, loading client:auth2");
      window.gapi.load("client:auth2", initClient);
    }
  }, []);

  const initClient = () => {
    console.log("Initializing gapi client...");
    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(() => {
      console.log("gapi client initialized");
      const authInstance = window.gapi.auth2.getAuthInstance();
      setIsSignedIn(authInstance.isSignedIn.get());
      authInstance.isSignedIn.listen((signedIn) => {
        console.log("Sign-in state changed:", signedIn);
        setIsSignedIn(signedIn);
      });
      setGapiLoaded(true);
    })
    .catch(error => {
      console.error("Error initializing gapi client:", error);
    });
  };

  const handleSignIn = () => {
    console.log("Signing in...");
    window.gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    console.log("Signing out...");
    window.gapi.auth2.getAuthInstance().signOut();
  };

  const listUpcomingEvents = () => {
    console.log("Listing upcoming events...");
    window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime'
    })
    .then(response => {
      console.log("Events fetched:", response.result.items);
      setEvents(response.result.items);
    })
    .catch(err => console.error("Error listing events:", err));
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", margin: "1rem 0" }}>
      <h2>Google Calendar Integration</h2>
      {gapiLoaded ? (
        isSignedIn ? (
          <div>
            <button onClick={handleSignOut}>Sign Out</button>
            <button onClick={listUpcomingEvents} style={{ marginLeft: "1rem" }}>
              Load Upcoming Events
            </button>
            {events.length > 0 ? (
              <ul>
                {events.map(event => (
                  <li key={event.id}>
                    {event.summary} - {event.start.dateTime || event.start.date}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming events found.</p>
            )}
          </div>
        ) : (
          <button onClick={handleSignIn}>Sign In with Google</button>
        )
      ) : (
        <p>Loading Google API...</p>
      )}
    </div>
  );
};

export default GoogleCalendarIntegration;
