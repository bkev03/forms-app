import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import FormViewPage from './pages/FormViewPage.jsx';
import MyFormsPage from './pages/MyFormsPage.jsx';
import FormEditPage from './pages/FormEditPage.jsx';
import FormResponsesPage from './pages/FormResponsesPage.jsx';
import ResponseDetailPage from './pages/ResponseDetailPage.jsx';
import MyResponsesPage from './pages/MyResponsesPage.jsx';

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forms/:id" element={<FormViewPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/my-responses" element={<MyResponsesPage />} />
                        <Route path="/responses/:id" element={<ResponseDetailPage />} />
                    </Route>

                    <Route element={<ProtectedRoute role="editor" />}>
                        <Route path="/my-forms" element={<MyFormsPage />} />
                        <Route path="/my-forms/new" element={<FormEditPage />} />
                        <Route path="/my-forms/:id/edit" element={<FormEditPage />} />
                        <Route path="/my-forms/:id/responses" element={<FormResponsesPage />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

function NotFound() {
    return (
        <div className="card">
            <h1>404 — page not found</h1>
            <p><a href="/">Back to home</a></p>
        </div>
    );
}
