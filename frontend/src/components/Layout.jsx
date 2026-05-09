import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <div className="app">
            <header className="header">
                <Link to="/" className="logo">QuickForms</Link>
                <nav className="nav">
                    <NavLink to="/" end>Home</NavLink>
                    {user && user.role === 'editor' && (
                        <NavLink to="/my-forms">My forms</NavLink>
                    )}
                    {user && (
                        <NavLink to="/my-responses">My responses</NavLink>
                    )}
                    {!user && (
                        <>
                            <NavLink to="/login">Log in</NavLink>
                            <NavLink to="/signup">Sign up</NavLink>
                        </>
                    )}
                    {user && (
                        <>
                            <span className="user-info">{user.email} ({user.role})</span>
                            <button type="button" onClick={handleLogout} className="btn-link">Log out</button>
                        </>
                    )}
                </nav>
            </header>
            <main className="main">
                <Outlet />
            </main>
        </div>
    );
}
