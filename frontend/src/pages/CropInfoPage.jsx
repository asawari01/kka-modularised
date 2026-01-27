import React from "react";

// We can add a CSS file later if needed
// import '../css/CropInfoPage.css';

const CropInfoPage = () => {
  return (
    <div className="page-content">
      <div className="page-main-content">
        <h1 className="page-title">Crop Information</h1>
        <p className="page-subtitle">
          Detailed information about various crops, planting techniques, and
          disease management.
        </p>
      </div>

      {/* We can reuse this CSS class from HomePage.css */}
      <div className="gemini-result-container">
        <div className="gemini-answer">
          <p>
            This page will contain detailed information about different crops.
            <br />
            <br />
            In the future, we can add a search bar here to find information on a
            specific crop (e.g., "Wheat"), or use the Gemini API to answer
            specific questions about crop management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CropInfoPage;
