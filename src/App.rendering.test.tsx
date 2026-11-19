import { render, screen } from '@testing-library/react';
import App from './App';

describe('App rendering', () => {
  it('renders the initial model results', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Fish identification results' }))
      .toBeInTheDocument();
    expect(screen.getByText('EMMET')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'EMMET home' })).toHaveAttribute(
      'href',
      './',
    );
    expect(screen.getByRole('combobox', { name: 'Model' })).toHaveClass(
      'usa-select',
    );
    expect(screen.getByRole('button', { name: 'Administrator' })).toHaveClass(
      'usa-button',
    );
    expect(
      screen.getByRole('table', { name: 'Fish identification results' }),
    ).toHaveClass('usa-table');
    expect(screen.getByRole('combobox', { name: 'Model' })).toHaveValue('cvision');
    expect(screen.getByText('90.9%')).toBeInTheDocument();
    expect(screen.getByText('9.1%')).toBeInTheDocument();
    expect(screen.getByText('1.0%')).toBeInTheDocument();
    expect(screen.getByText('Fail rate')).toBeInTheDocument();
    expect(screen.getByText('Error rate')).toBeInTheDocument();
    expect(screen.getByText('Inference unavailable')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('12.8 s')).toBeInTheDocument();
    expect(screen.getByText('PASS')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(101);
    expect(screen.getAllByText('Haddock').length).toBeGreaterThan(0);
  });
});
