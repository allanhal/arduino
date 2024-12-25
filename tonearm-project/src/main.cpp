#include <Arduino.h>
#include <Servo.h>

// Define constants and variables
const int button1Pin = 2; // Pin for the button
const int button2Pin = 3; // Pin for the button
const int button3Pin = 4; // Pin for the button
const int button4Pin = 7; // Pin for the button

int button1State = 0;     // Variable to store button state
int button2State = 0;     // Variable to store button state
int button3State = 0;     // Variable to store button state
int button4State = 0;     // Variable to store button state

int pos = 0;    // variable to store the servo position

Servo servo_5;
Servo servo_6;

void setup() {
  Serial.begin(9600); // Initialize Serial communication

  pinMode(LED_BUILTIN, OUTPUT);

  servo_5.attach(5, 500, 2500); // Attach servo to pin 5
  servo_6.attach(6, 500, 2500); // Attach servo to pin 6
  servo_5.write(0);
  servo_6.write(0);

  pinMode(button1Pin, INPUT_PULLUP); // Set button pin as input with pull-up resistor
  pinMode(button2Pin, INPUT_PULLUP); // Set button pin as input with pull-up resistor
  pinMode(button3Pin, INPUT_PULLUP); // Set button pin as input with pull-up resistor
  pinMode(button4Pin, INPUT_PULLUP); // Set button pin as input with pull-up resistor
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  button1State = digitalRead(button1Pin);
  button2State = digitalRead(button2Pin);
  button3State = digitalRead(button3Pin);
  button4State = digitalRead(button4Pin);

  if (button1State == LOW) {
    
    servo_5.write(90);
    delay(2000);
    servo_6.write(180);
    delay(2000);
  }

  if (button2State == LOW) {
    // servo_6.write(90);
    for (pos = 0; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
      // in steps of 1 degree
      servo_6.write(pos);              // tell servo to go to position in variable 'pos'
      delay(15);                       // waits 15ms for the servo to reach the position
    }
    for (pos = 180; pos >= 0; pos -= 1) { // goes from 180 degrees to 0 degrees
      servo_6.write(pos);              // tell servo to go to position in variable 'pos'
      delay(15);                       // waits 15ms for the servo to reach the position
    }
  }

  if (button3State == LOW) {
    servo_6.write(servo_6.read()+5);
    delay(300);
  }
  if (button4State == LOW) {
    servo_6.write(servo_6.read()-5);
    delay(300);
  }

  // Print the current servo_6 angle to the Serial Monitor
  Serial.print("Current Angle of servo_6: ");
  Serial.println(servo_6.read());

  delay(20);
  digitalWrite(LED_BUILTIN, LOW);
  delay(20);
}


// put function declarations here:
int myFunction(int, int);

void setup() {
  // put your setup code here, to run once:
  int result = myFunction(2, 3);
}

void loop() {
  // put your main code here, to run repeatedly:
}

// put function definitions here:
int myFunction(int x, int y) {
  return x + y;
}