// lib/db.ts
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/join_mart';
const client = new MongoClient(uri);

let databaseConnection: Db;

export async function connectToDatabase() {
  if (!databaseConnection) {
    await client.connect();
    databaseConnection = client.db();
  }
  return databaseConnection;
}

// Interfaces
interface Room {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
}

interface Product {
  id: string;
  roomId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  status: 'available' | 'held' | 'sold';
  heldBy?: string;
  createdAt: string;
}

interface Image {
  id: string;
  data: string; // base64 data URL
  createdAt: string;
}

export const db = {
  rooms: {
    create: async (data: Omit<Room, 'createdAt'>) => {
      const dbConn = await connectToDatabase();
      const room = { ...data, createdAt: new Date().toISOString() };
      const result = await dbConn.collection('rooms').insertOne(room);
      return { ...room, _id: result.insertedId };
    },
    findByCode: async (code: string) => {
      const dbConn = await connectToDatabase();
      return await dbConn.collection('rooms').findOne({ code });
    },
    findById: async (id: string) => {
      const dbConn = await connectToDatabase();
      return await dbConn.collection('rooms').findOne({ id });
    },
    findAll: async () => {
      const dbConn = await connectToDatabase();
      return await dbConn.collection('rooms').find({}).sort({ createdAt: -1 }).toArray();
    },
  },
  products: {
    create: async (data: Omit<Product, 'createdAt' | 'status'>) => {
      const dbConn = await connectToDatabase();
      const product: Product = { ...data, status: 'available', createdAt: new Date().toISOString() };
      const result = await dbConn.collection('products').insertOne(product);
      return { ...product, _id: result.insertedId };
    },
    findByRoom: async (roomId: string) => {
      const dbConn = await connectToDatabase();
      return await dbConn.collection('products').find({ roomId }).toArray();
    },
    findById: async (id: string) => {
      const dbConn = await connectToDatabase();
      return await dbConn.collection('products').findOne({ id });
    },
    updateStatus: async (
      id: string,
      status: 'available' | 'held' | 'sold',
      heldBy?: string
    ) => {
      const dbConn = await connectToDatabase();
      const updateData: any = { status };
      if (heldBy !== undefined) updateData.heldBy = heldBy;
      const result = await dbConn.collection('products').updateOne({ id }, { $set: updateData });
      if (result.matchedCount > 0) {
        return await dbConn.collection('products').findOne({ id });
      }
      return null;
    },
  },
  images: {
    create: async (data: Image) => {
      const dbConn = await connectToDatabase();
      const result = await dbConn.collection('images').insertOne(data);
      return { ...data, _id: result.insertedId };
    },
    findById: async (id: string) => {
      const dbConn = await connectToDatabase();
      return await dbConn.collection('images').findOne({ id });
    },
  },
};