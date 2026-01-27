import React from "react";

// We can add a CSS file later if needed
// import '../css/GovSchemesPage.css';

const GovSchemesPage = () => {
  return (
    <div className="page-content">
      <div className="page-main-content">
        <h1 className="page-title">Government Schemes</h1>
        <p className="page-subtitle">
          Find the latest government schemes and subsidies available for
          farmers.
        </p>
      </div>

      {/* We can reuse this CSS class from HomePage.css */}
      <div className="gemini-result-container">
        <div className="gemini-answer">
          <p>
            This page will list all relevant government schemes for farmers.
            <br />
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};

export default GovSchemesPage;
