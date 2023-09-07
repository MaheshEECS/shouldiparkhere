import React from "react";

const Result = ({riskLevel, riskDescription, riskColor, incidentsNum}) => {
  return (
    <div className="result-screen">
      <div className="risk-circle" style={{backgroundColor:riskColor}}>
        <h1 className="title">{riskLevel}</h1>
      </div>
      <div className="result-subtitle text bold">{`RISK: ${riskDescription}`}</div>
      <p>(<span className="bold">{incidentsNum}</span> car thefts nearby in the last 60 days)</p>
    </div>
  );
};

export default Result;
