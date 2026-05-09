import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import QuestionField from '../components/QuestionField.jsx';

export default function FormViewPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        api.get(`/api/forms/${id}`)
            .then((data) => {
                if (cancelled) return;
                setForm(data);
                setError('');
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [id]);

    function handleAnswerChange(questionId, value) {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError('');

        if (!user) {
            navigate('/login', { state: { from: { pathname: `/forms/${id}` } } });
            return;
        }

        setSubmitting(true);
        try {
            const answersArray = form.questions
                .map((q) => ({ questionId: q._id, value: answers[q._id] }))
                .filter((a) => {
                    if (a.value === undefined || a.value === null || a.value === '') return false;
                    if (Array.isArray(a.value) && a.value.length === 0) return false;
                    return true;
                });

            await api.post('/api/responses/', {
                formId: form._id,
                answers: answersArray
            });
            setSubmitted(true);
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <p>Loading…</p>;
    if (error) return <div className="error">{error}</div>;
    if (!form) return null;

    if (submitted) {
        return (
            <div className="card">
                <h1>Thank you!</h1>
                <p>Your response has been submitted.</p>
                <p>
                    <Link to="/my-responses">View my responses</Link>{' · '}
                    <Link to="/">Back to forms</Link>
                </p>
            </div>
        );
    }

    const isOwner = user && user.role === 'editor' && user._id === form.owner;
    const isClosed = !form.isOpen;

    return (
        <div className="card">
            <h1>{form.title}</h1>
            {form.description && <p>{form.description}</p>}
            {isClosed && (
                <div className="error">
                    This form is currently a draft and not accepting responses.
                </div>
            )}
            {isOwner && (
                <p><Link to={`/my-forms/${form._id}/edit`}>Edit this form →</Link></p>
            )}
            <form onSubmit={handleSubmit}>
                {form.questions.map((question) => (
                    <QuestionField
                        key={question._id}
                        question={question}
                        value={answers[question._id]}
                        onChange={(value) => handleAnswerChange(question._id, value)}
                        disabled={isClosed}
                    />
                ))}
                {submitError && <div className="error">{submitError}</div>}
                {!user && (
                    <p><em>You'll be asked to log in before submitting.</em></p>
                )}
                <button type="submit" className="btn-primary" disabled={submitting || isClosed}>
                    {submitting ? 'Submitting…' : 'Submit response'}
                </button>
            </form>
        </div>
    );
}
