import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Gallery from './pages/Gallery';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Gallery />} />
              <Route path="book/:id" element={<BookDetails />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
