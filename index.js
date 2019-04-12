// Imports the Google Cloud client library
const fs = require('fs');
const speech = require('@google-cloud/speech');
const program = require('commander');


// Creates a client
const client = new speech.SpeechClient();

program
  .option('-u, --uri [path]', 'GCS uri to audio file to be transcribed')
  .option('-t, --transcript [path]', 'Filename of transcript text file')
  .option('-e, --encoding [encoding]', 'Audio file encoding: "LINEAR16" | ...  ')
  .option('-s, --samplerate [rate]', 'Audio file sample rate in hertz: 22050', parseInt)
  .option('-l, --language [lang]', 'Language code: "en-US"')
  .option('-m, --model [model]', 'Enhanced model: "default" | "video"')
  .parse(process.argv);


// Defaults
let uri = program.uri || 'gs://talkbucket/shorttestmono.wav'
let encoding = program.encoding || 'LINEAR16'
let sampleRateHertz = program.samplerate || 44100
let languageCode = program.language || 'en-US'
let transcriptFileName = program.transcript || 'transcript.txt'
let model = program.model || 'video' 

console.log('')
console.log('GCS Uri:', uri) 
console.log('Transcript:', transcriptFileName) 
console.log('Encoding:', encoding) 
console.log('Sample rate:', sampleRateHertz) 
console.log('Language code:', languageCode) 
console.log('')

const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
  useEnhanced: true,
  model: model,
};

const audio = {
  uri: uri //'gs://talkbucket/shorttestmono.wav',
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

  // Try saving to file
  fs.writeFile(transcriptFileName, transcription, (err) => {
    if (err)
      console.log(err);
    console.log("\nSuccessfully written to file:", transcriptFileName);
  });
}

run()
