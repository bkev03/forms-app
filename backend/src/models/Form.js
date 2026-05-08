import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['short_answer', 'long_answer', 'single_choice', 'multiple_choice', 'dropdown'],
        required: true
    },
    options: [String],
    required: {
        type: Boolean,
        default: false
    }
});

QuestionSchema.path('options').validate(function (value) {
    const choiceTypes = ['single_choice', 'multiple_choice', 'dropdown'];
    if (choiceTypes.includes(this.type)) {
        return Array.isArray(value) && value.length >= 2;
    }
    return true;
}, 'Choice-type questions must have at least 2 options.');

const FormSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isOpen: {
        type: Boolean,
        default: false
    },
    questions: [QuestionSchema]
}, { timestamps: true });

const Form = mongoose.model("Form", FormSchema);

export default Form;