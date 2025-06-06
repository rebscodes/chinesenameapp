import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import Header from '../components/Header';
import InputSection from '../components/InputSection';
import ResultsSection from '../components/ResultsSection';
import { phonemeMap } from '../data/phonemeMap';
import { TEST_SYLLABLES, TEST_NAMES, createPronunciationString } from '../utils/testUtils';
import { EXAMPLE_NAMES_STRING } from '../utils/pinyinUtils';

describe('Header Component', () => {
  test('renders header with correct text and styling', () => {
    render(<Header />);
    expect(screen.getByText('Pinyin Helper')).toBeInTheDocument();
    expect(screen.getByText('Helping English speakers pronounce Chinese')).toBeInTheDocument();
    
    // Check for icon presence
    const icon = document.querySelector('.lucide-sparkles');
    expect(icon).toBeInTheDocument();
  });
});

describe('InputSection Component', () => {
  const mockSetInputName = jest.fn();
  const mockHandlePronounce = jest.fn();
  const mockClearInput = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all UI elements correctly', () => {
    render(
      <InputSection
        inputName=""
        setInputName={mockSetInputName}
        handlePronounce={mockHandlePronounce}
        isLoading={false}
        clearInput={mockClearInput}
      />
    );

    expect(screen.getByPlaceholderText(new RegExp(EXAMPLE_NAMES_STRING, 'i'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get pronunciation/i })).toBeInTheDocument();
    expect(screen.getByText('Enter Chinese Word or Name')).toBeInTheDocument();
    
    const icon = document.querySelector('.lucide-book-open');
    expect(icon).toBeInTheDocument();
  });

  test('handles input change and clear', () => {
    render(
      <InputSection
        inputName={TEST_SYLLABLES.SINGLE}
        setInputName={mockSetInputName}
        handlePronounce={mockHandlePronounce}
        isLoading={false}
        clearInput={mockClearInput}
      />
    );

    const input = screen.getByPlaceholderText(new RegExp(EXAMPLE_NAMES_STRING, 'i'));
    fireEvent.change(input, { target: { value: TEST_SYLLABLES.DOUBLE_FIRST } });
    expect(mockSetInputName).toHaveBeenCalledWith(TEST_SYLLABLES.DOUBLE_FIRST);

    const clearButton = screen.getByText('✕');
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);
    expect(mockClearInput).toHaveBeenCalled();
  });

  test('handles loading state correctly', () => {
    render(
      <InputSection
        inputName={TEST_SYLLABLES.SINGLE}
        setInputName={mockSetInputName}
        handlePronounce={mockHandlePronounce}
        isLoading={true}
        clearInput={mockClearInput}
      />
    );

    const button = screen.getByRole('button', { name: '' });
    expect(button).toBeDisabled();
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  test('handles Enter key press', () => {
    render(
      <InputSection
        inputName={TEST_SYLLABLES.SINGLE}
        setInputName={mockSetInputName}
        handlePronounce={mockHandlePronounce}
        isLoading={false}
        clearInput={mockClearInput}
      />
    );

    const input = screen.getByPlaceholderText(new RegExp(EXAMPLE_NAMES_STRING, 'i'));
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    expect(mockHandlePronounce).toHaveBeenCalled();
  });
});

describe('ResultsSection Component', () => {
  test('renders pronunciation guide with correct styling', () => {
    const pronunciation = createPronunciationString([TEST_SYLLABLES.SINGLE], phonemeMap);
    render(<ResultsSection pronunciation={pronunciation} />);
    
    expect(screen.getByText('Pronunciation Guide')).toBeInTheDocument();
    
    expect(screen.getByText(`"${TEST_SYLLABLES.SINGLE}"`)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(phonemeMap[TEST_SYLLABLES.SINGLE].description))).toBeInTheDocument();
    
    const icon = document.querySelector('.lucide-book-open');
    expect(icon).toBeInTheDocument();
  });

  test('handles empty pronunciation', () => {
    const { container } = render(<ResultsSection pronunciation="" />);
    expect(container.firstChild).toBeNull();
  });

  test('applies correct styling classes', () => {
    const pronunciation = createPronunciationString([TEST_SYLLABLES.SINGLE], phonemeMap);
    const { container } = render(<ResultsSection pronunciation={pronunciation} />);
    
    expect(container.firstChild).toHaveClass('bg-white', 'rounded-2xl', 'shadow-lg');
    expect(container.querySelector('p')).toHaveClass('text-green-800', 'text-lg');
  });
});

describe('App Integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  test('full app flow with loading state', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(new RegExp(EXAMPLE_NAMES_STRING, 'i'));
    await act(async () => {
      fireEvent.change(input, { target: { value: TEST_SYLLABLES.SINGLE } });
    });

    const button = screen.getByRole('button', { name: /get pronunciation/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(button).toBeDisabled();
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(800);
    });

    await waitFor(() => {
      expect(screen.getByText(/Pronunciation Guide/i)).toBeInTheDocument();
    });

    expect(screen.getByText(new RegExp(phonemeMap[TEST_SYLLABLES.SINGLE].description, 'i'))).toBeInTheDocument();
  });

  test('handles invalid input with error message', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(new RegExp(EXAMPLE_NAMES_STRING, 'i'));
    await act(async () => {
      fireEvent.change(input, { target: { value: 'xyz' } });
    });

    const button = screen.getByRole('button', { name: /get pronunciation/i });
    await act(async () => {
      fireEvent.click(button);
    });

    await act(async () => {
      jest.advanceTimersByTime(800);
    });

    await waitFor(() => {
      expect(screen.getByText('Could not parse "xyz" into valid pinyin.')).toBeInTheDocument();
    });
  });

  test('clears input and results', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(new RegExp(EXAMPLE_NAMES_STRING, 'i'));
    await act(async () => {
      fireEvent.change(input, { target: { value: 'zhang' } });
    });
    
    const button = screen.getByRole('button', { name: /get pronunciation/i });
    await act(async () => {
      fireEvent.click(button);
    });

    await act(async () => {
      jest.advanceTimersByTime(800);
    });

    await waitFor(() => {
      expect(screen.getByText(/Pronunciation Guide/i)).toBeInTheDocument();
    });

    const clearButton = screen.getByText('✕');
    await act(async () => {
      fireEvent.click(clearButton);
    });

    expect(input.value).toBe('');
    expect(screen.queryByText(/Pronunciation Guide/i)).not.toBeInTheDocument();
  });
}); 