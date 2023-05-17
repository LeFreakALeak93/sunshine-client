import './App.css';
import Navbar from "./components/Navbar"
import { Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react";
import HomePage from './pages/HomePage';
import ProfilePage from "./pages/ProfilePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import WineListPage from "./pages/WineListPage"
import WineListDetailsPage from "./pages/WineListDetailsPage"
import ErrorPage from './pages/ErrorPage';
import IsPrivate from './components/IsPrivate';
import IsAnon from './components/IsAnon';
import AddWine from './pages/AddWine';
import EditWine from './pages/EditWine'
import DeleteWine from './pages/DeleteWine'
import axios from "axios"
import Footer from './components/Footer';

function App() {
  const [wines, setWines] = useState(null)

  const API_URL = "http://localhost:3000/";

  const getAllWines = () => {
    const storedToken = localStorage.getItem("authToken");
    console.log(storedToken)
    axios
      .get(`${API_URL}api/wines`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      .then((response) => setWines(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllWines();
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<IsAnon><SignupPage /></IsAnon>} />
        <Route path="/login" element={<IsAnon><LoginPage /></IsAnon>} />
        <Route path="/wine-list" element={<WineListPage wines={wines} />} />
        <Route path="/wine-list/:wineId" element={<WineListDetailsPage wines={wines} />} />
        <Route path="/profile" element={<IsPrivate><ProfilePage /></IsPrivate>} />
        <Route path="/addwine" element={<AddWine />} />
        <Route path="/editwine" element={<EditWine />} />
        <Route path="/deletewine" element={<DeleteWine />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;