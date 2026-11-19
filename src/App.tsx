import { useState } from 'react';
import AppFooter from './components/AppFooter';
import AppHeader from './components/AppHeader';
import ResultsPanels from './components/ResultsPanels';
import RunSummary from './components/RunSummary';
import type { ModelId, ResultRow, ViewMode } from './components/types';
import ViewControls from './components/ViewControls';
import sampleResults from './data/fish-test-results.json';
import sampleLabels from './data/fish-test-labels.json';
import type { FishResultsBatch, FishResult } from './data/fish-test-contract';
import runMetrics from './data/fish-run-metrics.json';

const passingAccuracyThreshold = 85;
const batches = sampleResults as FishResultsBatch[];
const models = [
  { id: 'cvision', name: 'Cvision' },
  { id: 'im', name: 'IM' },
] as const;

const initialModelId: ModelId = models[0].id;
const initialRunId = findFirstRun(initialModelId).run_id;

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

  const results: ResultRow[] = selectedRun.submissions.map((submission) => {
    const label = labelsBySubmissionId.get(submission.submission_id);

    if (!label) {
      throw new Error(
        `Submission references unknown ID "${submission.submission_id}".`,
      );
    }

    const length = getResult(submission.results, 'length');
    const hasInferenceError = submission.errors.length > 0;
    const species = hasInferenceError
      ? undefined
      : getResult(submission.results, 'species');

    return {
      fishId: label.fish_id,
      actualSpecies: label.actual_species,
      predictedSpecies: species?.classification ?? null,
      confidence: species?.confidence_score ?? null,
      length: length.length,
      lengthUnit: length.unit,
      isCorrect:
        !hasInferenceError && species?.classification === label.actual_species,
      hasInferenceError,
    };
  });
  const errorCount = results.filter((result) => result.hasInferenceError).length;
  const successfulResults = results.length - errorCount;
  const correctCount = results.filter(
    (result) => !result.hasInferenceError && result.isCorrect,
  ).length;
  const incorrectCount = successfulResults - correctCount;
  const accuracy = successfulResults
    ? (correctCount / successfulResults) * 100
    : 0;
  const failRate = successfulResults
    ? (incorrectCount / successfulResults) * 100
    : 0;
  const errorRate = results.length
    ? (errorCount / results.length) * 100
    : 0;

  const handleViewChange = (view: ViewMode) => {
    const modelId = view === 'administrator' ? administratorModelId : view;
    const firstRun = findFirstRun(modelId);

    setSelectedRunId(firstRun.run_id);
    setViewMode(view);
  };

  const handleAdministratorModelChange = (modelId: string) => {
    if (!models.some((model) => model.id === modelId)) {
      throw new Error(`Unknown model "${modelId}".`);
    }

    const selectedModelId = modelId as ModelId;
    const firstRun = findFirstRun(selectedModelId);

    setAdministratorModelId(selectedModelId);
    setSelectedRunId(firstRun.run_id);
  };

  return (
    <main className="page">
      <AppHeader />

      <section className="workspace" aria-labelledby="page-title">
        <div className="page-heading">
          <p className="eyebrow">Computer vision benchmark</p>
          <h1 id="page-title">Fish identification results</h1>
          <p className="welcome-copy">
            Compare each model&apos;s species predictions against the sample
            labels.
          </p>
        </div>

        <ViewControls
          models={models}
          modelRuns={modelRuns}
          viewMode={viewMode}
          selectedModelId={selectedModelId}
          selectedRunId={selectedRunId}
          onViewChange={handleViewChange}
          onModelChange={handleAdministratorModelChange}
          onRunChange={setSelectedRunId}
        />

        <RunSummary
          accuracy={accuracy}
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          failRate={failRate}
          errorRate={errorRate}
          errorCount={errorCount}
          runPassed={accuracy >= passingAccuracyThreshold}
          runtimeSeconds={selectedRunMetrics.runtime_seconds}
          modelName={selectedModel.name}
          runId={selectedRun.run_id}
          threshold={passingAccuracyThreshold}
          totalResults={successfulResults}
          submissionCount={results.length}
        />

        <ResultsPanels
          viewMode={viewMode}
          modelName={selectedModel.name}
          runId={selectedRun.run_id}
          results={results}
          accuracy={accuracy}
          correctCount={correctCount}
          incorrectCount={incorrectCount}
        />
      </section>

      <AppFooter />
    </main>
  );
}

function findFirstRun(modelId: ModelId) {
  const firstRun = batches.find((batch) =>
    batch.run_id.startsWith(`batch_9942_${modelId}_run_`),
  );

  if (!firstRun) {
    throw new Error(`No runs found for model "${modelId}".`);
  }

  return firstRun;
}

export default App;
