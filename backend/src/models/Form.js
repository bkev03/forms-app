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
        default: true
    },
    questions: [QuestionSchema]
}, { timestamps: true });

const Form = mongoose.model("Form", FormSchema);

export default Form;