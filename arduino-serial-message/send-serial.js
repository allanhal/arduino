import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';


console.log('');
console.log('Listing devices...');
SerialPort.list().then((ports) => {
  ports.forEach((port) => {
    console.log(port.path);
    // if (port.path === "/dev/tty.usbserial-210") {
    //   console.log("found arduino");
    // }
  });
});
console.log('');

// Replace with your Arduino's serial port path
const arduinoPath = '/dev/tty.usbserial-210';

// Create a SerialPort instance
const port = new SerialPort({
  path: arduinoPath,
  baudRate: 9600, // Ensure this matches the baud rate in your Arduino sketch
});

// Set up a parser to handle incoming data
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Event listener for when the port is successfully opened
port.on('open', () => {
  console.log(`Serial port ${arduinoPath} opened successfully.`);

  // Example: Write data to the Arduino
  port.write('Hello Arduino!', (err) => {
    if (err) {
      return console.error('Error writing to Arduino:', err.message);
    }
    console.log('Message sent to Arduino.');
  });
});

// Event listener for incoming data from the Arduino
parser.on('data', (data) => {
  console.log(`Received from Arduino: ${data}`);
});

// Error handling
port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});
