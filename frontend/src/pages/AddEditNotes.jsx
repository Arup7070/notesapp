import React, { useState } from 'react'
import TagInput from '../components/TagInput'
import { MdClose } from 'react-icons/md';
import axiosInstance from '../utils/axiosInstance';

const AddEditNotes = ({ showToastMessage, noteData, type, onClose, getAllNotes }) => {

    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);
    const [error, setError] = useState(null);

    // add note api call
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post("/api/notes/add", {
                title,
                content,
                tags
            });
            // console.log(response.data);

            if (response.data) {
                showToastMessage("Note Added successfully.");
                getAllNotes();
                onClose();
            };

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }


        };
    }

    // edit note api call
    const editNote = async () => {
        const noteId = noteData._id;
        try {
            const response = await axiosInstance.put("/api/notes/edit/" + noteId, {
                title,
                content,
                tags
            });
            // console.log(response.data);

            if (response.data) {
                showToastMessage("Note Updated successfully.");
                getAllNotes();
                onClose();
            };

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }


        };
    };

    const handleAddNote = () => {
        if (!title) {
            setError("Please enter a title");
            return;
        }
        if (!content) {
            setError("Please enter the content");
            return;
        }
        setError("");

        if (type === "edit") {
            editNote();
        } else {
            addNewNote();
        }
    }


    return (
        <div className='relative'>

            <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50' onClick={onClose}>
                <MdClose className='text-xl text-slate-400' />
            </button>


            <div className="flex flex-col gap-2">
                <label className="input-label">Title</label>
                <input type="text" className="text-xl text-slate-950 outline-none" placeholder='Add a title'
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />

            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">Content</label>
                <textarea type="text" className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded" placeholder='Enter the Content' rows={10}
                    value={content}
                    onChange={({ target }) => setContent(target.value)}
                />
            </div>

            <div className="mt-3">
                <label className="input-label">Tags</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && (
                <p className="text-red-500 text-sm pt-4">{error}</p>
            )}

            <button onClick={handleAddNote} className="btn-primary font-medium mt-5 p-3">{type === "edit" ? "Update" : "Add"}</button>

        </div>
    )

}
export default AddEditNotes
