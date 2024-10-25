import React, { useState } from "react";
import '@/widgets/assets/style.css';
import { FaMicrophone } from "react-icons/fa"; 

const SpeechToTextIcon = ({ onStartRecording }) => {
  return (
 <div className="custom-button-microphone" id="startRecordingButton" onClick={onStartRecording}>
<FaMicrophone /> {/* Utilisation de l'icône de microphone */}
</div>
  );
};

const SpeechToText = ({ onTranscriptChange,language }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const startRecording = () => {
    setIsRecording(true);
    setTranscript(""); 
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      onTranscriptChange(speechResult);
      setIsRecording(false);
    };
    recognition.start();
  };

  return (
    <div>
      <SpeechToTextIcon onStartRecording={startRecording} />
      <p className="fixed bottom-[35px] left-[100px] text-orange-500 text-xl"> {transcript}</p>
    </div>
  );
};

export default SpeechToText;