import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import 'dotenv/config'

const app = express()
const port = process.env.PORT || 5000;


// middle war use;
app.use(cors());
app.use(express.json());

// jobPortalProject
// IGuZh686QAfPBK0k

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.37zek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const jobCollection = client.db('jobPortal').collection('jobs');
    const jobApplicationCollection = client.db('jobPortal').collection('jobs_application_form');

    // jobs relative api
    app.get('/jobs', async (req, res) =>{
        const email = req.query.email;
        let query = {};
        if (email) {
            query = {addedEmail: email}
        }
        const cursor = jobCollection.find(query)
        const result = await cursor.toArray()
        res.send(result)
    })



    app.get('/jobs/:id', async (req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await jobCollection.findOne(query);
        res.send(result)
    })

    app.post('/jobs', async(req, res) => {
        const newJob = req.body;
        const result = await jobCollection.insertOne(newJob);
        res.send(result)
        // console.log(newJob);

    })


    // get all data, get one data, get some data
    app.get('/job-application', async (req, res) => {
        const email = req.query.email;
        const query = {applicant_email: email}
        const result = await jobApplicationCollection.find(query).toArray();

        res.send(result)
    })


    // job application api: backend;
    app.post('/job-application', async (req, res) =>{
        const application = req.body;
        const result = await jobApplicationCollection.insertOne(application);
        res.send(result);
    })


    // single data from data base ; (data load 'View Details Application')
    app.get('/job-application/jobs/:job_id', async (req, res)  =>{
        const jobId = req.params.job_id;
        const query = {job_id: jobId}
        const result = await jobApplicationCollection.find(query).toArray()
        res.send(result)
        // console.log(result);
        
    })





  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









app.get('/', (req, res) => {
    res.send('hello world')
});

app.listen(port, () => {
    console.log(`server test ok ${port}`);
})