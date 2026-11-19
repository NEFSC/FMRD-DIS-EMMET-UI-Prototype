import { useState } from 'react';
import sampleResults from './data/fish-test-results.json';
import sampleLabels from './data/fish-test-labels.json';
import runMetrics from './data/fish-run-metrics.json';
import type { FishResultsBatch, FishResult } from './data/fish-test-contract';

const passingAccuracyThreshold = 85;
const batches = sampleResults as FishResultsBatch[];
const models = [
  { id: 'cvision', name: 'Cvision' },
  { id: 'im', name: 'IM' },
] as const;
type ModelId = (typeof models)[number]['id'];
type ViewMode = 'administrator' | ModelId;

const initialModelId = models[0].id;
const initialRunId = batches.find((batch) =>
  batch.run_id.startsWith(`batch_9942_${initialModelId}_run_`),
)?.run_id;

if (!initialRunId) {
  throw new Error(`No runs found for model "${initialModelId}".`);
}

const labelsBySubmissionId = new Map(
  sampleLabels.submissions.map((submission) => [
    submission.submission_id,
    submission,
  ]),
);

function getResult<T extends FishResult['method']>(
  results: FishResult[],
  method: T,
): Extract<FishResult, { method: T }> {
  const result = results.find(
    (item): item is Extract<FishResult, { method: T }> =>
      item.method === method,
  );

  if (!result) {
    throw new Error(`Submission is missing its "${method}" result.`);
  }

  return result;
}

function formatSpecies(species: string) {
  return species
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function formatRunLabel(runId: string) {
  const runNumber = runId.match(/_run_(\d+)$/)?.[1];

  if (!runNumber) {
    throw new Error(`Invalid run ID "${runId}".`);
  }

  return `Run ${runNumber}`;
}

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('administrator');
  const [administratorModelId, setAdministratorModelId] =
    useState<ModelId>(initialModelId);
  const [selectedRunId, setSelectedRunId] = useState(initialRunId);
  const selectedModelId =
    viewMode === 'administrator' ? administratorModelId : viewMode;
  const modelRuns = batches.filter((batch) =>
    batch.run_id.startsWith(`batch_9942_${selectedModelId}_run_`),
  );
  const selectedModel = models.find(
    (model) => model.id === selectedModelId,
  );
  const selectedRun = modelRuns.find((batch) => batch.run_id === selectedRunId);
  const selectedRunMetrics = runMetrics.find(
    (metrics) => metrics.run_id === selectedRunId,
  );

  if (!selectedModel || !selectedRun || !selectedRunMetrics) {
    throw new Error(
      `Invalid model or run selection: "${selectedModelId}", "${selectedRunId}".`,
    );
  }

  const results = selectedRun.submissions.map((submission) => {
    const label = labelsBySubmissionId.get(submission.submission_id);

    if (!label) {
      throw new Error(
        `Submission references unknown ID "${submission.submission_id}".`,
      );
    }

    const species = getResult(submission.results, 'species');
    const length = getResult(submission.results, 'length');

    return {
      fishId: label.fish_id,
      actualSpecies: label.actual_species,
      predictedSpecies: species.classification,
      confidence: species.confidence_score,
      length: length.length,
      lengthUnit: length.unit,
      isCorrect: species.classification === label.actual_species,
    };
  });
  const correctCount = results.filter((result) => result.isCorrect).length;
  const incorrectCount = results.length - correctCount;
  const accuracy = results.length
    ? (correctCount / results.length) * 100
    : 0;
  const errorRate = results.length
    ? (incorrectCount / results.length) * 100
    : 0;
  const runPassed = accuracy >= passingAccuracyThreshold;

  const handleViewChange = (view: ViewMode) => {
    const modelId =
      view === 'administrator' ? administratorModelId : view;
    const firstRun = batches.find((batch) =>
      batch.run_id.startsWith(`batch_9942_${modelId}_run_`),
    );

    if (!firstRun) {
      throw new Error(`No runs found for model "${modelId}".`);
    }

    setSelectedRunId(firstRun.run_id);
    setViewMode(view);
  };

  const handleAdministratorModelChange = (modelId: string) => {
    const model = models.find((item) => item.id === modelId);

    if (!model) {
      throw new Error(`Unknown model "${modelId}".`);
    }

    const firstRun = batches.find((batch) =>
      batch.run_id.startsWith(`batch_9942_${model.id}_run_`),
    );

    if (!firstRun) {
      throw new Error(`No runs found for model "${model.id}".`);
    }

    setAdministratorModelId(model.id);
    setSelectedRunId(firstRun.run_id);
  };

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="./" aria-label="EMMET home">
          <span className="brand-mark" aria-hidden="true">
            E
          </span>
          <span>EMMET</span>
        </a>
        <span className="prototype-label">SYNTHETIC MODEL EVALUATION</span>
      </header>

      <section className="workspace" aria-labelledby="page-title">
        <div className="page-heading">
          <p className="eyebrow">Computer vision benchmark</p>
          <h1 id="page-title">Fish identification results</h1>
          <p className="welcome-copy">
            Compare each model&apos;s species predictions against the sample
            labels.
          </p>
        </div>

        <ul
          className="view-switch usa-button-group usa-button-group--segmented"
          role="group"
          aria-label="Results view"
        >
          <li className="usa-button-group__item">
            <button
              type="button"
              className={`usa-button ${
                viewMode === 'administrator' ? '' : 'usa-button--outline'
              }`}
              aria-pressed={viewMode === 'administrator'}
              onClick={() => handleViewChange('administrator')}
            >
              Administrator
            </button>
          </li>
          {models.map((model) => (
            <li key={model.id} className="usa-button-group__item">
              <button
                type="button"
                className={`usa-button ${
                  viewMode === model.id ? '' : 'usa-button--outline'
                }`}
                aria-pressed={viewMode === model.id}
                onClick={() => handleViewChange(model.id)}
              >
                {model.name}
              </button>
            </li>
          ))}
        </ul>

        <div className="results-toolbar">
          <div className="filters">
            {viewMode === 'administrator' && (
              <label className="filter">
                <span className="usa-label">Model</span>
                <select
                  className="usa-select"
                  aria-label="Model"
                  value={selectedModelId}
                  onChange={(event) =>
                    handleAdministratorModelChange(event.currentTarget.value)
                  }
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="filter">
              <span className="usa-label">Run</span>
              <select
                className="usa-select"
                aria-label="Run"
                value={selectedRunId}
                onChange={(event) =>
                  setSelectedRunId(event.currentTarget.value)
                }
              >
                {modelRuns.map((run) => (
                  <option key={run.run_id} value={run.run_id}>
                    {formatRunLabel(run.run_id)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="dataset-note">
            <span className="note-indicator" aria-hidden="true" />
            {viewMode !== 'administrator'
              ? 'Model aggregate · no fish-level details'
              : 'Administrator view · all 100 fish'}
          </p>
        </div>

        <section
          className="summary-grid"
          aria-label={
            viewMode !== 'administrator' ? 'Model run summary' : 'Run summary'
          }
        >
          <article className="usa-card usa-card--bordered summary-card summary-card-primary">
            <div className="usa-card__container">
              <div className="usa-card__header">
                <h2 className="usa-card__heading">Identification accuracy</h2>
              </div>
              <div className="usa-card__body">
                <p className="summary-value">{accuracy.toFixed(1)}%</p>
                <p className="summary-detail">
                  {selectedModel.name} · {formatRunLabel(selectedRun.run_id)}
                </p>
              </div>
            </div>
          </article>
          <article className="usa-card usa-card--bordered summary-card">
            <div className="usa-card__container">
              <div className="usa-card__header">
                <h2 className="usa-card__heading">Correct IDs</h2>
              </div>
              <div className="usa-card__body">
                <p className="summary-value">{correctCount}</p>
                <p className="summary-detail">of {results.length} fish</p>
              </div>
            </div>
          </article>
          <article className="usa-card usa-card--bordered summary-card">
            <div className="usa-card__container">
              <div className="usa-card__header">
                <h2 className="usa-card__heading">Run result</h2>
              </div>
              <div className="usa-card__body">
                <p
                  className={`summary-value run-status ${
                    runPassed ? 'run-status-pass' : 'run-status-fail'
                  }`}
                >
                  {runPassed ? 'PASS' : 'FAIL'}
                </p>
                <p className="summary-detail">
                  {passingAccuracyThreshold}% minimum accuracy
                </p>
              </div>
            </div>
          </article>
          <article className="usa-card usa-card--bordered summary-card">
            <div className="usa-card__container">
              <div className="usa-card__header">
                <h2 className="usa-card__heading">Incorrect IDs</h2>
              </div>
              <div className="usa-card__body">
                <p className="summary-value">{incorrectCount}</p>
                <p className="summary-detail">of {results.length} fish</p>
              </div>
            </div>
          </article>
          <article className="usa-card usa-card--bordered summary-card">
            <div className="usa-card__container">
              <div className="usa-card__header">
                <h2 className="usa-card__heading">Error rate</h2>
              </div>
              <div className="usa-card__body">
                <p className="summary-value">{errorRate.toFixed(1)}%</p>
                <p className="summary-detail">incorrect identifications</p>
              </div>
            </div>
          </article>
          <article className="usa-card usa-card--bordered summary-card">
            <div className="usa-card__container">
              <div className="usa-card__header">
                <h2 className="usa-card__heading">Runtime</h2>
              </div>
              <div className="usa-card__body">
                <p className="summary-value">
                  {selectedRunMetrics.runtime_seconds.toFixed(1)} s
                </p>
                <p className="summary-detail">synthetic run duration</p>
              </div>
            </div>
          </article>
        </section>

        {viewMode !== 'administrator' ? (
          <section
            className="usa-card usa-card--bordered aggregate-panel"
            aria-labelledby="model-results-title"
          >
            <div className="usa-card__container">
              <div className="panel-heading usa-card__header">
                <div>
                  <h2 id="model-results-title">
                    {selectedModel.name} result breakdown
                  </h2>
                  <p>
                    Correct and incorrect identifications for{' '}
                    {formatRunLabel(selectedRun.run_id).toLowerCase()}.
                  </p>
                </div>
                <span className="result-count">
                  {results.length} submissions
                </span>
              </div>
              <div className="aggregate-content usa-card__body">
                <div
                  className="aggregate-bar"
                  role="img"
                  aria-label={`${correctCount} correct and ${incorrectCount} incorrect identifications`}
                >
                  <span
                    className="aggregate-bar-correct"
                    style={{ width: `${accuracy}%` }}
                  />
                  <span
                    className="aggregate-bar-incorrect"
                    style={{ width: `${100 - accuracy}%` }}
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
                </div>
              </div>
            </div>
          </section>
        ) : (
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
                        <td>{formatSpecies(result.predictedSpecies)}</td>
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
                              result.isCorrect ? 'is-correct' : 'is-incorrect'
                            }`}
                          >
                            {result.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </section>

      <footer className="footer">
        <span>EMMET UI Prototype</span>
        <span>All fish and model results are synthetic examples</span>
      </footer>
    </main>
  );
}

export default App;
