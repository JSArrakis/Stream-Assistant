import { ProgressionContext, WatchRecord } from "../../src/models/progressionContext";

export const sailorWatchRecord = new WatchRecord(
  'Sailor Moon',
  'sailormoon',
  0,
  0,
  1800,
);
export const rebootWatchRecord = new WatchRecord(
  'Reboot',
  'reboot',
  1,
  0,
  1800,
);
export const gundamWatchRecord = new WatchRecord(
  'Gundam Wing',
  'gundamwing',
  3,
  0,
  1800,
);
export const tenchiWatchRecord = new WatchRecord(
  'Tenchi Muyo',
  'tenchimuyo',
  2,
  0,
  1800,
);
export const batmanWatchRecord = new WatchRecord(
  'Batman: The Animated Series',
  'batmantheanimatedseries',
  5,
  0,
  1800,
);
export const startrekWatchRecord = new WatchRecord(
  'Star Trek: The Next Generation',
  'startrekthenextgeneration',
  0,
  0,
  7200,
);

export const continuousProgression = new ProgressionContext(
  'Continuous',
  'continuous',
  'Test',
  0,
  [
    sailorWatchRecord,
    rebootWatchRecord,
    gundamWatchRecord,
    tenchiWatchRecord,
    batmanWatchRecord,
    startrekWatchRecord,
  ],
);
