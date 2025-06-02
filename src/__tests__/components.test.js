import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import Header from '../components/Header';
import InputSection from '../components/InputSection';
import ResultsSection from '../components/ResultsSection';

describe('Header Component', () => {
  test('renders header with correct text and styling', () => {
    render(<Header />);
    expect(screen.getByText('Name Pronunciation')).toBeInTheDocument();
    expect(screen.getByText('Chinese to English phonetics')).toBeInTheDocument();
    
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

    // Check for all expected elements
    expect(screen.getByPlaceholderText(/e\.g\., zhengxun, weiming, li/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get pronunciation/i })).toBeInTheDocument();
    expect(screen.getByText('Enter Chinese Name')).toBeInTheDocument();
    
    // Icon should be present
    const icon = document.querySelector('.lucide-book-open');
    expect(icon).toBeInTheDocument();
  });

  test('handles input change and clear', () => {
    render(
      <InputSection
        inputName="zhang"
        setInputName={mockSetInputName}
        handlePronounce={mockHandlePronounce}
        isLoading={false}
        clearInput={mockClearInput}
      />
    );

    // Test input change
    const input = screen.getByPlaceholderText(/e\.g\., zhengxun, weiming, li/i);
    fireEvent.change(input, { target: { value: 'li' } });
    expect(mockSetInputName).toHaveBeenCalledWith('li');

    // Test clear button
    const clearButton = screen.getByText('✕');
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);
    expect(mockClearInput).toHaveBeenCalled();
  });

  test('handles loading state correctly', () => {
    render(
      <InputSection
        inputName="zhang"
        setInputName={mockSetInputName}
        handlePronounce={mockHandlePronounce}
        isLoading={true}
        clearInput={mockClearInput}
      />
    );

    // Button should be disabled and show loading spinner
    const button = screen.getByRole('button', { name: '' });
    expect(button).toBeDisabled();
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  test('handles Enter key press', () => {
    render(
      <InputSection
        inputName="zhang"
        setInputName={mockSetInputName}
        handlePronounce={mockHandlePronounce}
        isLoading={false}
        clearInput={mockClearInput}
      />
    );

    const input = screen.getByPlaceholderText(/e\.g\., zhengxun, weiming, li/i);
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    expect(mockHandlePronounce).toHaveBeenCalled();
  });
});

describe('ResultsSection Component', () => {
  test('renders pronunciation guide with correct styling', () => {
    const pronunciation = '"zhang" is said rhymes with \'song\' but starts with \'j\'';
    render(<ResultsSection pronunciation={pronunciation} />);
    
    // Check for heading and content
    expect(screen.getByText('Pronunciation Guide')).toBeInTheDocument();
    expect(screen.getByText(pronunciation)).toBeInTheDocument();
    
    // Check for icon
    const icon = document.querySelector('.lucide-book-open');
    expect(icon).toBeInTheDocument();
  });

  test('handles empty pronunciation', () => {
    const { container } = render(<ResultsSection pronunciation="" />);
    expect(container.firstChild).toBeNull();
  });

  test('applies correct styling classes', () => {
    const pronunciation = 'Test pronunciation';
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

    const input = screen.getByPlaceholderText(/e\.g\., zhengxun, weiming, li/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: 'zhang' } });
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

    expect(screen.getByText(/rhymes with 'song' but starts with 'j'/i)).toBeInTheDocument();

  });

  test('handles invalid input with error message', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/e\.g\., zhengxun, weiming, li/i);
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
      expect(screen.getByText(/Could not find pronunciation for/i)).toBeInTheDocument();
    });
  });

  test('clears input and results', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/e\.g\., zhengxun, weiming, li/i);
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