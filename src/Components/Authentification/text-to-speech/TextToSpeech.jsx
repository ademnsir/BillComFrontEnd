import React, { useState, useEffect } from "react";

const TextToSpeech = ({ text, language, voiceIndex }) => {
  const [utterance, setUtterance] = useState(null);
  const [voices, setVoices] = useState([]);
  const [isReady, setIsReady] = useState(false); 

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = language;
    u.rate = 1.0;

    setUtterance(u);

    const updateVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (voiceIndex !== undefined && availableVoices.length > voiceIndex) {
        u.voice = availableVoices[voiceIndex];
        setIsReady(true); 
      }
    };

    updateVoices();

    synth.addEventListener("voiceschanged", updateVoices);

    return () => {
      synth.removeEventListener("voiceschanged", updateVoices);
      synth.cancel();
    };
  }, [text, language, voiceIndex]);

  useEffect(() => {
    if (utterance && isReady) { 
      window.speechSynthesis.speak(utterance);
    }
  }, [utterance, isReady]);

  return <div>{/* Aucun besoin de rendre quoi que ce soit ici */}</div>;
};

export default TextToSpeech;