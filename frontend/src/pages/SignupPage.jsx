import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('filler');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await api.post('/api/users/signup', { username, email, password, role });
            login(data);
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card">
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                    />
                </label>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    <small>Strong password required: lowercase + uppercase + number + symbol, min. 8 chars.</small>
                </label>
                <fieldset>
                    <legend>I want to:</legend>
                    <label className="radio">
                        <input
                            type="radio"
                            value="filler"
                            checked={role === 'filler'}
                            onChange={() => setRole('filler')}
                        />
                        Fill out forms (Kitöltő)
                    </label>
                    <label className="radio">
                        <input
                            type="radio"
                            value="editor"
                            checked={role === 'editor'}
                            onChange={() => setRole('editor')}
                        />
                        Create forms (Szerkesztő)
                    </label>
                </fieldset>
                {error && <div className="error">{error}</div>}
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Signing up…' : 'Sign up'}
                </button>
            </form>
            <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
    );
}
