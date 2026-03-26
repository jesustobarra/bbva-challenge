/**
 * Persisted player score snapshot stored in localStorage.
 */
export interface PlayerSaveData {
  /** Highest score reached by the player. */
  maxPoints: number;
  /** Score used to resume a saved game. */
  resumeScore: number;
}
