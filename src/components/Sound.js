import { Audio } from 'expo';
import { scream } from 'dojo-halloween/assets';

const soundObject: SoundType = new Audio.Sound();

const init = async () => {
  try {
    await soundObject.loadAsync(scream);
    console.log('Song load successful');
  } catch (error) {
    console.log('Error in loading sound', { error });
  }
};

const playScream = async () => {
  try {
    await soundObject.replayAsync();
    console.log('Sound played');
  } catch (error) {
    console.log('Error in playing sound', { error });
  }
};

export const Sound = { init, playScream };
