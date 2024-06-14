import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProgramSheet } from "../../store/main/main.action";
import { createProgramIndex } from "../utils.func";

export const Programs = () => {
  const dispatch = useDispatch();
  const programs = useSelector((state) => state.sidebar.programs);
  const orgUnit = useSelector((state) => state.outree.clickedOU);
  const [ouPrograms, setOUPrograms] = useState([]);

  useEffect(() => {
    if (programs) {
      var selectedPrograms = [];
      if (orgUnit) {
        programs.forEach((program) => {
          const OUPresent = program.organisationUnits.filter(
            (ou) => ou.id == orgUnit.id
          );
          if (OUPresent.length) selectedPrograms.push(program);
        });
      } else selectedPrograms = programs;
      setOUPrograms(selectedPrograms);
    }
  }, [orgUnit]);

  const handleChange = (ev) => {
    const { value } = ev.target;
    if (value) {
      const program = ouPrograms.filter((program) => program.id === value);
      if (program.length) {
        const modifiedProgram = createProgramIndex(program[0])
        dispatch(setProgramSheet(modifiedProgram));
      }
    }
  };

  return (
    <div className="program-container">
      <select className="form-select" onChange={handleChange}>
        <option className="text-italic" val="">
          --Select Program--
        </option>
        {ouPrograms.map((program) => (
          <option key={program.id} value={program.id}>
            {program.name}
          </option>
        ))}
      </select>
    </div>
  );
};
