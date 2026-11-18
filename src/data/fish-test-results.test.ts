import sampleResults from './fish-test-results.json';
import sampleLabels from './fish-test-labels.json';
import runMetrics from './fish-run-metrics.json';
import type { FishResultsBatch } from './fish-test-contract';

const batches = sampleResults as FishResultsBatch[];

describe('synthetic fish test results', () => {
  it('matches the API contract for all six model runs', () => {
    const labelsById = new Map(
      sampleLabels.submissions.map((submission) => [
        submission.submission_id,
        submission,
      ]),
    );
    const submissionIds = new Set(labelsById.keys());

    expect(batches).toHaveLength(6);
    expect(runMetrics).toHaveLength(batches.length);
    expect(new Set(runMetrics.map((metrics) => metrics.run_id)).size).toBe(
      batches.length,
    );
    expect(sampleLabels.submissions).toHaveLength(100);
    expect(submissionIds.size).toBe(100);
    expect(
      sampleLabels.submissions.some(
        (submission) => submission.actual_species === 'haddock',
      ),
    ).toBe(true);

    for (const batch of batches) {
      const metrics = runMetrics.find(
        (item) => item.run_id === batch.run_id,
      );
      expect(metrics).toBeDefined();
      expect(metrics?.runtime_seconds).toBeGreaterThan(0);

      expect(Object.keys(batch).sort()).toEqual([
        'api_version',
        'processed_at',
        'run_id',
        'submissions',
      ]);
      expect(batch.api_version).toBe('v1.0');
      expect(batch.processed_at).toBe('2026-11-10T13:45:00Z');
      expect(batch.submissions).toHaveLength(100);
      expect(
        new Set(batch.submissions.map((submission) => submission.submission_id))
          .size,
      ).toBe(100);

      for (const submission of batch.submissions) {
        expect(Object.keys(submission).sort()).toEqual([
          'errors',
          'results',
          'submission_id',
        ]);
        expect(submissionIds.has(submission.submission_id)).toBe(true);
        expect(submission.errors).toEqual([]);
        expect(submission.results.map((result) => result.method)).toEqual([
          'species',
          'length',
        ]);

        const speciesResult = submission.results.find(
          (result) => result.method === 'species',
        );
        const lengthResult = submission.results.find(
          (result) => result.method === 'length',
        );

        expect(speciesResult).toBeDefined();
        expect(lengthResult).toBeDefined();

        if (speciesResult?.method === 'species') {
          expect(Object.keys(speciesResult).sort()).toEqual([
            'classification',
            'confidence_score',
            'method',
          ]);
          expect(speciesResult.classification).not.toContain('pacific_cod');
          expect(
            speciesResult.confidence_score === null ||
              (speciesResult.confidence_score >= 0 &&
                speciesResult.confidence_score <= 1),
          ).toBe(true);
        }

        if (lengthResult?.method === 'length') {
          expect(Object.keys(lengthResult).sort()).toEqual([
            'length',
            'method',
            'unit',
          ]);
          expect(lengthResult.length).toBeGreaterThan(0);
          expect(lengthResult.unit).toBe('cm');
        }
      }
    }

    for (const modelId of ['cvision', 'im']) {
      const modelRuns = batches.filter((batch) =>
        batch.run_id.startsWith(`batch_9942_${modelId}_run_`),
      );
      const correctCounts = modelRuns.map(
        (batch) =>
          batch.submissions.filter((submission) => {
            const label = labelsById.get(submission.submission_id);
            const species = submission.results.find(
              (result) => result.method === 'species',
            );
            return (
              label !== undefined &&
              species?.method === 'species' &&
              species.classification === label.actual_species
            );
          }).length,
      );

      expect(modelRuns).toHaveLength(3);
      expect(new Set(correctCounts).size).toBe(3);
      expect(correctCounts.every((count) => count < 100)).toBe(true);
    }
  });
});
