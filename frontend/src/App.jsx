import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { BrowserRouter, Routes, Route, Navigate,} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Notfound from "./pages/Notfound";
import QuizPage from "./pages/QuizPage";
import Message from "./pages/Message";

const App = () => {
    const {user} = useAuth()
  return (
    <div>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/"        element={<Dashboard />} />
            {!user && <Route path="/login" element={<Login />} /> }
            {user && <Route path="/login" element={<Navigate to="/" />} />}
            <Route path="/about"   element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quiz"    element={<QuizPage />}/>
            <Route path="/message" element={<Message />} />
            <Route path="*"        element={<Notfound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
    </div>
  );
};

export default App;
