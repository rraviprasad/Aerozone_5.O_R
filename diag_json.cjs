const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const envPath = path.join("backend", ".env");
if (!fs.existsSync(envPath)) {
    console.log(".env not found at", envPath);
    process.exit(1);
}

const envContent = fs.readFileSync(envPath);
const config = dotenv.parse(envContent);
const jsonStr = config.GOOGLE_APPLICATION_CREDENTIALS_JSON;

console.log("JSON String length:", jsonStr.length);

try {
    const obj = JSON.parse(jsonStr);
    console.log("JSON.parse: SUCCESS");
    const pk = obj.private_key;
    console.log("Private Key length:", pk.length);
    
    // Find any characters that aren't Base64, newline, or PEM headers
    const cleaned = pk.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, "");
    const invalidChars = cleaned.match(/[^A-Za-z0-9+/=]/g);
    if (invalidChars) {
        console.log("Invalid characters in Base64 content:", [...new Set(invalidChars)]);
        // Find indices of backslashes
        let indices = [];
        for(let i=0; i<pk.length; i++) {
            if (pk[i] === '\\') indices.push(i);
        }
        console.log("Backslash indices in pk:", indices);
        if (indices.length > 0) {
            indices.forEach(idx => {
                console.log(`Context at ${idx}: "${pk.substring(idx-5, idx+5)}"`);
            });
        }
    } else {
        console.log("Base64 content looks clean (only A-Z, a-z, 0-9, +, /, =)");
    }
} catch (e) {
    console.log("JSON.parse: FAILED");
    console.log("Error:", e.message);
    // Find where it failed
    const posMatch = e.message.match(/position (\d+)/);
    if (posMatch) {
        const pos = parseInt(posMatch[1]);
        console.log(`Context at ${pos}: "${jsonStr.substring(pos-20, pos+20)}"`);
    }
}
