const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { ObjectID, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

///////////////Connection to DataBase///////////////
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nekc4yh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("CollegeDB");
    const collegeCollection = database.collection("College");
    const admissionCollection = database.collection("Admission");
    const graduateGroupImg = database.collection("GraduateGroupImg");
    const SelectedCollege = database.collection("SelectedCollege");
    app.get("/api/colleges", async (req, res) => {
      try {
        const colleges = await collegeCollection.find({}).toArray();
        res.send(colleges);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch colleges" });
      }
    });

    app.get("/api/colleges/:id", async (req, res) => {
      try {
        const collegeId = req.params.id;
        const college = await collegeCollection.findOne({ _id: new ObjectId(collegeId) });

        if (!college) {
          return res.status(404).json({ error: "College not found" });
        }
        res.send(college);
      } catch (error) {
        res.send(500).json({ error: "Failed to fetch college" });
      }
    });

    // API Endpoint to Get All Admission Records
    app.get("/api/admissions", async (req, res) => {
      try {
        const admissions = await admissionCollection.find({}).toArray();
        res.send(admissions);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch admission records" });
      }
    });
    app.get("/api/graduateIMG", async (req, res) => {
      try {
        const images = await graduateGroupImg.find({}).toArray();
        res.send(images);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch admission records" });
      }
    });

    app.post("/selected-college", async (req, res) => {
      const user = req.body;
      const result = await SelectedCollege.insertOne(user);
      res.send(result);
    });

    app.get("/selected-college/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const selectedCollege = await SelectedCollege.find(query).toArray();
      res.send(selectedCollege);
    });






    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

//////////////////////////////

app.get("/", (req, res) => {
  res.send("College server is running");
});

app.listen(port, () => {
  console.log(`College server is running on port ${port}`);
});
