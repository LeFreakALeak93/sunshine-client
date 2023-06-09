import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = process.env.REACT_APP_API_URL;

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser, setLoading, setLoggedIn, setUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    axios.post(`${API_URL}/auth/login`, requestBody)
      .then((response) => {
        // Request to the server's endpoint `/auth/login` returns a response
        // with the JWT string ->  response.data.authToken
        console.log('JWT token', response.data.authToken);

        storeToken(response.data.authToken);

        axios.get(`${API_URL}/auth/verify`, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } })
          .then((response) => {
            console.log("THIS IS THE RESPONSE: ", response)
            // If the server verifies that the JWT token is valid
            const User = response.data;
            console.log(User)
            // Update store variables
            setLoggedIn(true);
            setLoading(true);
            setUser(User);
            navigate('/profile');
          })
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
      });

  };

  return (
    <div className="login-page login-page--Modified">
      <h1 className="login-heading">Login</h1>

      <form onSubmit={handleLoginSubmit}>
        <label className="input-labels">Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleEmail}
          className="login-input"
          placeholder="Email"
        />

        <label className="input-labels">Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
          className="login-input"
          placeholder="Password"
        />
        <button type="submit" className="login-button-login-page">Login</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p className="no-account-text">Don't have an account yet?</p>
      <Link to={"/signup"}><button className="signup-button-login-page">Sign Up</button></Link>
    </div>
  );
}

export default LoginPage;
