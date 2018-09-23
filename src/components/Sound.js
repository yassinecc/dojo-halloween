const soundObject = new Expo.Audio.Sound();

const init = async () => {
  try {
    await soundObject.loadAsync(require('dojo-halloween/assets/scream.mp3'));
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

export default { init, playScream };
