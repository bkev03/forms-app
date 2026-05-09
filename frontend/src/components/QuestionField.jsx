export default function QuestionField({ question, value, onChange, disabled }) {
    const inputId = `q-${question._id}`;

    function renderInput() {
        switch (question.type) {
            case 'short_answer':
                return (
                    <input
                        id={inputId}
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        required={question.required}
                        disabled={disabled}
                    />
                );
            case 'long_answer':
                return (
                    <textarea
                        id={inputId}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        required={question.required}
                        rows={4}
                        disabled={disabled}
                    />
                );
            case 'single_choice':
                return (
                    <div className="options">
                        {(question.options || []).map((option) => (
                            <label key={option} className="radio">
                                <input
                                    type="radio"
                                    name={inputId}
                                    value={option}
                                    checked={value === option}
                                    onChange={() => onChange(option)}
                                    required={question.required}
                                    disabled={disabled}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                );
            case 'multiple_choice': {
                const arr = Array.isArray(value) ? value : [];
                return (
                    <div className="options">
                        {(question.options || []).map((option) => (
                            <label key={option} className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={arr.includes(option)}
                                    onChange={(e) => {
                                        if (e.target.checked) onChange([...arr, option]);
                                        else onChange(arr.filter((o) => o !== option));
                                    }}
                                    disabled={disabled}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                );
            }
            case 'dropdown':
                return (
                    <select
                        id={inputId}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        required={question.required}
                        disabled={disabled}
                    >
                        <option value="">-- Select --</option>
                        {(question.options || []).map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                );
            default:
                return <p><em>Unknown question type: {question.type}</em></p>;
        }
    }

    return (
        <div className="question-field">
            <label htmlFor={inputId}>
                {question.label}
                {question.required && <span className="required">*</span>}
            </label>
            {renderInput()}
        </div>
    );
}
