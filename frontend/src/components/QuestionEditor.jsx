const QUESTION_TYPES = [
    { value: 'short_answer', label: 'Short answer' },
    { value: 'long_answer', label: 'Long answer' },
    { value: 'single_choice', label: 'Single choice' },
    { value: 'multiple_choice', label: 'Multiple choice' },
    { value: 'dropdown', label: 'Dropdown' }
];

const CHOICE_TYPES = ['single_choice', 'multiple_choice', 'dropdown'];

export default function QuestionEditor({ question, index, isLast, onUpdate, onDelete, onMoveUp, onMoveDown }) {
    const isChoice = CHOICE_TYPES.includes(question.type);

    function update(patch) {
        onUpdate((q) => ({ ...q, ...patch }));
    }

    function updateOption(optionIndex, value) {
        onUpdate((q) => ({
            ...q,
            options: q.options.map((o, i) => (i === optionIndex ? value : o))
        }));
    }

    function deleteOption(optionIndex) {
        onUpdate((q) => ({
            ...q,
            options: q.options.filter((_, i) => i !== optionIndex)
        }));
    }

    function addOption() {
        onUpdate((q) => ({
            ...q,
            options: [...(q.options || []), '']
        }));
    }

    function handleTypeChange(newType) {
        onUpdate((q) => {
            const next = { ...q, type: newType };
            if (CHOICE_TYPES.includes(newType) && (!q.options || q.options.length < 2)) {
                next.options = q.options && q.options.length ? [...q.options, ''] : ['', ''];
            }
            return next;
        });
    }

    return (
        <div className="question-editor">
            <div className="question-editor-header">
                <span>Question {index + 1}</span>
                <div className="actions">
                    <button type="button" onClick={onMoveUp} disabled={index === 0}>↑</button>
                    <button type="button" onClick={onMoveDown} disabled={isLast}>↓</button>
                    <button type="button" onClick={onDelete} className="btn-danger">Delete</button>
                </div>
            </div>

            <label>
                Label
                <input
                    value={question.label}
                    onChange={(e) => update({ label: e.target.value })}
                    required
                />
            </label>

            <label>
                Type
                <select value={question.type} onChange={(e) => handleTypeChange(e.target.value)}>
                    {QUESTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
            </label>

            {isChoice && (
                <div>
                    <strong>Options (at least 2 required):</strong>
                    {(question.options || []).map((option, i) => (
                        <div key={i} className="option-row">
                            <input
                                value={option}
                                onChange={(e) => updateOption(i, e.target.value)}
                                placeholder={`Option ${i + 1}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => deleteOption(i)}
                                className="btn-danger"
                                disabled={(question.options || []).length <= 2}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addOption}>+ Add option</button>
                </div>
            )}

            <label className="checkbox">
                <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => update({ required: e.target.checked })}
                />
                Required
            </label>
        </div>
    );
}
