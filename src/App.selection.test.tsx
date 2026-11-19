import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App model and run selection', () => {
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
    expect(screen.getByText('18.0%')).toBeInTheDocument();
    expect(screen.getByText('11.6 s')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox', { name: 'Run' }), {
      target: { value: 'batch_9942_im_run_2' },
    });

    expect(screen.getByText('94.0%')).toBeInTheDocument();
    expect(screen.getByText('6.0%')).toBeInTheDocument();
    expect(screen.getByText('10.9 s')).toBeInTheDocument();
    expect(screen.getByText('PASS')).toBeInTheDocument();
  });
});
