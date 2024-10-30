const addToNotes = (notes, item) => {
    if (!notes.includes(item)) {
        if (notes.length >= 3) {
            notes.shift();
        }
        notes.push(item);
    }
}

module.exports.addToNotes = addToNotes;