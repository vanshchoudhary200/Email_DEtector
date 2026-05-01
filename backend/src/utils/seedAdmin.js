import "../config/env.js";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";

async function seed() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = "admin";
    await existing.save();
    console.log(`Existing user promoted to admin: ${email}`);
  } else {
    await User.create({
      name: "Admin",
      email,
      password,
      role: "admin"
    });
    console.log(`Admin created: ${email}`);
  }

  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
