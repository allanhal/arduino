import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

// Replace with your Arduino's serial port path
const arduinoPath = '/dev/tty.usbserial-210';

// Create a SerialPort instance
const serialPort = new SerialPort({
  path: arduinoPath,
  baudRate: 9600, // Ensure this matches the baud rate in your Arduino sketch
});

// Set up a parser to handle incoming data
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Event listener for when the port is successfully opened
serialPort.on('open', () => {
  console.log(`Serial port ${arduinoPath} opened successfully.`);

  // Example: Write data to the Arduino
  serialPort.write('Hello Arduino!', (err) => {
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
serialPort.on('error', (err) => {
  console.error('Serial port error:', err.message);
});
