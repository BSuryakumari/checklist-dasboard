import React, { useState, useEffect } from "react";
import "./Checklist.css";

function Checklist() {
  const [rules, setRules] = useState([]); // Ensure initial state is an array
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChecklist() {
      try {
        const response = await fetch(
          "http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639"
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Validate and parse data based on the expected structure
        const applicationData = {
          isValuationFeePaid: data.isValuationFeePaid,
          isUkResident: data.isUkResident,
          riskRating: data.riskRating,
          loanRequired: data.loanRequired,
          purchasePrice: data.purchasePrice,
        };

        // Checklist rules with dynamic evaluation
        const rules = [
          {
            rule: "Valuation Fee Paid",
            status: applicationData.isValuationFeePaid ? "Passed" : "Failed",
          },
          {
            rule: "UK Resident",
            status: applicationData.isUkResident ? "Passed" : "Failed",
          },
          {
            rule: "Risk Rating Medium",
            status: applicationData.riskRating === "Medium" ? "Passed" : "Failed",
          },
          {
            rule: "LTV Below 60%",
            status:
              (applicationData.loanRequired / applicationData.purchasePrice) * 100 < 60
                ? "Passed"
                : "Failed",
          },
        ];

        setRules(rules);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchChecklist();
  }, []);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="checklist-container">
      {rules.length > 0 ? (
        rules.map((rule, index) => (
          <div key={index} className={`rule ${rule.status.toLowerCase()}`}>
            <span>{rule.rule}</span>
            <span className="status">{rule.status}</span>
          </div>
        ))
      ) : (
        <div className="no-data">Loading rules...</div>
      )}
    </div>
  );
}

export default Checklist;
