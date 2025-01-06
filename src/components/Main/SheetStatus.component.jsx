import React, { useState, useEffect } from "react";
import "./styles.scss";
import { useSelector } from "react-redux";
import { ApiService } from "../../services/api";
import { createEvents, createTei, formatDate } from "../utils.func";

const SheetStatus = () => {
  const clickedOU = useSelector((state) => state.outree.clickedOU);
  const ouCode = useSelector((state) => state.outree.ouCode);
  const programSheet = useSelector((state) => state.main.programSheet);
  const uploadedSheet = useSelector((state) => state.sidebar.uploadedSheet);

  const [teiList, setTeiList] = useState([]);
  const [pending, setPending] = useState(0);
  const [success, setSuccess] = useState(0);
  const [failed, setFailed] = useState(0);

  useEffect(() => {
    if(programSheet.primaryAttr) {
      var length = 0;
      const modifiedSheet = [...uploadedSheet];
      const primaryAttrIndex = modifiedSheet[0].indexOf(programSheet.primaryAttr);
      modifiedSheet.shift();
      modifiedSheet.shift();
      modifiedSheet.map((sheet) => {
        if(sheet[primaryAttrIndex]) length += 1;
      });
      setPending(length);
    }
  }, []);
  
  useEffect(() => {
    uploadedSheet.shift();
    uploadedSheet.shift();
    const uploadList = async () => {
      var arrTei = teiList;

      for (let data of uploadedSheet) {
        if (data.length) {  
          var orgUnit = programSheet.orgUnit.index==0 ||  programSheet.orgUnit.index ? data[programSheet.orgUnit.index] : clickedOU.id;
          if(!clickedOU) orgUnit =  ouCode[orgUnit];

          const tei = createTei(orgUnit, programSheet, data);
          const existingEvent = {};
      
          const teiStatus = [];

          let resTei;
          let resEvents;
          
          let resExistingTei = await ApiService.trackedEntityInstance.filter(
            orgUnit,
            programSheet["program"]["id"],
            tei.primaryAttr.id,
            tei.primaryAttr.value
          );

          if (resExistingTei.trackedEntityInstances.length) {
            let trackedEntityInstances = resExistingTei.trackedEntityInstances[0];
            trackedEntityInstances.enrollments.forEach(enrollment =>
                enrollment.events.forEach((ev) => {
                  if (ev.eventDate) {
                    let eventDate = ev.eventDate.split("T")[0];
                    existingEvent[`${ev.programStage}-date-${eventDate}`] = eventDate;
                    existingEvent[`${ev.programStage}-ps-${eventDate}`] = ev.event;
                  }
                })
            );

            resTei = await ApiService.trackedEntityInstance.put(
              trackedEntityInstances.trackedEntityInstance,
              tei.attributes
            );
            teiStatus.push([
              tei.primaryAttr.value,
              "TEI",
              "Old",
              resTei.status,
              resTei.conflict,
              resTei.reference,
            ]);

          } else {
            resTei = await ApiService.trackedEntityInstance.post(tei.attributes);
            teiStatus.push([
              tei.primaryAttr.value,
              "TEI",
              "New",
              resTei.status,
              resTei.conflict,
              resTei.reference,
            ]);
            if (!resTei.conflict && programSheet.enrollmentDate.index) {
              const enrollmentDate = formatDate(
                data[programSheet.enrollmentDate.index],
                "YY-MM-DD"
              );

              const enroll = {
                trackedEntityType: tei.attributes.trackedEntityType,
                trackedEntityInstance: resTei.reference,
                orgUnit: tei.attributes.orgUnit,
                program: programSheet.program.id,
                enrollmentDate: enrollmentDate,
                incidentDate: enrollmentDate,
              };

              let resEnroll = await ApiService.trackedEntityInstance.enroll(
                enroll
              );
              teiStatus.push([
                tei.primaryAttr.value,
                "Enrollment",
                "New",
                resEnroll.status,
                resEnroll.conflict,
                resEnroll.reference,
              ]);
            }
          }
          
         const events = createEvents(resTei.reference,orgUnit, programSheet, data);
          for (let event of events) {
            if (
              new Date(event.eventDate).toString() ==
              new Date(existingEvent[`${event.programStage}-date-${event.eventDate}`]).toString()
            ) {
              resEvents = await ApiService.events.put(
                existingEvent[
                  `${event.programStage}-ps-${
                    existingEvent[`${event.programStage}-date-${event.eventDate}`]
                  }`
                ],
                event
              );
              teiStatus.push([
                tei.primaryAttr.value,
                "Event",
                "Old",
                resEvents.status,
                resEvents.conflict,
                resEvents.reference,
              ]);
            } else {
              resEvents = await ApiService.events.post({
                events: [event],
              });

              teiStatus.push([
                tei.primaryAttr.value,
                "Event",
                "New",
                resEvents.status,
                resEvents.conflict,
                resEvents.reference,
              ]);
            }
          }

          arrTei.push(teiStatus);
          if (teiStatus.filter((data) => data[4]).length)
            setFailed((failed) => failed + 1);
          else setSuccess((success) => success + 1);
          setPending((pending) => pending - 1);
          setTeiList([...arrTei]);
        }
      }
    };
    uploadList();
  }, []);

  return (
    <div className="ms-2 w-100">
      <h3 className="fw-bold text-center my-4">
        {programSheet.program.name} Program{" "}
        {pending != 0 ? <span> Uploading <span className="tei"></span> </span>: <span>[Completed]</span>}
      </h3>
      <div className="d-flex justify-content-around my-5">
        <h5 className="bg-light p-4 border border-success rounded-pill text-success">
          {" "}
          Pending: {pending}{" "}
        </h5>
        <h5 className="bg-success p-4 rounded-pill text-white">
          {" "}
          Success: {success}{" "}
        </h5>
        <h5 className="bg-danger p-4 rounded-pill text-white ">
          {" "}
          Failed: {failed}{" "}
        </h5>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th colSpan={5} className="fst-italic">
                Detailed overview:
              </th>
            </tr>
            <tr className="table-secondary">
              <th>S.No.</th>
              <th>Unique Identity</th>
              <th>Role</th>
              <th>Type</th>
              <th>Status</th>
              <th>Conflict</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {teiList.map((tei, sno) =>
              tei.map((val, index) => (
                <tr>
                  {index == 0 ? (
                    <>
                      <td rowSpan={tei.length}>{sno + 1}</td>
                      <td rowSpan={tei.length}>{val[0]}</td>
                    </>
                  ) : (
                    ""
                  )}
                  <td>{val[1]}</td>
                  <td>{val[2]}</td>
                  <td>{val[3]}</td>
                  <td>{val[4]}</td>
                  <td>{val[5]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SheetStatus;
