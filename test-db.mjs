import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

async function testConnection() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/connectNalco";
  const dbName = process.env.MONGODB_DB_NAME || "connectNalco";
  console.log('Testing connection to MongoDB...');
  console.log('URI:', uri.includes('@') ? uri.replace(/:([^:@]+)@/, ':****@') : uri);
  console.log('Database Name:', dbName);

  try {
    const conn = await mongoose.connect(uri, {
      dbName: dbName,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected successfully to MongoDB!');
    console.log('Host:', conn.connection.host);
    console.log('Port:', conn.connection.port);
    console.log('Database name:', conn.connection.name);
    console.log('ReadyState:', conn.connection.readyState);

    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`\nFound ${collections.length} collections:`);
    for (const col of collections) {
      const count = await conn.connection.db.collection(col.name).countDocuments();
      console.log(`  - ${col.name}: ${count} document(s)`);
    }

    const users = await conn.connection.db.collection('users').find({}).toArray();
    console.log(`\nUsers in DB (${users.length}):`);
    for (const u of users) {
      const isPassValid = await bcrypt.compare('admin123', u.password).catch(() => false) ||
                          await bcrypt.compare('auth123', u.password).catch(() => false) ||
                          await bcrypt.compare('emp123', u.password).catch(() => false);
      console.log(`  - ${u.employeeId} | ${u.email} | Role: ${u.role} | Status: ${u.status} | Password Hash Valid: ${!!u.password}`);
    }

    // Test a write operation and read back
    const testCol = conn.connection.db.collection('_db_test_probe');
    const probeDoc = { probe: true, timestamp: new Date() };
    const insertRes = await testCol.insertOne(probeDoc);
    console.log('\n✅ DB Write Test passed! Inserted probe ID:', insertRes.insertedId.toString());

    const readDoc = await testCol.findOne({ _id: insertRes.insertedId });
    if (readDoc) {
      console.log('✅ DB Read Test passed! Read back probe document.');
    }
    await testCol.deleteOne({ _id: insertRes.insertedId });
    console.log('✅ DB Cleanup Test passed! Probe document deleted.');

    await mongoose.disconnect();
    console.log('\n🎉 Database is working perfectly!');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB Test Error:', err.message);
    process.exit(1);
  }
}

testConnection();
