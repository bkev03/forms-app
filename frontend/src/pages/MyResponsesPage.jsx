import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import Pagination from '../components/Pagination.jsx';

export default function MyResponsesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page'), 10) || 1;

    const [responses, setResponses] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        api.get(`/api/responses/my-responses?page=${page}&limit=10`)
            .then((data) => {
                if (cancelled) return;
                setResponses(data.data);
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
            <h1>My responses</h1>
            {loading && <p>Loading…</p>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && responses.length === 0 && (
                <p>You haven't submitted any responses yet. <Link to="/">Browse open forms</Link>.</p>
            )}
            <ul className="form-list">
                {responses.map((response) => {
                    const formTitle = response.formId?.title || <em>(form deleted)</em>;
                    return (
                        <li key={response._id} className="card">
                            <h2>{formTitle}</h2>
                            <p>Submitted: {new Date(response.createdAt).toLocaleString()}</p>
                            <Link to={`/responses/${response._id}`}>View details →</Link>
                        </li>
                    );
                })}
            </ul>
            <Pagination
                pagination={pagination}
                onPageChange={(p) => setSearchParams({ page: String(p) })}
            />
        </div>
    );
}
