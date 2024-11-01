const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { initializeApp } = require('firebase-admin/app');

const app = express();

// Initialize Firebase Admin SDK
initializeApp();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Software Schema
const softwareSchema = new mongoose.Schema({
  name: String,
  type: String,
  licensingType: String,
  cost: Number,
  notes: String
});

const Software = mongoose.model('Software', softwareSchema);

// Routes
app.get('/api/softwares', async (req, res) => {
  const softwares = await Software.find();
  res.json(softwares);
});

app.post('/api/softwares', async (req, res) => {
  const software = new Software(req.body);
  await software.save();
  res.status(201).json(software);
});

app.put('/api/softwares/:id', async (req, res) => {
  const software = await Software.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(software);
});

app.delete('/api/softwares/:id', async (req, res) => {
  await Software.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));