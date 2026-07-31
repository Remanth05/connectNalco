import { connectDB, disconnectDB } from "../config/database";
import { User } from "../models/User";

const nalcoUsers = [
  {
    employeeId: "ADMIN001",
    name: "System Administrator",
    email: "admin@nalco.com",
    password: "admin123",
    phone: "+91-6752-242001",
    role: "admin",
    department: "Information Technology",
    designation: "System Administrator",
    location: "Damanjodi Plant",
    team: "IT Support",
  },
  {
    employeeId: "AUTH001",
    name: "Dr. Priya Sharma",
    email: "priya.sharma@nalco.com",
    password: "auth123",
    phone: "+91-9876543211",
    role: "authority",
    department: "Human Resources",
    designation: "Department Head",
    location: "Damanjodi Plant",
    team: "Management",
    joinDate: new Date("2018-06-20"),
  },
  {
    employeeId: "EMP001",
    name: "Rajesh Kumar Singh",
    email: "rajesh.singh@nalco.com",
    password: "emp123",
    phone: "+91-9876543210",
    role: "employee",
    department: "Human Resources",
    designation: "HR Executive",
    location: "Damanjodi Plant",
    team: "Employee Relations",
    joinDate: new Date("2022-03-15"),
  },
  {
    employeeId: "EMP002",
    name: "Sunita Devi",
    email: "sunita.devi@nalco.com",
    password: "emp123",
    phone: "+91-9876543213",
    role: "employee",
    department: "Human Resources",
    designation: "HR Assistant",
    location: "Damanjodi Plant",
    team: "Administration",
    joinDate: new Date("2021-07-20"),
  },
  {
    employeeId: "EMP003",
    name: "Mohammad Alam",
    email: "mohammad.alam@nalco.com",
    password: "emp123",
    phone: "+91-9876543214",
    role: "employee",
    department: "Human Resources",
    designation: "Trainee",
    location: "Damanjodi Plant",
    team: "Training Program",
    joinDate: new Date("2023-11-05"),
  },
  {
    employeeId: "ENG001",
    name: "Anita Das",
    email: "anita.das@nalco.com",
    password: "auth123",
    phone: "+91-9876543215",
    role: "authority",
    department: "Engineering",
    designation: "Engineering Manager",
    location: "Plant Area 1",
    team: "Plant Operations",
    joinDate: new Date("2019-01-10"),
  },
  {
    employeeId: "FIN001",
    name: "Suresh Babu",
    email: "suresh.babu@nalco.com",
    password: "auth123",
    phone: "+91-9876543216",
    role: "authority",
    department: "Finance",
    designation: "Finance Manager",
    location: "Admin Block B",
    team: "Accounts",
    joinDate: new Date("2020-04-15"),
  },
  {
    employeeId: "OPS001",
    name: "Ramesh Chandran",
    email: "ramesh.chandran@nalco.com",
    password: "auth123",
    phone: "+91-9876543217",
    role: "authority",
    department: "Operations",
    designation: "Operations Manager",
    location: "Plant Area 1",
    team: "Plant Operations",
    joinDate: new Date("2017-08-12"),
  },
];

export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await connectDB();

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create users one by one so the pre-save bcrypt hash hook fires
    const createdUsers = [];
    for (const userData of nalcoUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }

    console.log(`✅ Created ${createdUsers.length} users successfully`);

    // Display created users
    console.log("\n📋 Created Users:");
    createdUsers.forEach((user) => {
      console.log(
        `- ${user.name} (${user.employeeId}) - ${user.role} - ${user.email}`,
      );
    });

    console.log("\n🎉 Database seeding completed successfully!");

    // Display default credentials
    console.log("\n🔐 Default Login Credentials (matching demo UI):");
    console.log("Admin:     ADMIN001 / admin123");
    console.log("Authority: AUTH001  / auth123");
    console.log("Employee:  EMP001   / emp123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await disconnectDB();
  }
};

seedDatabase();

