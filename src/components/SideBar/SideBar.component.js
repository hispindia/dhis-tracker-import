import React, { useState, useEffect } from "react";
import "./sideBar.style.scss";
import * as XLSX from "xlsx";

import OrganisationUnitTree from "../OrganisationUnitTree";

import { useDispatch, useSelector } from "react-redux";
import {
  setClickedOU,
  setFilteredOU,
  setOUCode,
  setOUList,
  setUserOU,
} from "../../store/outree/outree.action";
import {
  setDisplaySheet,
  setIdsIndex,
  setPrograms,
  setUploadSheet,
} from "../../store/sidebar/sidebar.action";
import { Programs } from "./Programs.component";
import { mapSheetToProgram } from "../utils.func";
import { setStatus } from "../../store/main/main.action";

const SideBar = ({ data }) => {
  const dispatch = useDispatch();

  const [showOrgUnit, setShowOrgUnit] = useState(false);

  const selectedOU = useSelector((state) => state.outree.clickedOU);
  const userOU = useSelector((state) => state.outree.userOU);
  const uploadedSheet = useSelector((state) => state.sidebar.uploadedSheet);
  const displaySheet = useSelector((state) => state.sidebar.displaySheet);
  const status = useSelector((state) => state.main.status);

  useEffect(() => {
    if (data) {
      if (data.ouList) {
        dispatch(setOUList(data.ouList.organisationUnits));
        var ouCode = {};
        data.ouList.organisationUnits.forEach(ou => {
          if(ou.code) ouCode[ou.code] = ou.id;
        })
        dispatch(setOUCode(ouCode))
      }
      if (data.me) {
        if (data.me.organisationUnits.length >= 2)
          data.me.organisationUnits = data.me.organisationUnits.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        dispatch(setUserOU(data.me.organisationUnits));
        dispatch(setClickedOU(data.me.organisationUnits[0]));
      }
      if (data.programList) dispatch(setPrograms(data.programList.programs));
    }
  }, [data]);

  useEffect(() => {
    if (userOU) {
      if (showOrgUnit) dispatch(setClickedOU(userOU[0]));
      else {
        dispatch(setClickedOU(null));
        dispatch(setFilteredOU(null));
      }
    }
  }, [showOrgUnit, userOU]);

  const handleFileUpload = (e) => {
    e.preventDefault();

    var files = e.target.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: "binary" });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header:1 });
      dispatch(setUploadSheet(dataParse));
    };
    reader.readAsBinaryString(f);
  };

  const handleMapSheet = () => {
    const idsIndex = mapSheetToProgram(uploadedSheet);
    dispatch(setIdsIndex(idsIndex));
    dispatch(setDisplaySheet(true));
  };
  return (
    <div className="side-bar">
      <div class="form-control-lg form-check form-switch">
        <label class="form-check-label" for="flexSwitchCheckChecked">
          Organisation Unit
        </label>
        <input
          class="form-check-input"
          type="checkbox"
          id="flexSwitchCheckChecked"
          onClick={() => setShowOrgUnit(!showOrgUnit)}
          checked={showOrgUnit}
        />
      </div>
      <div className={showOrgUnit ? "" : "d-none"}>
        {selectedOU && (
          <>
            <input
              className="form-control"
              id="organisation-unit"
              disabled
              value={selectedOU.name}
            />
            <div>
              <OrganisationUnitTree />
            </div>
          </>
        )}
      </div>
      <div className="my-2">
        <Programs />
      </div>
      <div className="my-2">
        <label for="custom-sheet" className="form-label">
          Upload .xlsx file{" "}
        </label>
        <input
          className="form-control"
          type="file"
          onChange={(e) => handleFileUpload(e)}
        />
      </div>

      <button
        type="button"
        onClick={handleMapSheet}
        className="btn btn-info w-100 my-3"
        disabled={status}
      >
        Map Sheet
      </button>
      {displaySheet && (
        <button
          type="button"
          onClick={() => dispatch(setStatus(true))}
          className={"btn btn-primary w-100 my-5"}
          disabled={status}
        >
          Start Process       
        </button>
      )}
    </div>
  );
};

export default SideBar;
