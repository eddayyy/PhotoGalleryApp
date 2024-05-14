import { Route, Routes, BrowserRouter } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import "./App.css";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./routes/ProtectedRoutes";
import PhotoGallery from "./pages/PhotoGallery/PhotoGallery";
import { UserProvider } from "./util/UserContext";
import ProtectedLoggedInRoute from "./routes/ProtectedLoggedInRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedLoggedInRoute />}>
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path="/gallery" element={<PhotoGallery />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
