export class ObjectId {
  static increment = 0;
  static pid = Math.floor(Math.random() * (32767));
  static machine = Math.floor(Math.random() * (16777216));

  static create(): string {
    ObjectId.increment++;
    if (ObjectId.increment > 0xffffff) {
      ObjectId.increment = 0;
    }

    const timestamp = Math.floor(new Date().valueOf() / 1000).toString(16);
    const machine = ObjectId.machine.toString(16);
    const pid = ObjectId.pid.toString(16);
    const increment = ObjectId.increment.toString(16);
    return '00000000'.substr(0, 8 - timestamp.length) + timestamp +
      '000000'.substr(0, 6 - machine.length) + machine +
      '0000'.substr(0, 4 - pid.length) + pid +
      '000000'.substr(0, 6 - increment.length) + increment;
  }
}
