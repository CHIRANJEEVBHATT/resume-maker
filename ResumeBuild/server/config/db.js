import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
  try {
    let uri = (process.env.MONGODB_URL || '').trim();

    if (!uri) {
      throw new Error("Missing MONGODB_URL in .env");
    }

    
    const match = uri.match(/^(mongodb(?:\+srv)?:\/\/[^/]+)(?:\/([^?]*))?(\?.*)?$/i);
    if (match) {
      const base = match[1];
      const pathPart = (match[2] || '').trim();
      const query = match[3] || '';
      const firstSegment = pathPart.split('/').filter(Boolean)[0] || 'resume';
      uri = `${base}/${firstSegment}${query}`;
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.error("Example MONGODB_URL: mongodb://localhost:27017/resume");
    process.exit(1);
  }
};

export default connectDB;
