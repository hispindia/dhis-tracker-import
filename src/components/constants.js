export const primaryAttribute = "VTCQOcgxnbu";
export const enrollmentDateIndex = 12;
export const eventtDateIndex = 12;

//event to accept Single or Multiple.
export const eventAccepted = "single"

export const InitialQuery = {
  me: {
    resource: "me.json",
    params: {
      fields: ["id", "organisationUnits[id,name,code,path]"],
    },
  },
  ouList: {
    resource: "organisationUnits.json",
    params: {
      fields: ["id,name,code,path,children[id,name]"],
      withinUserHierarchy: true,
      paging: false,
    },
  },
  programList: {
    resource: "programs.json",
    params: {
      fields: [
        "id,name,trackedEntityType,programTrackedEntityAttributes[id,valueType,trackedEntityAttribute[id,name,optionSetValue,optionSet[options[name,code]]]],programStages[id,name,programStageDataElements[compulsory,dataElement[id,name,valueType,optionSetValue,optionSet[options[name,code]]]]],organisationUnits",
      ],
      paging: false,
    },
  },
};
