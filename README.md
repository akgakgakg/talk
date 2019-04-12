# talk

1. In Github for Windows, click Let's do this!
2. Type into the terminal:

```
set GOOGLE_APPLICATION_CREDENTIALS=C:\Material\github\talk\talk\credentials.json

node index --uri "gs://talkbucket/providence.wav" --samplerate 22050 --transcript "providence.txt" --language="en-UK" --encoding "LINEAR16" --model="video"
```

Transcript paths could be: `..\mytranscript.txt` or `C:\path\to\transcript.txt`

More info about Google params: https://cloud.google.com/speech-to-text/docs/basics
