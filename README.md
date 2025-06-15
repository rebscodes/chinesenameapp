# Pinyin Helper

A user-friendly web application that helps English speakers pronounce Chinese names by converting Pinyin syllables into English sound-alikes. Perfect for quick reference when meeting new people or learning Chinese pronunciation basics.

## Features

- **Simple Input**: Type Pinyin syllables to get English sound-alikes
- **Tone Information**: View tone descriptions when Chinese characters are provided
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

## What is Pinyin?

Pinyin is the most common romanization system for Mandarin Chinese. Each Chinese character has a corresponding Pinyin spelling - for example, the characters 中文 (meaning "Chinese language") are written as "zhōng wén" in Pinyin. Tone marks above the syllables indicate pitch changes - the same syllable with a different tone can have a completely different meaning.

## Limitations

This app focuses only on Mandarin Pinyin and basic syllable sounds. It doesn't cover:
- Tones (unless provided with Chinese characters)
- Other dialects of Chinese (Cantonese/Jyutping, Hokkien, Shanghainese)
- Other romanizations of Mandarin (Wade-Giles, etc.)
- Special sounds (ü)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pinyin-helper.git
cd pinyin-helper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Technologies Used

- React
- Tailwind CSS
- Vite
- Pinyin conversion utilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
