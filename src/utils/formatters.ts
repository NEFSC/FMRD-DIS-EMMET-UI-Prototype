export function formatSpecies(species: string) {
  return species
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatRunLabel(runId: string) {
  const runNumber = runId.match(/_run_(\d+)$/)?.[1];

  if (!runNumber) {
    throw new Error(`Invalid run ID "${runId}".`);
  }

  return `Run ${runNumber}`;
}
