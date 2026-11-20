import { render, screen } from '@testing-library/react';
import ResultsPanels from './ResultsPanels';

describe('ResultsPanels', () => {
  it('keeps the aggregate bar valid when no submissions are available', () => {
    const { container } = render(
      <ResultsPanels
        viewMode="cvision"
        modelName="Cvision"
        runId="batch_9942_cvision_run_1"
        results={[]}
        correctCount={0}
        incorrectCount={0}
        errorCount={0}
      />,
    );

    expect(
      screen.getByRole('img', {
        name: '0 correct, 0 incorrect, and 0 inference errors',
      }),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.aggregate-bar-correct'),
    ).toHaveStyle({ width: '0%' });
    expect(
      container.querySelector('.aggregate-bar-incorrect'),
    ).toHaveStyle({ width: '0%' });
    expect(container.querySelector('.aggregate-bar-error')).toHaveStyle({
      width: '0%',
    });
  });
});
