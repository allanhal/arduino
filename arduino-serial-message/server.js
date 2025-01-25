import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import express from "express";
const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// GET route without parameters
app.get("/", async (req, res) => {
  let result = "";
  try {
    const ports = await SerialPort.list();

    ports.forEach((port) => {
      console.log(port.path);
      result += port.path + "<br>";
    });
  } catch (error) {
    console.error("Error listing ports:", error);
  }

  res.send("Welcome to the homepage! <br><br>" + result);
});

// GET route without parameters
app.get("/list", async (req, res) => {
  let result = [];
  try {
    const ports = await SerialPort.list();

    ports.forEach((port) => {
      result.push(port.path);
    });

    // res.json({ ports: ports.map((port) => port.path) });
    res.json(ports.map((port) => port.path));
  } catch (error) {
    console.error("Error listing ports:", error);
    res.status(500).send("Error listing ports");
  }
});

// GET route with parameters
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`User ID is: ${userId}`);
});

// POST route
app.post("/submit", (req, res) => {
  const { name, email } = req.body;
  res.send(`Received submission from ${name} with email ${email}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
