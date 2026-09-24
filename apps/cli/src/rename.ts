import { access, rename } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { filePrefix, type Analysis } from "@keyandbpm/core";

/** An existing "[Am][96.52] " prefix from an earlier run, so re-analysing replaces it instead of stacking. */
const EXISTING_PREFIX = /^\[[A-G][b#]?m?\]\[[\d.]*\] /;

export function renamedPath(file: string, analysis: Analysis): string {
  const bare = basename(file).replace(EXISTING_PREFIX, "");
  return join(dirname(file), filePrefix(analysis) + bare);
}

export async function renameWithPrefix(file: string, analysis: Analysis): Promise<string> {
  const target = renamedPath(file, analysis);
  if (target === file) return target;
  // rename() silently replaces an existing file, which here would be a different recording.
  const taken = await access(target).then(() => true, () => false);
  if (taken) throw new Error(`Not renaming ${file}: ${basename(target)} already exists`);
  await rename(file, target);
  return target;
}
