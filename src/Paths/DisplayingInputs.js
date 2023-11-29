const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const router = express.Router();

// MongoDB connection 
const dbName = 'teachforindia';
const url = 'mongodb+srv://navin:student123@cluster0.uzq32jx.mongodb.net/teachforindia';

// MongoDB client creation
const client = new MongoClient(url, { useUnifiedTopology: true });

// Connecting to MongoDB database
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
app.use(express.json())
// Using  router for /specificpath
app.use('/specificpath', router);
app.use((req,res,next)=>{
  req.db=client.db(dbName);
  next();
});
// Defining a route to display all data
router.get('/displayAll', async function (req, res, next) {
  try {
    // Accessing the MongoDB database from the request object
    const db = req.db;

    
    const collection = db.collection('VolunteerData');

    // Fetching all documents from the collection
    const data = await collection.find({}).toArray();

    console.log('All data:', data);

    res.json({ message: 'Data displayed', data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data from the database' });
  }
});

//saving the data
router.post('/savevolunteerdata',async function(req,res,next){
  try{
    const db=req.db;
    const collection=db.collection('VolunteerData');
  //adding form data
    const formdata = {
      name: req.body.formData.name,
      contact: req.body.formData.contact,
      email: req.body.formData.email,
      location: req.body.formData.location,
      language: req.body.checkedLanguageValue || [],
      availability: req.body.checkedWeekValue || [],
    };

    //inserting data in collection
    await collection.insertOne(formdata);
    res.status(201).json({ message: 'Data saved successfully' });
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

module.exports = app;
