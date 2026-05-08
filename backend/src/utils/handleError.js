export function handleError(error, res, label) {
    if (error.name === 'CastError') {
        return res.status(400).json({ error: "Invalid ID format." });
    }
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(e => e.message);
        return res.status(400).json({ error: messages.join('; ') });
    }
    console.error(`Error in ${label}:\n`, error);
    return res.status(500).json({ error: "Internal server error." });
}
