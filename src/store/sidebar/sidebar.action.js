import { SIDEBAR_ACTION_TYPES } from "./sidebar.reducer";

export const setPrograms = (programs) => ({
  type: SIDEBAR_ACTION_TYPES.SET_PROGRAMS,
  payload: programs,
});

export const setUploadSheet = (sheet) => ({
  type: SIDEBAR_ACTION_TYPES.SET_UPLOAD_SHEET,
  payload: sheet,
});

export const setIdsIndex = (idsIndex) => ({
  type: SIDEBAR_ACTION_TYPES.SET_IDS_INDEX,
  payload: idsIndex,
});

export const setDisplaySheet = (bool) => ({
  type: SIDEBAR_ACTION_TYPES.SET_DISPLAY_SHEET,
  payload: bool,
});