import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
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
    expect(screen.getByText('91.0%')).toBeInTheDocument();
    expect(screen.getByText('9.0%')).toBeInTheDocument();
    expect(screen.getByText('12.8 s')).toBeInTheDocument();
    expect(screen.getByText('PASS')).toBeInTheDocument();
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

    expect(screen.getByText('79.0%')).toBeInTheDocument();
    expect(screen.getByText('FAIL')).toBeInTheDocument();
  });

  it('shows a model aggregate without fish-level details', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'IM' }));

    expect(
      screen.getByRole('heading', {
        name: 'IM result breakdown',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: '82 correct and 18 incorrect identifications',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('of 100 fish')).toHaveLength(2);
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
        name: '91 correct and 9 incorrect identifications',
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Administrator' }),
    );

    expect(screen.getAllByRole('row')).toHaveLength(101);
    expect(screen.getByRole('combobox', { name: 'Model' })).toHaveValue(
      'cvision',
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Model' }), {
      target: { value: 'im' },
    });

    expect(
      screen.getByRole('combobox', { name: 'Model' }),
    ).toHaveValue('im');
    expect(screen.getAllByRole('row')).toHaveLength(101);
  });
});
