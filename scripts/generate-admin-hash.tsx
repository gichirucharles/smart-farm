import bcrypt from "bcryptjs"

// This script generates the bcrypt hash for the system admin password
async function generateHash() {
  const password = "Maryalvin1985@"
  const hash = await bcrypt.hash(password, 12)
  console.log("Bcrypt hash for 'Maryalvin1985@':")
  console.log(hash)
  console.log("\nUse this hash in your SQL INSERT statement")
}

generateHash()
