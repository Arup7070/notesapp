import express from 'express';
import { addUser, getUser, logIn, googleSignIn } from '../controls/user.control.js';
import authenticationToken from "../utilities/util.js";

const router = express.Router();

router.post('/create-account', addUser);
router.post('/login', logIn);
router.post('/google-login', googleSignIn);
router.get('/get-user', authenticationToken, getUser);

export default router;