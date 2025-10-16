const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fypapi-d6762.firebaseio.com",
});

const app = express();
app.use(express.json());
app.use(cors()); 


app.get("/users", async (req, res) => {
  try {
    const listUsers = await admin.auth().listUsers();
    res.json(listUsers.users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

app.delete("/users/:uid", async (req, res) => {
  const uid = req.params.uid;
  try {
    await admin.auth().deleteUser(uid);
    res.send(`User with UID ${uid} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
});

app.get("/tests", async (req, res) => {
  try {
    const testsRef = admin.firestore().collection("history");
    const snapshot = await testsRef.get();
    const tests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(tests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).send("Error fetching tests");
  }
});

app.delete("/tests/:id", async (req, res) => {
  const testId = req.params.id;
  try {
    await admin.firestore().collection("history").doc(testId).delete();
    res.send(`Test with ID ${testId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting test:", error);
    res.status(500).send("Error deleting test");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
