#include <Stepper.h>
//              steps IN1 IN3 IN2 IN4
Stepper stepper1(2048, 22, 26, 24, 28);

//              steps IN1 IN3 IN2 IN4
Stepper stepper2(2048, 30, 34, 32, 36);

//              steps IN1 IN3 IN2 IN4
Stepper stepper3(2048, 38, 42, 40, 44);

void setup() {
  stepper1.setSpeed(1);
  stepper2.setSpeed(1);
  stepper3.setSpeed(1);
}

void loop() {
  stepper1.step(200);
  delay(1000);
  stepper1.step(-200);
  delay(1000);

  stepper2.step(200);
  delay(1000);
  stepper2.step(-200);
  delay(1000);

  stepper3.step(200);
  delay(1000);
  stepper3.step(-200);
  delay(1000);

}