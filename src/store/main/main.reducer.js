export const MAIN_ACTION_TYPES = {
    SET_TEI: "SET_TEI",
    SET_PROGRAM_SHEET: "SET_PROGRAM_SHEET",
    SET_STATUS: "SET_STATUS",
    SET_SHEET_VALUE: "SET_SHEET_VALUE"
  };
  
  export const INITIAL_STATE = {
    tei: null,
    programSheet: null,
    status: false,
  };
  
  export const mainReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case MAIN_ACTION_TYPES.SET_PROGRAM_SHEET:
        return { ...state, programSheet: payload };
      case MAIN_ACTION_TYPES.SET_STATUS:
        return { ...state, status: payload };
      default:
        return state;
    }
  };
  