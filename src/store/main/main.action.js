import { MAIN_ACTION_TYPES } from "./main.reducer";

export const setTEI = (tei) => ({
  type: MAIN_ACTION_TYPES.SET_TEI,
  payload: tei,
});

export const setProgramSheet = (programSheet) => ({
  type: MAIN_ACTION_TYPES.SET_PROGRAM_SHEET,
  payload: programSheet,
});

export const setStatus = (bool) => ({
  type: MAIN_ACTION_TYPES.SET_STATUS,
  payload: bool,
});
