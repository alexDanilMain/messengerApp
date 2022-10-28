import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import LoginPage from "./login";
import RegisterPage from "./register";
import Chat from "./Chat";
import SetProfilePic from "./setProfilePic";
import EditProfile from "./EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Chat />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setProfilePic" element={<SetProfilePic />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
