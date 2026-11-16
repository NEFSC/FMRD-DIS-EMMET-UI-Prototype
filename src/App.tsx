import { useState } from 'react';
import sampleResults from './data/fish-test-results.json';
import sampleLabels from './data/fish-test-labels.json';
import type { FishResultsBatch, FishResult } from './data/fish-test-contract';

const batches = sampleResults as FishResultsBatch[];
const models = [
  { id: 'cvision', name: 'Cvision' },
  { id: 'im', name: 'IM' },
];
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
  const [selectedModelId, setSelectedModelId] = useState<string>(initialModelId);
  const [selectedRunId, setSelectedRunId] = useState(initialRunId);
  const modelRuns = batches.filter((batch) =>
    batch.run_id.startsWith(`batch_9942_${selectedModelId}_run_`),
  );
  const selectedModel = models.find(
    (model) => model.id === selectedModelId,
  );
  const selectedRun = modelRuns.find((batch) => batch.run_id === selectedRunId);

  if (!selectedModel || !selectedRun) {
    throw new Error(
      `No run "${selectedRunId}" found for model "${selectedModelId}".`,
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

  const handleModelChange = (modelId: string) => {
    const firstRun = batches.find((batch) =>
      batch.run_id.startsWith(`batch_9942_${modelId}_run_`),
    );

    if (!firstRun) {
      throw new Error(`No runs found for model "${modelId}".`);
    }

    setSelectedModelId(modelId);
    setSelectedRunId(firstRun.run_id);
  };

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="/" aria-label="EMMET home">
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

        <div className="results-toolbar">
          <div className="filters">
            <label className="filter">
              <span>Model</span>
              <select
                aria-label="Model"
                value={selectedModelId}
                onChange={(event) => handleModelChange(event.currentTarget.value)}
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter">
              <span>Run</span>
              <select
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
            Example data · 100 fish
          </p>
        </div>

        <section className="summary-grid" aria-label="Run summary">
          <article className="summary-card summary-card-primary">
            <p>Identification accuracy</p>
            <strong>{accuracy.toFixed(1)}%</strong>
            <span>
              {selectedModel.name} · {formatRunLabel(selectedRun.run_id)}
            </span>
          </article>
          <article className="summary-card">
            <p>Correct IDs</p>
            <strong>{correctCount}</strong>
            <span>of {results.length} fish</span>
          </article>
          <article className="summary-card">
            <p>Incorrect IDs</p>
            <strong>{incorrectCount}</strong>
            <span>of {results.length} fish</span>
          </article>
        </section>

        <section className="results-panel" aria-labelledby="results-title">
          <div className="panel-heading">
            <div>
              <h2 id="results-title">Run predictions</h2>
              <p>Predicted species compared with the labeled sample.</p>
            </div>
            <span className="result-count">{results.length} results</span>
          </div>

          <div className="table-wrap">
            <table aria-label="Fish identification results">
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
                        className={`result-pill ${
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
        </section>
      </section>

      <footer className="footer">
        <span>EMMET UI Prototype</span>
        <span>All fish and model results are synthetic examples</span>
      </footer>
    </main>
  );
}

export default App;
