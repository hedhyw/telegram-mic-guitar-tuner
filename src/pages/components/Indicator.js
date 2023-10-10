import { SwitchTransition, CSSTransition } from 'react-transition-group';
import lo from 'lodash';
import styles from '@/styles/Indicator.module.css';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

// FULL_CIRCLE is the radius of the full circle in degrees. It should not be changed.
const FULL_CIRCLE = 360;
// MIN_FREQUENCY is the lowest frequency that is showed on the component.
const MIN_FREQUENCY = 30;
// MAX_DIFFERENCE is the maximum difference between the current frequency
// and the frequency of the highest note.
const MAX_DIFFERENCE = 60;
// ROTATION_OFFSET is an initial rotation offset of the circle.
// 10% is the size of the segment.
// 50% is a half of the segment to center it.
const ROTATION_OFFSET = -FULL_CIRCLE * 0.1 * 0.5;
// GOOD_FREQUENCY_GAP is frequency tolerance to show a successful message.
const GOOD_FREQUENCY_GAP = 2;

function getHint(isNearestFound, difference) {
  let textHint = 'Pull any guitar string';

  if (isNearestFound && difference >= GOOD_FREQUENCY_GAP) {
    textHint = 'Tune down';
  }

  if (isNearestFound && difference <= -GOOD_FREQUENCY_GAP) {
    textHint = 'Tune up';
  }

  if (isNearestFound && Math.abs(difference) < GOOD_FREQUENCY_GAP) {
    textHint = 'Good!';
  }

  return textHint;
}

function getRotationByDifference(difference, isNearestFound) {
  let rotation = difference / MAX_DIFFERENCE;

  if (!isNearestFound) {
    rotation = 0;
  } else if (rotation > 1.0) {
    rotation = 1.0;
  }

  rotation *= FULL_CIRCLE;

  return rotation;
}

// Indicator displays the current tuner data.
export default function Indicator({ notes, frequency }) {
  if (!notes) {
    return <div>Notes are not specified.</div>;
  }

  const nearestNote = lo.minBy(
    notes,
    (note) => Math.abs(note.difference(frequency)),
  ) || notes[0];

  // The difference should be inverted since the adjustment should be applied
  // in the opposite direction.
  const difference = -nearestNote.difference(frequency);
  const isNearestFound = Math.abs(difference) < MAX_DIFFERENCE && frequency > MIN_FREQUENCY;

  const rotation = getRotationByDifference(difference, isNearestFound);
  const textHint = getHint(isNearestFound, difference);
  const textNote = isNearestFound ? nearestNote.name : <MusicNoteIcon fontSize='inherit' />;

  const addEndListener = (node, done) => node.addEventListener('transitionend', done, false);

  return <div className={styles.indicator}>
    <div className={styles.indicatorMain}>
      <div className={styles.indicatorArrowDown}></div>

      <div className={styles.indicatorCircle} style={{ rotate: `${rotation + ROTATION_OFFSET}deg` }}></div>
      <div className={styles.indicatorText}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={textNote}
            addEndListener={addEndListener}
            classNames="fade">
            <p className={!isNearestFound ? styles.noteUnknown : ''}>
              {textNote}
            </p>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
    <div className={styles.indicatorHint}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={textHint}
          addEndListener={addEndListener}
          classNames="fade">
          <p>{textHint}</p>
        </CSSTransition>
      </SwitchTransition>
    </div>
  </div>;
}
