import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the prototype welcome content', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Your prototype starts here.' }),
    ).toBeInTheDocument();
    expect(screen.getByText('EMMET')).toBeInTheDocument();
    expect(screen.getByText('Ready to shape your next idea?')).toBeInTheDocument();
  });
});
