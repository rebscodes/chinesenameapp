import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Header from '../components/Header';
import ResultsSection from '../components/ResultsSection';
import App from '../App';
import { TEST_SYLLABLES, TEST_NAMES, createPronunciationString } from '../utils/testUtils';
import { EXAMPLE_NAMES_STRING } from '../utils/pinyinUtils';

describe('Header Component', () => {
  test('renders header with title and description', () => {
    render(<Header />);
    expect(screen.getByText('Pinyin Helper')).toBeInTheDocument();
    expect(screen.getByText('A simplified guide for pronouncing Chinese')).toBeInTheDocument();
  });
});

describe('ResultsSection Component', () => {
  test('shows speaker button for Chinese input', () => {
    render(
      <ResultsSection 
        pronunciation="zhang wei" 
        originalInput="张伟"
      />
    );
    expect(screen.getByRole('button', { name: /listen to pronunciation/i })).toBeInTheDocument();
  });

  test('does not show speaker button for pinyin input', () => {
    render(
      <ResultsSection 
        pronunciation="zhang wei" 
        originalInput="zhang wei"
      />
    );
    expect(screen.queryByRole('button', { name: /listen to pronunciation/i })).not.toBeInTheDocument();
  });

  test('shows tone note for pinyin input', () => {
    render(
      <ResultsSection 
        pronunciation="zhang wei" 
        originalInput="zhang wei"
      />
    );
    expect(screen.getByText(/This describes syllable sounds only. Tones are important to proper Chinese pronunciation but not covered here./i)).toBeInTheDocument();
  });

  test('does not show tone note for Chinese input', () => {
    render(
      <ResultsSection 
        pronunciation="zhang wei" 
        originalInput="张伟"
      />
    );
    expect(screen.queryByText(/This describes syllable sounds only. Tones are important to proper Chinese pronunciation but not covered here./i)).not.toBeInTheDocument();
  });
});

describe('App Integration', () => {
  test('renders header and input field', () => {
    render(<App />);
    expect(screen.getByText('Pinyin Helper')).toBeInTheDocument();
    expect(screen.getByText('Enter Chinese Word or Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get pronunciation/i })).toBeInTheDocument();
  });

  test('displays pronunciation for valid input', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/e.g.,/i);
    await userEvent.type(input, '张伟');
    await userEvent.click(screen.getByRole('button', { name: /get pronunciation/i }));
    await waitFor(() => {
      expect(screen.getByText(/Pronunciation Guide/i)).toBeInTheDocument();
    });
  });
}); 
