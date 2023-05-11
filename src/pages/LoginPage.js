import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:3000";

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
    console.log(password)

    axios.post(`${API_URL}/auth/login`, requestBody)
      .then((response) => {
        // Request to the server's endpoint `/auth/login` returns a response
        // with the JWT string ->  response.data.authToken
        console.log('JWT token', response.data.authToken);

        storeToken(response.data.authToken);
        
        axios.get(`${API_URL}/auth/verify`, { headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDVjYzAzMjdlYjBkM2ExZjY0NzA2ZmUiLCJlbWFpbCI6InBhcmlzQHBhcmlzLmNvbSIsIm5hbWUiOiJQYXJpcyIsImlhdCI6MTY4MzgwMDkzOSwiZXhwIjoxNjgzODIyNTM5fQ.yGLCx29XTwKA2_o0YY_E6l3bP1vrhfYIXvmDCbnqDps` } })
          .then((response) => {
            console.log("THIS IS THE RESPONSE: ", response)
            // If the server verifies that the JWT token is valid
            const User = response.data;
            // Update store variables
            setLoggedIn(true);
            setLoading(true);
            setUser(User);
            navigate('/profile');
          })
      })
      .catch((error) => {
        console.log(error)
      });
  };

  return (
    <div className="LoginPage">
      <h1>Login</h1>

      <form onSubmit={handleLoginSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleEmail}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />

        <button type="submit">Login</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Don't have an account yet?</p>
      <Link to={"/signup"}> Sign Up</Link>
    </div>
  );
}

export default LoginPage;
