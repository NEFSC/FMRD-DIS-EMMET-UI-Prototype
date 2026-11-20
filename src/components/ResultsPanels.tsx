import { formatRunLabel, formatSpecies } from '../utils/formatters';
import type { ResultRow, ViewMode } from './types';

type ResultsPanelsProps = {
  viewMode: ViewMode;
  modelName: string;
  runId: string;
  results: ResultRow[];
  correctCount: number;
  incorrectCount: number;
  errorCount: number;
};

function ResultsPanels({
  viewMode,
  modelName,
  runId,
  results,
  correctCount,
  incorrectCount,
  errorCount,
}: ResultsPanelsProps) {
  return viewMode !== 'administrator' ? (
    <AggregatePanel
      modelName={modelName}
      runId={runId}
      resultsCount={results.length}
      correctCount={correctCount}
      incorrectCount={incorrectCount}
      errorCount={errorCount}
    />
  ) : (
    <ResultsTable results={results} />
  );
}

type AggregatePanelProps = {
  modelName: string;
  runId: string;
  resultsCount: number;
  correctCount: number;
  incorrectCount: number;
  errorCount: number;
};

function AggregatePanel({
  modelName,
  runId,
  resultsCount,
  correctCount,
  incorrectCount,
  errorCount,
}: AggregatePanelProps) {
  const totalCount = correctCount + incorrectCount + errorCount;
  const getSegmentWidth = (count: number) =>
    totalCount ? `${(count / totalCount) * 100}%` : '0%';

  return (
    <section
      className="usa-card usa-card--bordered aggregate-panel"
      aria-labelledby="model-results-title"
    >
      <div className="usa-card__container">
        <div className="panel-heading usa-card__header">
          <div>
            <h2 id="model-results-title">{modelName} result breakdown</h2>
            <p>
              Correct and incorrect identifications for{' '}
              {formatRunLabel(runId).toLowerCase()}.
            </p>
          </div>
          <span className="result-count">{resultsCount} submissions</span>
        </div>
        <div className="aggregate-content usa-card__body">
          <div
            className="aggregate-bar"
            role="img"
            aria-label={`${correctCount} correct, ${incorrectCount} incorrect, and ${errorCount} inference error${errorCount === 1 ? '' : 's'}`}
          >
            <span
              className="aggregate-bar-correct"
              style={{ width: getSegmentWidth(correctCount) }}
            />
            <span
              className="aggregate-bar-incorrect"
              style={{ width: getSegmentWidth(incorrectCount) }}
            />
            <span
              className="aggregate-bar-error"
              style={{ width: getSegmentWidth(errorCount) }}
            />
          </div>
          <div className="aggregate-legend">
            <span>
              <i className="legend-dot legend-correct" aria-hidden="true" />
              Correct <strong>{correctCount}</strong>
            </span>
            <span>
              <i
                className="legend-dot legend-incorrect"
                aria-hidden="true"
              />
              Incorrect <strong>{incorrectCount}</strong>
            </span>
            <span>
              <i className="legend-dot legend-error" aria-hidden="true" />
              Errors <strong>{errorCount}</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultsTable({ results }: { results: ResultRow[] }) {
  return (
    <section
      className="usa-card usa-card--bordered results-panel"
      aria-labelledby="results-title"
    >
      <div className="usa-card__container">
        <div className="panel-heading usa-card__header">
          <div>
            <h2 id="results-title">Run predictions</h2>
            <p>Predicted species compared with the labeled sample.</p>
          </div>
          <span className="result-count">{results.length} results</span>
        </div>

        <div className="table-wrap usa-card__body">
          <table
            className="usa-table usa-table--striped"
            aria-label="Fish identification results"
          >
            <thead>
              <tr>
                <th scope="col">Fish ID</th>
                <th scope="col">Actual species</th>
                <th scope="col">Predicted species</th>
                <th scope="col">Length</th>
                <th scope="col">Confidence</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.fishId}>
                  <td className="fish-id">{result.fishId}</td>
                  <td>{formatSpecies(result.actualSpecies)}</td>
                  <td>
                    {result.predictedSpecies === null
                      ? 'Inference unavailable'
                      : formatSpecies(result.predictedSpecies)}
                  </td>
                  <td>
                    {result.length} {result.lengthUnit}
                  </td>
                  <td>
                    {result.confidence === null
                      ? '—'
                      : `${(result.confidence * 100).toFixed(0)}%`}
                  </td>
                  <td>
                    <span
                      className={`usa-tag result-pill ${
                        result.hasInferenceError
                          ? 'is-error'
                          : result.isCorrect
                            ? 'is-correct'
                            : 'is-incorrect'
                      }`}
                    >
                      {result.hasInferenceError
                        ? 'Error'
                        : result.isCorrect
                          ? 'Correct'
                          : 'Incorrect'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ResultsPanels;
