import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import Pagination from '../components/Pagination.jsx';

export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page'), 10) || 1;
    const [forms, setForms] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        api.get(`/api/forms/?page=${page}&limit=10`)
            .then((data) => {
                if (cancelled) return;
                setForms(data.data);
                setPagination(data.pagination);
                setError('');
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [page]);

    return (
        <div>
            <h1>Open forms</h1>
            {loading && <p>Loading…</p>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && forms.length === 0 && <p>No open forms available.</p>}
            <ul className="form-list">
                {forms.map((form) => (
                    <li key={form._id} className="card">
                        <h2><Link to={`/forms/${form._id}`}>{form.title}</Link></h2>
                        {form.description && <p>{form.description}</p>}
                        <small>{form.questions.length} question{form.questions.length === 1 ? '' : 's'}</small>
                    </li>
                ))}
            </ul>
            <Pagination
                pagination={pagination}
                onPageChange={(p) => setSearchParams({ page: String(p) })}
            />
        </div>
    );
}
