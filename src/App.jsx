import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Hero from "./pages/Hero";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Experience from "./pages/Experience";
import Settings from "./pages/Settings";
import PrivateRoute from "./routes/PrivateRoute";
import Projects from "./pages/Projects";
import Categories from "./pages/ProjectCategories";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import Blogs from "./pages/Blogs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ROUTE ===== */}
        <Route path="/" element={<Login />} />

        {/* ===== PROTECTED ROUTES ===== */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/hero"
          element={
            <PrivateRoute>
              <Hero />
            </PrivateRoute>
          }
        />

        <Route
          path="/about"
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />

        <Route
          path="/skills"
          element={
            <PrivateRoute>
              <Skills />
            </PrivateRoute>
          }
        />

        <Route
          path="/experience"
          element={
            <PrivateRoute>
              <Experience />
            </PrivateRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />

        <Route
          path="/Services"
          element={
            <PrivateRoute>
              <Services />
            </PrivateRoute>
          }
        />

        <Route
          path="/Contact"
          element={
            <PrivateRoute>
              <Contacts />
            </PrivateRoute>
          }
        />

         <Route
          path="/Blogs"
          element={
            <PrivateRoute>
              <Blogs />
            </PrivateRoute>
          }
        />

        <Route
          path="/ProjectCategories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
        {/* 🔥 SOCIAL MEDIA SETTINGS */}
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
