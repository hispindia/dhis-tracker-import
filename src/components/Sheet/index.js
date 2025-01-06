import React, { useEffect } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { setIdsIndex } from "../../store/sidebar/sidebar.action";
import { setProgramSheet } from "../../store/main/main.action";
import { enrollmentDateIndex, eventtDateIndex } from "../constants";

const Sheet = () => {
  const dispatch = useDispatch();
  const programSheet = useSelector((state) => state.main.programSheet);
  const selectedOU = useSelector((state) => state.outree.clickedOU);
  const idsIndex = useSelector((state) => state.sidebar.idsIndex);

  useEffect(() => {
    if(idsIndex) {
      const modifiedProgram = programSheet;

      modifiedProgram.orgUnit.index = idsIndex['orgUnit']==0 ||  idsIndex['orgUnit'] ? idsIndex['orgUnit'] : '';
      modifiedProgram.enrollmentDate.index = idsIndex['enrollmentDate'] ? idsIndex['enrollmentDate'] : enrollmentDateIndex;

      modifiedProgram.attributes.forEach((attr) => {
        attr.index = idsIndex[attr.attribute] ? idsIndex[attr.attribute] : "";
      });
      
      modifiedProgram["programStages"].forEach(ps => {
        ps.eventDate.index = idsIndex[ps.id] ? idsIndex[ps.id]: eventtDateIndex;
        ps.dataElements.forEach(de => {
          de["index"] = idsIndex[de.dataElement] ? idsIndex[de.dataElement] : "";
        })
      })
      dispatch(setProgramSheet(modifiedProgram));
      dispatch(setIdsIndex(null))
    }
  }, [programSheet]);

  const handleAttrChange = (e,index) => {
    const modifiedProgram= programSheet;
    const {value}  = e.target;
    modifiedProgram['attributes'][index]['index'] = value;
    dispatch(setProgramSheet({...modifiedProgram}));
    
  }
  
  const handleIdentifier = (e) => {
    const modifiedProgram = programSheet;
    const {value} = e.target;
    modifiedProgram.primaryAttr = value;
    dispatch(setProgramSheet({...modifiedProgram}));
  };

  const handleIndex = (e) => {
    const modifiedProgram = programSheet;
    const {name, value} = e.target;
    modifiedProgram[name]['index'] = value;
    dispatch(setProgramSheet({...modifiedProgram}));
  };

  const handleDEValues = (e, index1, index2) => {
    const modifiedProgram = programSheet;
    const {value} = e.target;
    if(!index2) {
      modifiedProgram['programStages'][index1]['eventDate']['index'] = value;
    }
    else {
      modifiedProgram['programStages'][index1]['dataElements'][index2]['index'] = value;
    } 
    dispatch(setProgramSheet({...modifiedProgram}));
  }

  return (
    programSheet && (
      <div className="w-100 mx-2">
        <h3 className="fw-bold text-center my-4">{programSheet.program.name}</h3>
        {!selectedOU && (
          <div className="row g-2 my-2">
            <div className="col form-floating">
              <input
                id="orgUnit"
                class="form-control"
                type="number"
                min="0"
                name={"orgUnit"}
                value={`${programSheet["orgUnit"]["index"]}`}
                onChange={(e) => handleIndex(e)}
              />
              <label for="orgUnit">Organisation Unit Index</label>
            </div>
          </div>
        )}

        <div className="border border-1 p-2 my-2">
          <h5 className="fw-bold my-2">
            Tracked Entity Instance
            <span className="fst-italic">[#Attributes]</span>
          </h5>
          <div className="row g-2">
            {programSheet.attributes.map((attr, attrIndex) => (
              <div className="col-4 form-floating">
                <input
                  id={`${attr.attribute}`}
                  class="form-control"
                  type="number"
                  min="0"
                  name={`${attr.attribute}`}
                  value={`${attr.index}`}
                  key={attrIndex}
                  onChange={(e) => handleAttrChange(e, attrIndex)}
                />
                <label for={`${attr.attribute}`}>{attr.name}</label>
              </div>
            ))}
          </div>

          <div class="my-2">
            <select className="form-select" onChange={(e)=> handleIdentifier(e)}>
              <option value="">Select one Unique identifier</option>
              {programSheet.attributes.map((attr) => (
                <option selected={attr.attribute == programSheet["primaryAttr"]} value={`${attr.attribute}`}>{attr.name}</option>
              ))}
            </select>
          </div>

          <div className="row g-2">
            <div className="col form-floating">
              <input
                id="enrollmentDate"
                class="form-control"
                type="number"
                min="0"
                name="enrollmentDate"
                value={programSheet["enrollmentDate"]["index"]}
                onChange={(e) => handleIndex(e)}
              />
              <label for="enrollmentDate">Enrollment Date Index</label>
            </div>
          </div>
        </div>

        <div className="border border-1 p-2">
          {programSheet.programStages.map((ps, idps) => (
            <div>
              <h5 className="fw-bold my-2">
                {ps.name} <span className="fst-italic">[#Program Stage]</span>
              </h5>
              <div className="row g-2 my-2">
                <div className="col form-floating">
                  <input
                    id={`${ps.id}`}
                    class="form-control"
                    type="number"
                    min="0"
                    name="eventDate"
                    value={ps['eventDate']['index']}
                    onChange={e => handleDEValues(e, idps)}
                  />
                  <label for={`${ps}`}>Event Date Index</label>
                </div>
              </div>
              <div className="row g-2">
                {ps.dataElements.map((de,idde) => (
                  <div className="col-4 form-floating">
                    <input
                      id={`${de.dataElement}`}
                      class="form-control"
                      type="number"
                      min="0"
                      name={`${de.dataElement}`}
                      value={de.index}
                      onChange={(e) => handleDEValues(e, idps, idde)}
                    />
                    <label for={`${de.dataElement}`}>{de.name}</label>
                  </div>
                ))}
              </div>
              <hr class="hr my-2" />
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Sheet;
