import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/auth/SignIn";
// import SignUp from './pages/auth/SignUp'
import NotFound from "./pages/other/NotFound";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Auth Pages */}
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path='/signup' element={<SignUp />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
