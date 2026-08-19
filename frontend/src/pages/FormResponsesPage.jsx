import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import Pagination from '../components/Pagination.jsx';

export default function FormResponsesPage() {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page'), 10) || 1;

    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        Promise.all([
            api.get(`/api/forms/${id}`),
            api.get(`/api/responses/form/${id}?page=${page}&limit=10`)
        ])
            .then(([formData, respData]) => {
                if (cancelled) return;
                setForm(formData);
                setResponses(respData.data);
                setPagination(respData.pagination);
                setError('');
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [id, page]);

    if (loading) return <p>Loading…</p>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div>
            <p><Link to="/my-forms">← Back to my forms</Link></p>
            <h1>Responses to "{form?.title}"</h1>
            <p>Total: {pagination.total}</p>
            {responses.length === 0 ? (
                <p>No responses yet.</p>
            ) : (
                <ul className="form-list">
                    {responses.map((response) => (
                        <li key={response._id} className="card">
                            <p>
                                Submitted: {new Date(response.createdAt).toLocaleString()}
                            </p>
                            <Link to={`/responses/${response._id}`}>View details →</Link>
                        </li>
                    ))}
                </ul>
            )}
            <Pagination
                pagination={pagination}
                onPageChange={(p) => setSearchParams({ page: String(p) })}
            />
        </div>
    );
}
