import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import express from "express";
const app = express();
const port = 3000;

let currentPort = null;
let serialPort = null;

let received = ""

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

app.get("/ports", async (req, res) => {
  let result = [];
  try {
    const ports = await SerialPort.list();

    ports.forEach((port) => {
      result.push(port.path);
    });

    res.json(ports.map((port) => port.path));
  } catch (error) {
    console.error("Error listing ports:", error);
    res.status(500).send("Error listing ports");
  }
});

app.get("/currentPort", async (req, res) => {
  res.json(currentPort);
});

app.get("/setCurrentPort", (req, res) => {
  const port = req.query.port;
  console.log({ port, currentPort });

  currentPort = port;

  if (currentPort) {
    connectToPort(port);
  } else {
    switchPort(currentPort, port);
  }

  res.json(currentPort);
});

app.get("/setServoStep", (req, res) => {
  const { servo, step } = req.query;
  const message = servo + step;

  if (serialPort) {
    serialPort.write(message, (err) => {
      if (err) {
        return console.error("Error writing to Arduino:", err.message);
      }
      console.log("Sent: " + message);
    });
  }

  res.json(message);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Function to connect to a new serial port
const connectToPort = (arduinoPath) => {
  // Create a new SerialPort instance
  serialPort = new SerialPort({
    path: arduinoPath,
    baudRate: 9600, // Ensure this matches the baud rate in your Arduino sketch
  });

  // Set up a parser to handle incoming data
  const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  // Event listener for when the port is successfully opened
  // serialPort.on("open", () => {
  //   console.log(`Serial port ${arduinoPath} opened successfully.`);

  //   // Example: Write data to the Arduino
  //   serialPort.write("Hello Arduino!", (err) => {
  //     if (err) {
  //       return console.error("Error writing to Arduino:", err.message);
  //     }
  //     console.log("Message sent to Arduino.");
  //   });
  // });

  // Event listener for incoming data from the Arduino
  parser.on("data", (data) => {
    console.log(`Received: ${data}`);
  });

  // Error handling
  serialPort.on("error", (err) => {
    console.error("Serial port error:", err.message);
  });

  return serialPort;
};

// Disconnect from the current port and connect to a new one
const switchPort = (currentPort, newPortPath) => {
  currentPort.close((err) => {
    if (err) {
      console.error("Error closing serial port:", err.message);
      return;
    }
    console.log("Serial port closed successfully.");
    connectToPort(newPortPath);
  });
};
