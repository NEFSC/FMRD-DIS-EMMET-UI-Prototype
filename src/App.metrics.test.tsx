import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App run metrics', () => {
  it('passes a run at 85% and fails a run below 85%', () => {
    render(<App />);

    fireEvent.change(screen.getByRole('combobox', { name: 'Run' }), {
      target: { value: 'batch_9942_cvision_run_3' },
    });

    expect(screen.getByText('85.0%')).toBeInTheDocument();
    expect(screen.getByText('PASS')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox', { name: 'Run' }), {
      target: { value: 'batch_9942_cvision_run_2' },
    });

    expect(screen.getByText('78.6%')).toBeInTheDocument();
    expect(screen.getByText('FAIL')).toBeInTheDocument();
  });
});
