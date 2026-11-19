import { formatRunLabel } from '../utils/formatters';
import type { RunSummary as RunSummaryValues } from './types';

type RunSummaryProps = RunSummaryValues & {
  modelName: string;
  runId: string;
  threshold: number;
  totalResults: number;
  submissionCount: number;
};

function RunSummary({
  accuracy,
  correctCount,
  incorrectCount,
  failRate,
  errorRate,
  errorCount,
  runPassed,
  runtimeSeconds,
  modelName,
  runId,
  threshold,
  totalResults,
  submissionCount,
}: RunSummaryProps) {
  return (
    <section className="summary-grid" aria-label="Run summary">
      <SummaryCard
        className="summary-card-primary"
        title="Identification accuracy"
        value={`${accuracy.toFixed(1)}%`}
        detail={`${modelName} · ${formatRunLabel(runId)}`}
      />
      <SummaryCard
        title="Correct IDs"
        value={correctCount}
        detail={`of ${totalResults} successful`}
      />
      <SummaryCard
        title="Run result"
        value={runPassed ? 'PASS' : 'FAIL'}
        detail={`${threshold}% minimum accuracy`}
        valueClassName={runPassed ? 'run-status-pass' : 'run-status-fail'}
      />
      <SummaryCard
        title="Incorrect IDs"
        value={incorrectCount}
        detail={`of ${totalResults} successful`}
      />
      <SummaryCard
        title="Fail rate"
        value={`${failRate.toFixed(1)}%`}
        detail="incorrect identifications"
      />
      <SummaryCard
        title="Error rate"
        value={`${errorRate.toFixed(1)}%`}
        detail={`${errorCount} of ${submissionCount} inferences failed`}
      />
      <SummaryCard
        title="Runtime"
        value={`${runtimeSeconds.toFixed(1)} s`}
        detail="synthetic run duration"
      />
    </section>
  );
}

type SummaryCardProps = {
  title: string;
  value: string | number;
  detail: string;
  className?: string;
  valueClassName?: string;
};

function SummaryCard({
  title,
  value,
  detail,
  className = '',
  valueClassName = '',
}: SummaryCardProps) {
  return (
    <article
      className={`usa-card usa-card--bordered summary-card ${className}`}
    >
      <div className="usa-card__container">
        <div className="usa-card__header">
          <h2 className="usa-card__heading">{title}</h2>
        </div>
        <div className="usa-card__body">
          <p className={`summary-value ${valueClassName}`}>{value}</p>
          <p className="summary-detail">{detail}</p>
        </div>
      </div>
    </article>
  );
}

export default RunSummary;
