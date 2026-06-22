import express from "express";
import { addNotes, deleteNotes, editNotes, getAllNotes, searchNote, updateIsPinned } from "../controls/notes.controls.js";
import authenticationToken from "../utilities/util.js";

const router = express.Router();

router.post('/add', authenticationToken, addNotes);
router.put('/edit/:id', authenticationToken, editNotes);
router.put('/pin/:id', authenticationToken, updateIsPinned);
router.get('/search', authenticationToken, searchNote);
router.delete('/delete/:id', authenticationToken, deleteNotes);
router.get('/', authenticationToken, getAllNotes);


export default router;  