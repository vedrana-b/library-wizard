import React, { useState } from "react";

const Steps = ({ flow, step }) => {
  return (
    <div className="grid-x steps">
      {flow.map((flowStep, index) => {
        return (
          <div key={index} className="step">
            <div
              className={
                step === Number(flowStep.step || index + 1)
                  ? "step__counter active"
                  : "step__counter"
              }
            >
              {flowStep.step || index + 1}
            </div>
            <div className="step__text">
              <h6>{flowStep.label}</h6>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Steps;
