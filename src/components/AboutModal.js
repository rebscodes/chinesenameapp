import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 overflow-hidden flex items-center justify-center">
                <img src="/logo3.png" alt="Pinyin Helper Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Pinyin Helper!</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div className="space-y-6 text-gray-700">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What is Pinyin?</h3>
              <p>
                Pinyin is the most common romanization system for Mandarin Chinese. Each Chinese character has a corresponding pinyin spelling - for example, the characters 中文 (meaning "Chinese language") are written as "zhōng wén" in pinyin. Tone marks above the syllables indicate pitch changes - the same syllable with a different tone can have a completely different meaning.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What This App Does</h3>
              <p>
                It converts Chinese pinyin syllables into English sound-alikes. It's intended to be used as quick reference when meeting someone new!
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What This App Doesn't Do</h3>
              <p className="mb-2">
                This app focuses only on Mandarin pinyin and basic syllable sounds. It doesn't cover:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>tones (unless provided with Chinese characters)</li>
                <li>other dialects of Chinese (cantonese/jyutping, hokkien, shanghainese)</li>
                <li>other romanizations of Mandarin (wade giles, etc.)</li>
                <li>special sounds (ü)</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

AboutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AboutModal; 