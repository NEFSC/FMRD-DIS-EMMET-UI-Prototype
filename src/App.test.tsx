import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the initial model results', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Fish identification results' }))
      .toBeInTheDocument();
    expect(screen.getByText('EMMET')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Model' })).toHaveValue(
      'cvision',
    );
    expect(screen.getByText('91.0%')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(101);
    expect(screen.getAllByText('Haddock').length).toBeGreaterThan(0);
  });

  it('switches to the selected model and its first run', () => {
    render(<App />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Model' }), {
      target: { value: 'im' },
    });

    expect(screen.getByRole('combobox', { name: 'Model' })).toHaveValue('im');
    expect(screen.getByRole('combobox', { name: 'Run' })).toHaveValue(
      'batch_9942_im_run_1',
    );
    expect(screen.getByText('82.0%')).toBeInTheDocument();
  });
});
