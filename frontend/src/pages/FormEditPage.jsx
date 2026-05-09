import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import QuestionEditor from '../components/QuestionEditor.jsx';

function makeNewQuestion() {
    return {
        _id: `tmp-${Math.random().toString(36).slice(2)}`,
        label: '',
        type: 'short_answer',
        options: [],
        required: false,
        isNew: true
    };
}

export default function FormEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEdit) return;
        let cancelled = false;
        api.get(`/api/forms/${id}`)
            .then((data) => {
                if (cancelled) return;
                setTitle(data.title);
                setDescription(data.description || '');
                setQuestions(data.questions);
                setIsOpen(data.isOpen);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [id, isEdit]);

    function updateQuestion(index, updater) {
        setQuestions((qs) => qs.map((q, i) => (i === index ? updater(q) : q)));
    }

    function deleteQuestion(index) {
        setQuestions((qs) => qs.filter((_, i) => i !== index));
    }

    function addQuestion() {
        setQuestions((qs) => [...qs, makeNewQuestion()]);
    }

    function moveQuestion(index, direction) {
        setQuestions((qs) => {
            const target = index + direction;
            if (target < 0 || target >= qs.length) return qs;
            const next = [...qs];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const cleanedQuestions = questions.map((q) => {
                const cleaned = {
                    label: q.label,
                    type: q.type,
                    options: q.options || [],
                    required: q.required
                };
                if (!q.isNew && q._id && !String(q._id).startsWith('tmp-')) {
                    cleaned._id = q._id;
                }
                return cleaned;
            });

            const body = { title, description, isOpen, questions: cleanedQuestions };

            if (isEdit) {
                await api.put(`/api/forms/${id}`, body);
            } else {
                await api.post('/api/forms/', body);
            }
            navigate('/my-forms');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p>Loading…</p>;

    return (
        <div className="card">
            <h1>{isEdit ? 'Edit form' : 'New form'}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Title
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label>
                <label>
                    Description (optional)
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                    />
                </label>
                <label className="checkbox">
                    <input
                        type="checkbox"
                        checked={isOpen}
                        onChange={(e) => setIsOpen(e.target.checked)}
                    />
                    Published (visible to fillers)
                </label>

                <h2>Questions</h2>
                {questions.length === 0 && <p>No questions yet — add the first one below.</p>}
                {questions.map((question, index) => (
                    <QuestionEditor
                        key={question._id || index}
                        question={question}
                        index={index}
                        isLast={index === questions.length - 1}
                        onUpdate={(updater) => updateQuestion(index, updater)}
                        onDelete={() => deleteQuestion(index)}
                        onMoveUp={() => moveQuestion(index, -1)}
                        onMoveDown={() => moveQuestion(index, 1)}
                    />
                ))}
                <button type="button" onClick={addQuestion}>+ Add question</button>

                {error && <div className="error">{error}</div>}
                <div className="actions">
                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button type="button" onClick={() => navigate('/my-forms')}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
