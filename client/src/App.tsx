import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './Components/ProtectedRoute';
import { GuestRoute } from './Components/GuestRoute';
import { scrollToSection } from './lib/scrollTo';
import LandingPage from './Pages/LandingPage';
import Content from './Pages/Content';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';

function HashScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname === '/' && hash) {
      const id = hash.replace('#', '');
      requestAnimationFrame(() => scrollToSection(id));
    }
  }, [pathname, hash]);

  return null;
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <HashScrollHandler />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/content"
            element={
              <ProtectedRoute>
                <Content />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignUp />
              </GuestRoute>
            }
          />
          <Route path="/Login" element={<Navigate to="/login" replace />} />
          <Route path="/SignUp" element={<Navigate to="/signup" replace />} />
          <Route path="/dashboard" element={<Navigate to="/content" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
