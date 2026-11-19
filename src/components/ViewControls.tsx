import { formatRunLabel } from '../utils/formatters';
import type {
  ModelId,
  ModelOption,
  RunOption,
  ViewMode,
} from './types';

type ViewControlsProps = {
  models: readonly ModelOption[];
  modelRuns: RunOption[];
  viewMode: ViewMode;
  selectedModelId: ModelId;
  selectedRunId: string;
  onViewChange: (view: ViewMode) => void;
  onModelChange: (modelId: string) => void;
  onRunChange: (runId: string) => void;
};

function ViewControls({
  models,
  modelRuns,
  viewMode,
  selectedModelId,
  selectedRunId,
  onViewChange,
  onModelChange,
  onRunChange,
}: ViewControlsProps) {
  return (
    <>
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
            onClick={() => onViewChange('administrator')}
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
              onClick={() => onViewChange(model.id)}
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
                onChange={(event) => onModelChange(event.currentTarget.value)}
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
              onChange={(event) => onRunChange(event.currentTarget.value)}
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
    </>
  );
}

export default ViewControls;
