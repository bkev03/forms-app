import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import Pagination from '../components/Pagination.jsx';

export default function MyFormsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page'), 10) || 1;
    const [forms, setForms] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        api.get(`/api/forms/my-forms?page=${page}&limit=10`)
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
    }, [page, refreshKey]);

    async function handleToggleStatus(formId) {
        try {
            await api.patch(`/api/forms/${formId}/status`);
            setRefreshKey((k) => k + 1);
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleDelete(formId) {
        if (!window.confirm('Delete this form? All its responses will be deleted too.')) return;
        try {
            await api.delete(`/api/forms/${formId}`);
            setRefreshKey((k) => k + 1);
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div>
            <div className="page-header">
                <h1>My forms</h1>
                <Link to="/my-forms/new" className="btn-primary btn-link-button">+ New form</Link>
            </div>
            {loading && <p>Loading…</p>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && forms.length === 0 && (
                <p>You haven't created any forms yet. <Link to="/my-forms/new">Create your first one</Link>.</p>
            )}
            <ul className="form-list">
                {forms.map((form) => (
                    <li key={form._id} className="card">
                        <h2>{form.title}</h2>
                        {form.description && <p>{form.description}</p>}
                        <p>
                            <span className={`badge badge-${form.isOpen ? 'open' : 'draft'}`}>
                                {form.isOpen ? 'Published' : 'Draft'}
                            </span>
                            {' · '}
                            {form.questions.length} question{form.questions.length === 1 ? '' : 's'}
                        </p>
                        <div className="actions">
                            <Link to={`/forms/${form._id}`}>View</Link>
                            <Link to={`/my-forms/${form._id}/edit`}>Edit</Link>
                            <Link to={`/my-forms/${form._id}/responses`}>Responses</Link>
                            <button type="button" onClick={() => handleToggleStatus(form._id)}>
                                {form.isOpen ? 'Unpublish' : 'Publish'}
                            </button>
                            <button type="button" onClick={() => handleDelete(form._id)} className="btn-danger">
                                Delete
                            </button>
                        </div>
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
