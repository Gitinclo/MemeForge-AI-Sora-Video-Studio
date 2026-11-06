import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isTimestamp64BitSafe,
  isTimestampPostY2038,
  simulateTimeTravelAudit,
  normalizeRecordTo64BitTimestamps,
  TARGET_2060_EPOCH_MS,
  Y2038_ROLLOVER_MS,
} from './epoch2060Validator';

describe('epoch2060Validator', () => {
  it('validates 64-bit safe range for 2060-01-01', () => {
    assert.strictEqual(isTimestamp64BitSafe(TARGET_2060_EPOCH_MS), true);
    assert.strictEqual(TARGET_2060_EPOCH_MS, 2840140800000);
    assert.strictEqual(isTimestamp64BitSafe(NaN), false);
    assert.strictEqual(isTimestamp64BitSafe(-10), false);
  });

  it('correctly identifies post-2038 timestamps exceeding 32-bit int bounds', () => {
    assert.strictEqual(isTimestampPostY2038(Y2038_ROLLOVER_MS - 1000), false);
    assert.strictEqual(isTimestampPostY2038(Y2038_ROLLOVER_MS + 1000), true);
    assert.strictEqual(isTimestampPostY2038(TARGET_2060_EPOCH_MS), true);
  });

  it('simulates year 2060 audit with 100% compliance', () => {
    const audit = simulateTimeTravelAudit(2060);
    assert.strictEqual(audit.currentTestYear, 2060);
    assert.strictEqual(audit.is64BitCompliant, true);
    assert.strictEqual(audit.y2038Safe, true);
    assert.strictEqual(audit.y2060Safe, true);
    assert.strictEqual(audit.activeStorageVerification.localStorage, true);
    assert.strictEqual(audit.simulatedIsoString.startsWith('2060-01-01'), true);
  });

  it('normalizes legacy 32-bit second timestamps to 64-bit milliseconds', () => {
    const legacyRecord = {
      id: 'tx_1',
      createdTime: 1700000000, // seconds
      label: '2023 action',
    };
    const upgraded = normalizeRecordTo64BitTimestamps(legacyRecord);
    assert.strictEqual(upgraded.createdTime, 1700000000000); // multiplied to ms
  });
});
