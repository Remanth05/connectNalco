import { execSync } from "child_process";

console.log("🌱 Seeding NALCO database with initial user data...\n");

try {
  // Run the TypeScript seeding script
  execSync("npx tsx server/scripts/seedData.ts", { stdio: "inherit" });
} catch (error) {
  console.error("❌ Error running seed script:", error);
  process.exit(1);
}
