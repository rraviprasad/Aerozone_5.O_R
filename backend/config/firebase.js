const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const admin = require("firebase-admin");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS_JSON env variable");
}

const sanitizeJson = (str) => {
  if (!str) return "";
  // Check if it's already a valid object-like string or if it needs repair
  try {
    // First attempt: just trim
    return str.trim();
  } catch (e) {
    // If it's a mess, we'll try to escape common issues
    return str
      .replace(/[\r\n]+/g, " ") // Replace actual newlines with spaces (safe for JSON keys/values)
      .trim();
  }
};

let serviceAccount;
const rawCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

try {
  // Attempt 1: Standard parse
  serviceAccount = JSON.parse(rawCredentials);
} catch (e) {
  try {
    // Attempt 2: Handle literal newlines that might have been injected
    // We escape backslashes first, then restore valid ones, or just use a simpler approach:
    // JSON doesn't allow literal newlines. Let's try to escape them.
    const repaired = rawCredentials
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r");
    serviceAccount = JSON.parse(repaired);
  } catch (e2) {
    // Attempt 3: If it's still failing, it might be due to a trailing slash or bad escape at the end
    try {
      const simplified = rawCredentials.replace(/\\([^"\\\/bfnrtu])/g, "$1"); // Remove invalid escapes
      serviceAccount = JSON.parse(simplified);
    } catch (e3) {
      throw new Error(`Firebase Auth Parse Error. Raw length: ${rawCredentials?.length}. First error: ${e.message}`);
    }
  }
}

if (serviceAccount && serviceAccount.private_key) {
  let key = serviceAccount.private_key;
  
  // Step 1: Replace literal "\\n" or actual newlines with a unique placeholder
  key = key.replace(/\\n/g, "\n").replace(/\r/g, "");
  
  // Step 2: Use a Regex to find the part between BEGIN and END markers
  // This is the most robust way to fix "ASN.1 parsing" errors.
  const pemMatch = key.match(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/);
  
  if (pemMatch) {
    key = pemMatch[0];
    
    // Step 3: Inside the key, ensure there are no trailing backslashes or extra quotes
    // that might have been accidentally pasted from a shell or UI.
    const header = "-----BEGIN PRIVATE KEY-----";
    const footer = "-----END PRIVATE KEY-----";
    let body = key.slice(header.length, -footer.length);
    
    // Clean the body of ALL non-base64 characters (spaces, extra backslashes, quotes)
    body = body.replace(/[^A-Za-z0-9+/=]/g, "");
    
    // Reconstruct the key with clean 64-character lines (standard PEM format)
    const lines = body.match(/.{1,64}/g) || [];
    key = `${header}\n${lines.join("\n")}\n${footer}`;
  }
  
  serviceAccount.private_key = key;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
module.exports = { db };