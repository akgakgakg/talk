// Imports the Google Cloud client library
const fs = require('fs');
const speech = require('@google-cloud/speech');
const program = require('commander');


// Creates a client
const client = new speech.SpeechClient();

program
  .option('-i, --infile [path]', 'Audio file to be transcribe')
  .option('-e, --encoding [enc]', 'Audio file encoding: "LINEAR16" | ...  ')
  .option('-s, --samplerate [rate]', 'Audio file sample rate in hertz: 22050')
  .option('-l, --language [rate]', 'Language code: "en-UK"')
  .parse(process.argv);


let filename = program.infile || './providence.wav'
let encoding = program.encoding || 'LINEAR16'
let sampleRateHertz = program.samplerate || 22050
let languageCode = program.language || 'en-UK'

console.log('')
console.log('Audio file:', filename) 
console.log('Encoding:', encoding) 
console.log('Sample rate:', sampleRateHertz) 
console.log('Language code:', languageCode) 
console.log('')

const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
};

const audio = {
  content: fs.readFileSync(filename).toString('base64'),
};

const request = {
  config: config,
  audio: audio,
};

// Detects speech in the audio file
const run = async function() {
  const [operation] = await client.longRunningRecognize(request);
  const [response] = await operation.promise();
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: `, transcription);
}

run()
