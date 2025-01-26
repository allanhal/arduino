// #include <Servo.h>
#include <Servo.h> 

// Pins for buttons
const int button1Pin = 8;
const int button2Pin = 9;
const int button3Pin = 10;

// Button states
bool button1State = false;
bool lastButton1State = false;

bool button2State = false;
bool lastButton2State = false;

bool button3State = false;
bool lastButton3State = false;

// Servo objects
Servo servo1;
Servo servo2;
Servo servo3;
Servo servo4;
Servo servo5;

Servo* currentServo = nullptr; // Pointer to the currently active servo
int currentServoNumber = 0;

int currentDelay = 80;

// Function to move the servo slowly
void moveServoSlowly(Servo &servo, int targetPosition, int stepDelay) {
  int currentPosition = servo.read(); // Get the current servo position
  if (targetPosition > currentPosition) {
    // Move servo up
    for (int pos = currentPosition; pos <= targetPosition; pos++) {
      servo.write(pos);
      delay(stepDelay);
    }
  } else if (targetPosition < currentPosition) {
    // Move servo down
    for (int pos = currentPosition; pos >= targetPosition; pos--) {
      servo.write(pos);
      delay(stepDelay);
    }
  }
}

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(button1Pin, INPUT_PULLUP);
  pinMode(button2Pin, INPUT_PULLUP);
  pinMode(button3Pin, INPUT_PULLUP);

  // SERVO - 2
  servo2.write(45); // Default position to servo2
  servo2.attach(3);
  
  // SERVO - 1
  servo1.write(90); // Default position to servo1
  servo1.attach(2);

  // SERVO - 3
  servo3.write(0); // Default position to servo3
  servo3.attach(4);

  // SERVO - 4
  servo4.write(90); // Default position to servo4
  servo4.attach(5);

  // SERVO - 5
  servo5.write(180); // Default position to servo5
  servo5.attach(6);
  
  currentServo = &servo1;
  
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
    String message = Serial.readString();
    String axis = message.substring(0, 1);
    int step = message.substring(1).toInt();

    if (axis == "s") {
      Serial.println("currentDelay"+String(currentDelay) + " - step"+String(step));
      currentDelay = step;
    } else if(axis != "" && step != 0){
      int newPosition;

      Servo* servoToMove = &servo1;

      if (axis == "x") {
        servoToMove = &servo1;
      } else if (axis == "y") {
        servoToMove = &servo2;
      } else if (axis == "z") {
        servoToMove = &servo3;
      } else if (axis == "a") {
        servoToMove = &servo4;
      } else if (axis == "b") {
        servoToMove = &servo5;
      }

      // if(step > 0 ){
      //   newPosition = min(servoToMove->read() + step, 180); // Ensure position stays within 0-180
      // } else {
      //   newPosition = max(servoToMove->read() + step, 0); // Ensure position stays within 0-180
      // }

      newPosition = servoToMove->read() + step;

      moveServoSlowly(*servoToMove, newPosition, currentDelay); // Pass by reference
      Serial.println("x"+String(servo1.read())+" - y"+String(servo2.read())+" - z"+String(servo2.read())+" - a"+String(servo2.read())+" - b"+String(servo2.read())+" - s"+String(servo2.read()));
    }
    
    // Read button states
    button1State = digitalRead(button1Pin) == LOW;
    button2State = digitalRead(button2Pin) == LOW;
    button3State = digitalRead(button3Pin) == LOW;

    // Button 1: Move servo slowly up
    if (button1State && !lastButton1State) {
      digitalWrite(LED_BUILTIN, HIGH);
      if (currentServo != nullptr) {
        int newPosition = min(currentServo->read() + 10, 180); // Ensure position stays within 0-180
        moveServoSlowly(*currentServo, newPosition, currentDelay); // Pass by reference
      }
    }

    // Button 2: Move servo slowly down
    if (button2State && !lastButton2State) {
      digitalWrite(LED_BUILTIN, LOW);
      if (currentServo != nullptr) {
        int newPosition = max(currentServo->read() - 10, 0); // Ensure position stays within 0-180
        moveServoSlowly(*currentServo, newPosition, currentDelay); // Pass by reference
      }
    }

    // Button 3: Switch servo
    if (button3State && !lastButton3State) {
      currentServoNumber = (currentServoNumber + 1) % 5;
      if (currentServoNumber == 0) {
        currentServo = &servo1;
      } else if (currentServoNumber == 1) {
        currentServo = &servo2;
      } else if (currentServoNumber == 2) {
        currentServo = &servo3;
      } else if (currentServoNumber == 3) {
        currentServo = &servo4;
      } else if (currentServoNumber == 4) {
        currentServo = &servo5;
      }
    }

    // Save button states for debounce
    lastButton1State = button1State;
    lastButton2State = button2State;
    lastButton3State = button3State;
    delay(50); // Debounce delay
  }
}
