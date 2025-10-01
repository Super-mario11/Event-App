const express = require('express');
const cors = require('cors');
require('dotenv').config({quiet:true});
const connectDB = require('./config/db');

// Route imports
const userRoutes = require('./routes/userRoutes');
const oAuth = require('./routes/oAuth');
const eventsRoute = require('./routes/eventRoutes');
const organizerRoute = require('./routes/organizerRoutes');
const bookingRoute = require('./routes/bookingRoutes');
const chatbotRoute= require('./routes/chatbotRoute')
<<<<<<< HEAD

const app = express();
// REMOVED: const notificationRoutes = require("./routes/notificationRoutes");
// REMOVED: app.use("/api/notifications", notificationRoutes);

=======
const app = express();
const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

 
>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c

// Middleware
app.use(cors());
app.use(express.json());

connectDB()
// API Routes
app.use('/api/users',userRoutes );
app.use('/api/oauth',oAuth );
app.use('/api/events',eventsRoute );
app.use('/api/organizer',organizerRoute );
app.use('/api/booking',bookingRoute );
app.use('/api/chatbot',chatbotRoute );

// Root route
app.get('/', (req, res) => {
<<<<<<< HEAD
res.send(' server is running');
=======
res.send(' server  is running');
>>>>>>> bd6794f7826b0140cc10a2df8ff03ed5923a125c
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});