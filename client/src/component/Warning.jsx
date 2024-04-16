import { useAuth0 } from "@auth0/auth0-react";
import "../css/Warning.css";
const Warning = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="warning-container">
      <div className="warning-box">
        <h1>Warning: Login Required</h1>
        <p>You need to log in to access this content.</p>
        <button className="login-btn" onClick={() => loginWithRedirect()}>
          LogIn
        </button>
      </div>
    </div>
  );
};

export default Warning;
