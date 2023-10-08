import React from 'react';
import Indicator from './Indicator';
import MicOffIcon from '@mui/icons-material/MicOff';
import { PitchDetector } from 'pitchy';
import styles from '@/styles/Tuner.module.css';
import getStandartTuning from '../../common/notes';

// MINIMUM_CLARITY is the minimum clarity of the pitch.
// Smaller value - more noise. It can be from 0 to 1.
const MINIMUM_CLARITY = 0.8;
// PITCH_REFRESH_INTERVAL_MILLISECONDS is the interval
// between pitch analysis in milliseconds.
// A higher value will make the pitch change smoother.
const PITCH_REFRESH_INTERVAL_MILLISECONDS = 250;

// The tuner analyzes the audio stream of the microphone.
export default class Tuner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      frequency: Infinity,
      permissionGranted: true,
    };

    this._notes = getStandartTuning();
  }

  render() {
    return (
      <div>
        {!this.state.permissionGranted && <div className={styles}>
          <p className={styles.warningIcon}>
            <MicOffIcon fontSize='inherit' />
          </p>
          <p className={styles.warningText}>
            Unable to access the microphone.<br />
            Please try the application from another device or reload the page.
          </p>
        </div>}
        {this.state.permissionGranted && this.state.frequency !== Infinity &&
          <Indicator
            frequency={this.state.frequency}
            notes={this._notes} />
        }
      </div>
    );
  }

  _setFrequency(frequency) {
    this.setState({
      frequency: Math.round(frequency),
    });
  }

  _setPermissionDenied() {
    this.setState({
      permissionGranted: false,
    });
  }

  componentDidMount() {
    // Configure the audio stream from the microphone.
    navigator.getUserMedia = navigator?.getUserMedia
      || navigator?.webkitGetUserMedia
      || navigator?.mozGetUserMedia;

    if (navigator?.getUserMedia) {
      navigator?.getUserMedia(
        { video: false, audio: true },
        (stream) => this._audioCallback(stream),
        (err) => {
          this._setPermissionDenied();
          console.error(err);
        },
      );
    } else {
      this._setPermissionDenied();
    }
  }

  // _audioCallback handles callback from the stream.
  _audioCallback(stream) {
    const audioContext = new AudioContext();
    const microphoneSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    microphoneSource.connect(analyser);

    const pitchDetector = PitchDetector.forFloat32Array(analyser.fftSize);
    const input = new Float32Array(pitchDetector.inputLength);

    this._play = () => {
      analyser.getFloatTimeDomainData(input);
      const [frequency, clarity] = pitchDetector.findPitch(input, audioContext.sampleRate);

      if (clarity > MINIMUM_CLARITY) {
        this._setFrequency(frequency);
      }

      console.debug(frequency, clarity);

      setTimeout(this._play, PITCH_REFRESH_INTERVAL_MILLISECONDS);
    };

    this._play();
  }

  componentWillUnmount() {
    this._play = () => { };
  }
}
