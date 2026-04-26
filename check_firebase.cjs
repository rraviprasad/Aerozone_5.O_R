const admin = require("firebase-admin");
require("dotenv").config({ path: "./backend/.env" });

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  console.error("Missing GOOGLE_APPLICATION_CREDENTIALS_JSON env variable");
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function checkData() {
  try {
    const excelSnap = await db.collection("excelData").get();
    console.log(`excelData count: ${excelSnap.size}`);
    
    const indentSnap = await db.collection("Indent_Quantity").get();
    console.log(`Indent_Quantity count: ${indentSnap.size}`);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkData();
