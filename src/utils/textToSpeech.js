export const speak = (text, rate = 0.8) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech is not supported in this browser');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  speechSynthesis.speak(utterance);
}; 