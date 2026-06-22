import mongoose from "mongoose";
import dns from "dns";
// import config from "../../config.json" assert { type: "json" };

const configureDns = (uri) => {
    if (!uri.startsWith("mongodb+srv://")) {
        return;
    }

    const configuredServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean);

    if (configuredServers.length) {
        dns.setServers(configuredServers);
    }
};

export const connect_db = async () => {
    const uri = process.env.CONNECTION_STRING;
    if (!uri) {
        console.error("Error: CONNECTION_STRING is not defined. Set it in backend/config/.env or export it in the environment.");
        process.exit(1);
    }

    try {
        configureDns(uri);
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        if (error.code === "ENODATA" || error.code === "ETIMEOUT") {
            console.log("MongoDB Atlas DNS lookup failed. Check DNS_SERVERS in backend/config/.env or try a non-SRV mongodb:// connection string from Atlas.");
        }
        process.exit(1);
    }
};
