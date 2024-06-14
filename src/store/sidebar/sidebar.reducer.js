export const SIDEBAR_ACTION_TYPES = {
  SET_PROGRAMS: "SET_PROGRAMS",
  SET_PROGRAM: "SET_PROGRAM",
  SET_UPLOAD_SHEET: "SET_UPLOAD_SHEET",
  SET_IDS_INDEX: 'SET_IDS_INDEX',
  SET_DISPLAY_SHEET: "SET_DISPLAY_SHEET",
};

export const INITIAL_STATE = {
  programs: null,
  uploadedSheet: null,
  idsIndex: null,
  displaySheet: false,
};

export const sidebarReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case SIDEBAR_ACTION_TYPES.SET_PROGRAMS:
      return { ...state, programs: payload };
    case SIDEBAR_ACTION_TYPES.SET_UPLOAD_SHEET:
      return { ...state, uploadedSheet: payload };
      case SIDEBAR_ACTION_TYPES.SET_IDS_INDEX:
        return { ...state, idsIndex: payload };
        case SIDEBAR_ACTION_TYPES.SET_DISPLAY_SHEET:
          return { ...state, displaySheet: payload };
    default:
      return state;
  }
};
