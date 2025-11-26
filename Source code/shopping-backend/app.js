const bcrypt = require('bcrypt');
const User = require('./models/User');

const Order = require('./models/Order');




const Product = require('./models/Product');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());

const PORT = 5000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Basic route
app.get('/', (req, res) => {
  res.send('Shopping API is working!');
});

app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const user = await db.collection("users").findOne({ email });

  
    try {
      // check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });
  
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // save user
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error registering user' });
    }
  });

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: 'Incorrect password' });
  
      res.json({ message: 'Login successful' });
    } catch (err) {
      res.status(500).json({ message: 'Login error' });
    }
  });



/*app.post('/order', async (req, res) => {
    const { userEmail, products } = req.body;
  
    try {
      const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
      const order = new Order({
        userEmail,
        products,
        total
      });
  
      await order.save();
  
      res.status(201).json({ message: 'Order placed successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error placing order' });
    }
  });*/

/*app.get('/orders', async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  });*/

// POST route to receive and store orders



app.post('/orders', async (req, res) => {
  console.log("📥 Order received:", req.body);
  try {
    console.log("📥 Full request body:", req.body); 
    const { items, userEmail } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Missing order data" });
    }

    const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    const newOrder = new Order({
      userEmail,
      items,
      total,
      createdAt: new Date()
    });

    await newOrder.save();

    console.log("✅ Order saved successfully");
    res.status(201).json({ message: "Order placed successfully!" });
  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/*app.post('/orders', async (req, res) => {
  console.log("📥 Order received:", req.body);
  try {
    const { items, userEmail, total } = req.body;

    if (!items || items.length === 0 || !userEmail) {
      return res.status(400).json({ message: "Missing order data" });
    }

    const newOrder = new Order({
      items,
      userEmail,
      total
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully!" });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Server error" });
  }
});*/



  
    
  

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

