import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App result views', () => {
  it('shows model aggregates and returns to administrator details', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'IM' }));

    expect(
      screen.getByRole('heading', {
        name: 'IM result breakdown',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: '80 correct, 18 incorrect, and 2 inference errors',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('of 98 successful')).toHaveLength(2);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByText(/FISH-\d+/)).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Company' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Model' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Cvision' }));

    expect(
      screen.getByRole('heading', {
        name: 'Cvision result breakdown',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: '90 correct, 9 incorrect, and 1 inference error',
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Administrator' }));

    expect(screen.getAllByRole('row')).toHaveLength(101);
    expect(screen.getByRole('combobox', { name: 'Model' })).toHaveValue(
      'cvision',
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Model' }), {
      target: { value: 'im' },
    });

    expect(screen.getByRole('combobox', { name: 'Model' })).toHaveValue('im');
    expect(screen.getAllByRole('row')).toHaveLength(101);
  });
});
