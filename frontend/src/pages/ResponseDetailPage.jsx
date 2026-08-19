import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client.js';

export default function ResponseDetailPage() {
    const { id } = useParams();
    const [response, setResponse] = useState(null);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        api.get(`/api/responses/${id}`)
            .then(async (respData) => {
                if (cancelled) return;
                setResponse(respData);
                try {
                    const formData = await api.get(`/api/forms/${respData.formId}`);
                    if (!cancelled) setForm(formData);
                } catch {
                    // form may have been deleted; render what we have
                }
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [id]);

    if (loading) return <p>Loading…</p>;
    if (error) return <div className="error">{error}</div>;
    if (!response) return null;

    const answersById = new Map(response.answers.map((a) => [a.questionId, a.value]));

    function renderValue(value) {
        if (value === undefined || value === null || value === '') return <em>(no answer)</em>;
        if (Array.isArray(value)) return value.length ? value.join(', ') : <em>(no answer)</em>;
        return String(value);
    }

    return (
        <div className="card">
            <h1>Response details</h1>
            <p>Submitted: {new Date(response.createdAt).toLocaleString()}</p>

            {form ? (
                <>
                    <h2>{form.title}</h2>
                    {form.description && <p>{form.description}</p>}
                    <ul className="answer-list">
                        {form.questions.map((question) => (
                            <li key={question._id} className="answer-row">
                                <strong>{question.label}</strong>
                                <div>{renderValue(answersById.get(question._id))}</div>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <>
                    <p><em>The original form is no longer available — showing raw answers.</em></p>
                    <ul className="answer-list">
                        {response.answers.map((a, i) => (
                            <li key={i} className="answer-row">
                                <strong>Question {a.questionId}</strong>
                                <div>{renderValue(a.value)}</div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <p><Link to="/my-responses">← Back to my responses</Link></p>
        </div>
    );
}
