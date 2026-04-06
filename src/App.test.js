import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Group 4 heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Group 4/i);
  expect(headingElement).toBeInTheDocument();
});
