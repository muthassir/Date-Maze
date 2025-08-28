import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Notfound from "./pages/Notfound";
import QuizPage from "./pages/QuizPage";
import Message from "./pages/Message";
import LoveMeter from "./pages/LoveMeter";
import Tictactoe from "./pages/Tictactoe";
import Alphabet from "./pages/Alphabet";
import Planner from "./pages/Planner"
import Gallery from "./pages/Gallery";
import { useAuth } from "./context/AuthContext";


const App = () => {
  const { user } = useAuth();
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />}/>
          <Route path="/alphabet" element={<Alphabet />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/message" element={ <Message />}/>
          <Route path="/love-meter" element={<LoveMeter />} />
          <Route path="/tictactoe" element={<Tictactoe />} />
          <Route path="/planner" element={<Planner/>} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
