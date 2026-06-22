import Notes from "../models/notes.model.js";

export const addNotes = async (req, res) => {
    const notes = req.body;
    const user = req.user;
    // console.log(user);

    if (!notes.title || !notes.content) {
        return res.status(400).json({ message: "Please fill in all fields." });
    };

    try {
        const newNotes = new Notes({
            title: notes.title,
            content: notes.content,
            userId: user.user._id,
            tags: notes.tags || []
        });

        await newNotes.save();

        return res.status(200).json({
            error: false,
            message: "Notes added successfully.",
            data: newNotes
        });

    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Failed to add note." });
    }

};

export const editNotes = async (req, res) => {
    const noteId = req.params.id;
    const note = req.body;
    const user = req.user;

    if (!note.title && !note.content && !note.tags) {
        return res.status(400).json({ message: "No changes detected." });
    }

    if (!note) {
        return res.status(400).json({ message: "Note not found." });
    }

    try {
        const updatedNotes = await Notes.findOne({ _id: noteId, userId: user.user._id });

        if (note.title) updatedNotes.title = note.title;
        if (note.content) updatedNotes.content = note.content;
        if (note.tags) updatedNotes.tags = note.tags;
        if (note.isPinned) updatedNotes.isPinned = note.isPinned;

        await updatedNotes.save();

        return res.status(200).json({
            error: false, message: "Notes updated successfully.",
            data: updatedNotes
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to update note." });
    }

};

export const getAllNotes = async (req, res) => {
    const user = req.user.user;
    // console.log(user);

    try {
        const notes = await Notes.find({ userId: user._id }).sort({
            isPinned: -1
        });
 
        return res.status(200).json({
            error: false,
            message: "Notes retrieved successfully.",
            notes
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to retrieve notes." });
    }
};

export const deleteNotes = async (req, res) => {
    const noteId = req.params.id;
    const user = req.user.user;

    try {
        const note = await Notes.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ message: "Note not found." });
        }

        await Notes.deleteOne({ _id: noteId, userId: user._id });
        return res.status(200).json({ error: false, message: "Note deleted successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete note." });
    }
};

export const updateIsPinned = async (req, res) => {
    const noteId = req.params.id;
    const note = req.body;
    const user = req.user;

    if (!note) {
        return res.status(400).json({ message: "Note not found." });
    }

    try {
        const updatedNotes = await Notes.findOne({ _id: noteId, userId: user.user._id });

        updatedNotes.isPinned = note.isPinned;

        await updatedNotes.save();

        return res.status(200).json({
            error: false, message: "Notes updated successfully.",
            data: updatedNotes
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to update note." });
    }


};
 
export const searchNote = async (req, res) => {
    const user = req.user.user;
    const query = req.query.query;
    if(!query){
        return res.status(400).json({ error:true, message: "Query is required." });
    }

    try{
        const matchedNotes = await Notes.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") }},
                { content: { $regex: new RegExp(query, "i") } },
                { tags: { $regex: new RegExp(query, "i") } },
            ],
        });
        
        return res.status(200).json({ 
            error: false, 
            message: "Notes found.", 
            notes:matchedNotes});

    }catch(error){
        return res.status(500).json({
            error: true, message: "Failed to search notes."
        })
    }
}