import fetch from "node-fetch";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "notesapp-195f9";
let firebaseCerts = null;
let firebaseCertsExpiry = 0;

const getFirebaseCerts = async () => {
    if (firebaseCerts && Date.now() < firebaseCertsExpiry) {
        return firebaseCerts;
    }

    const response = await fetch(
        "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
    );

    if (!response.ok) {
        throw new Error("Unable to fetch Firebase certificate keys.");
    }

    firebaseCerts = await response.json();
    firebaseCertsExpiry = Date.now() + 60 * 60 * 1000; // Cache for 1 hour
    return firebaseCerts;
};

const verifyFirebaseIdToken = async (idToken) => {
    const certs = await getFirebaseCerts();
    const decodedHeader = jwt.decode(idToken, { complete: true });

    if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
        throw new Error("Invalid Firebase token header.");
    }

    const cert = certs[decodedHeader.header.kid];
    if (!cert) {
        throw new Error("Firebase token certificate not found.");
    }

    return jwt.verify(idToken, cert, {
        algorithms: ["RS256"],
        issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
        audience: FIREBASE_PROJECT_ID,
    });
};

export const addUser   = async (req, res) => {
    const newUser   = req.body;

    if (!newUser  .name || !newUser  .email || !newUser  .password) {
        return res.status(400).json({ error: true, message: "Please fill in all fields" });
    }

    const isUser   = await User.findOne({ email: newUser  .email });

    if (isUser  ) {
        return res.json({
            error: true,
            message: "Email already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(newUser .password, 10);
    const user = new User({ ...newUser  , password: hashedPassword });

    await user.save();

    // Use 'user' key for the JWT payload
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "20m"
    });

    return res.json({
        error: false,
        token: accessToken,
        message: "Account created successfully"
    });
};

export const logIn = async (req, res) => {
    const user = req.body;

    if (!user.email || !user.password) {
        return res.status(400).json({ error: true, message: "Please enter all fields" });
    };

    const userInfo = await User.findOne({ email: user.email });

    if (!userInfo) {
        return res.status(400).json({
            error: true, 
            message: "User  not found"
        });
    };

    const isPasswordValid = await bcrypt.compare(user.password, userInfo.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            error: true,
            message: "Invalid password"
        });
    }

    // Use 'user' key for the JWT payload
    const logInAccessToken = jwt.sign({ user: userInfo }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "20m"
    });

    return res.status(200).json({
        error: false,
        message: "Logged in successfully",
        token: logInAccessToken,
        email: user.email
    });
};

export const googleSignIn = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ error: true, message: "Google ID token is required." });
        }

        const decodedToken = await verifyFirebaseIdToken(idToken);

        if (!decodedToken || !decodedToken.email) {
            return res.status(400).json({ error: true, message: "Invalid Google ID token." });
        }

        const email = decodedToken.email;
        const name = decodedToken.name || email.split("@")[0];

        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-10) + Date.now();
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            user = new User({ name, email, password: hashedPassword });
            await user.save();
        }

        const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "20m"
        });

        return res.status(200).json({
            error: false,
            message: "Logged in with Google successfully",
            token: accessToken,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: true, message: error.message || "Unable to verify Google sign-in." });
    }
};

export const getUser   = async (req, res) => {
    try {
        // console.log('req.user:', req.user); // Log the req.user to see its structure

        if (!req.user || !req.user.user) {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        const userId = req.user.user._id; // Access the user ID directly

        // console.log('User  ID:', userId); // Log the user ID

        const user = await User.findById(userId).select('-password -__v').lean();

        if (!user) {
            return res.status(404).json({ error: true, message: "User  not found" });
        }

        return res.json({
            error: false,
            message: "User  found",
            user // Send the user object
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};