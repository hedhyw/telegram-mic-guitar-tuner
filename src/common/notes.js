// Note represents a music note with the name and the pitch.
export class Note {
  constructor(name, frequency) {
    this._frequency = frequency;
    this._name = name;
  }

  get name() {
    return this._name;
  }

  difference(frequency) {
    return this._frequency - frequency;
  }
}

// Standard tuning is the tuning most frequently used on a six-string guitar.
//
// More details: https://en.wikipedia.org/wiki/Guitar_tunings#Standard.
export default function getStandartTuning() {
  return [
    new Note('e4', 329.63),
    new Note('B3', 246.94),
    new Note('G3', 196.00),
    new Note('D3', 146.83),
    new Note('A2', 110.00),
    new Note('E2', 82.41),
  ];
};
