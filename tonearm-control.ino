#include <Servo.h>

// Define constants and delays
const int defaultDelay = 0;
const int servoMovementDelay = 1000;

// Define button pins
const int button1Pin = 2;
const int button2Pin = 3;
const int button3Pin = 4;
const int button4Pin = 7;

// Variables to store button states
int button1State = 0;
int button2State = 0;
int button3State = 0;
int button4State = 0;

// Servo objects
Servo servo_5_position;
Servo servo_6_reset;
Servo servo_9_armlift;

// Function prototypes
void setNewPositionSlow(int position);

void setup()
{
  Serial.begin(9600);

  pinMode(LED_BUILTIN, OUTPUT);

  // Attach servos
  servo_5_position.attach(5, 500, 2500);
  servo_6_reset.attach(6, 500, 2500);
  servo_9_armlift.attach(9, 500, 2500);

  // Initialize servos to 0
  servo_5_position.write(0);
  servo_6_reset.write(0);
  servo_9_armlift.write(0);

  // Configure button pins
  pinMode(button1Pin, INPUT_PULLUP);
  pinMode(button2Pin, INPUT_PULLUP);
  pinMode(button3Pin, INPUT_PULLUP);
  pinMode(button4Pin, INPUT_PULLUP);
}

void loop()
{
  digitalWrite(LED_BUILTIN, HIGH);

  // Read button states
  button1State = digitalRead(button1Pin);
  button2State = digitalRead(button2Pin);
  button3State = digitalRead(button3Pin);
  button4State = digitalRead(button4Pin);

  if (button1State == LOW)
  {
    setNewPositionSlow(90);
  }

  if (button2State == LOW)
  {
    setNewPositionSlow(180);
  }

  if (button3State == LOW)
  {
    servo_6_reset.write(180);
  }

  if (button4State == LOW)
  {
    servo_6_reset.write(0);
  }

  delay(defaultDelay);
  digitalWrite(LED_BUILTIN, LOW);
  delay(defaultDelay);
}

// Function to move the servo to a new position with default delay
void setNewPositionSlow(int position)
{
  servo_9_armlift.write(90); // Tonearm up
  delay(1000);

  servo_6_reset.write(90); // Reset tonearm to start
  delay(1000);
  servo_6_reset.write(0);

  servo_5_position.write(position); // Move tonearm to the specified position
  delay(2000);
  servo_5_position.write(0);

  servo_9_armlift.write(0); // Tonearm down
}
