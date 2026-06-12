import React, { useEffect, useState } from "react";
import "./meal.css";

const Meal = () => {
  const [mealData, setMealData] = useState([]);
  const [area, setArea] = useState("India"); // Default Capital "India" rakha hai
  const [inputData, setInputData] = useState("");
  
  const [selectedMealID, setSelectedMealID] = useState("");
  const [mealDetails, setMealDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const api = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
        );
        const data = await api.json();
        setMealData(data.meals || []);
      } catch (error) {
        console.error("Error fetching area meals:", error);
      }
    };
    fetchDataFromAPI();
  }, [area]);

  useEffect(() => {
    if (!selectedMealID) {
      setMealDetails(null);
      return;
    }
    const fetchMealDetails = async () => {
      setLoadingDetails(true);
      try {
        const api = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${selectedMealID}`
        );
        const data = await api.json();
        if (data.meals && data.meals.length > 0) {
          setMealDetails(data.meals[0]);
        }
      } catch (error) {
        console.error("Error fetching meal details:", error);
      } finally {
        setLoadingDetails(false);
      }
    };
    
    fetchMealDetails();
  }, [selectedMealID]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!inputData.trim()) return;
    try {
      const api = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputData}`
      );
      const data = await api.json();
      setMealData(data.meals || []);
    } catch (error) {
      console.error("Error searching meals:", error);
    }
  };

  return (
    <div className="main-app-container">
      <h1 className="app-title">Swaad Yatra</h1>
      <div className="category-container">
        {["India", "Canadian", "Japan", "Thai", "British", "Russian"].map((c) => (
          <button
            key={c}
            onClick={() => setArea(c)}
            type="button"
            className={`category-btn ${area.toLowerCase() === c.toLowerCase() ? "active" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* --- RE-STRUCTURED SEARCH BAR WITH WRAPPER & BUTTON --- */}
      <form onSubmit={submitHandler} className="search-form">
        <div className="search-wrapper">
          <input
            onChange={(e) => setInputData(e.target.value)}
            type="text"
            className="search-input"
            placeholder="Search delicious recipes..."
            value={inputData}
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </div>
      </form>

      <div className="food-grid">
        {mealData.length > 0 ? (
          mealData.map((data) => (
            <div
              key={data.idMeal}
              onClick={() => setSelectedMealID(data.idMeal)}
              className="food-card"
            >
              <div className="card-img-wrapper">
                <img src={data.strMealThumb} alt={data.strMeal} />
              </div>
              <h5>{data.strMeal}</h5>
            </div>
          ))
        ) : (
          <h4 style={{ color: "#a0aec0", gridColumn: "1/-1" }}>No meals found. Try searching something else!</h4>
        )}
      </div>

      {selectedMealID && (
        <div className="modal-overlay" onClick={() => setSelectedMealID("")}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setSelectedMealID("")}>
              &times;
            </span>

            {loadingDetails && <h4 className="modal-loading">Loading Recipe Details...</h4>}

            {!loadingDetails && mealDetails && (
              <>
                <div className="modal-header-section">
                  <div className="modal-img-container">
                    <img
                      src={mealDetails.strMealThumb}
                      alt={mealDetails.strMeal}
                      className="modal-img"
                    />
                  </div>
                  <div className="modal-title-container">
                    <h2>{mealDetails.strMeal}</h2>
                    <span className="badge-tag">{mealDetails.strCategory}</span>
                    <span className="badge-tag area-tag">{mealDetails.strArea}</span>
                  </div>
                </div>
                <div className="modal-instructions">
                  <h3>How to Prepare:</h3>
                  <p>{mealDetails.strInstructions}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Meal;