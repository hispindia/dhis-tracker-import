import React from "react";
import "./styles.scss";
import Sheet from "../Sheet";
import { useSelector } from "react-redux";
import SheetStatus from "./SheetStatus.component";

const Main = () => {

  const status = useSelector(state => state.main.status);
  const displaySheet = useSelector(state => state.sidebar.displaySheet);

  return (
    <div className="ms-2 w-100">
      { displaySheet && !status ? <Sheet /> : ''}
      {status && <SheetStatus />}
      
    </div>
  );
};

export default Main;
