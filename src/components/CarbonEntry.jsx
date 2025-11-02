import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Profile } from "./Profile";
import { Body } from "./Dashboard";
import useCarbonStore from "../stores/carbonStore";
import LoadingSpinner from "./common/LoadingSpinner";
import toast from "react-hot-toast";

export default function CarbonEntry() {
  return (
    <div className="dashboard">
      <Header defaultTab="home">
        <Profile />
      </Header>

      <Body className="carbon-entry">
        <CarbonEntryForm />
      </Body>
    </div>
  );
}

function CarbonEntryForm() {
  const navigate = useNavigate();
  const { createEntry, isLoading, emissionFactors, fetchEmissionFactors } = useCarbonStore();

  const [formData, setFormData] = useState({
    entryType: "electricity",
    quantity: "",
    unit: "kWh",
    entryDate: new Date().toISOString().split("T")[0],
    sustainabilityLevel: 1,
    notes: "",
    emissionFactorId: "",
  });

  const [calculatedEmissions, setCalculatedEmissions] = useState(null);

  useEffect(() => {
    fetchEmissionFactors();
  }, [fetchEmissionFactors]);

  const entryTypes = [
    { value: "electricity", label: "Electricity", icon: "⚡", unit: "kWh" },
    { value: "fuel", label: "Fuel", icon: "⛽", unit: "liters" },
    { value: "transport", label: "Transportation", icon: "🚗", unit: "km" },
    { value: "waste", label: "Waste", icon: "♻️", unit: "kg" },
    { value: "water", label: "Water", icon: "💧", unit: "m³" },
    { value: "renewable_energy", label: "Renewable Energy", icon: "🌞", unit: "kWh" },
    { value: "carbon_offset", label: "Carbon Offset", icon: "🌳", unit: "tCO2e" },
  ];

  const sustainabilityLevels = [
    { value: 1, label: "Level 1 - Basic", description: "Standard emission tracking" },
    { value: 2, label: "Level 2 - Intermediate", description: "Improved sustainability practices" },
    { value: 3, label: "Level 3 - Advanced", description: "Best-in-class sustainability" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update unit when entry type changes
    if (name === "entryType") {
      const entryTypeData = entryTypes.find((t) => t.value === value);
      if (entryTypeData) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          unit: entryTypeData.unit,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "sustainabilityLevel" ? parseInt(value) : value,
      }));
    }
  };

  const calculateEmissions = () => {
    // Simple emission factor calculation
    const emissionFactors = {
      electricity: 0.5, // kg CO2 per kWh
      fuel: 2.3, // kg CO2 per liter
      transport: 0.192, // kg CO2 per km
      waste: 0.5, // kg CO2 per kg
      water: 0.3, // kg CO2 per m³
      renewable_energy: 0.05, // kg CO2 per kWh
      carbon_offset: -1, // negative emissions
    };

    const factor = emissionFactors[formData.entryType] || 0.1;
    const emissions = parseFloat(formData.quantity) * factor;
    setCalculatedEmissions(emissions.toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.entryType || !formData.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Select emission factor - try to find matching one or use first available
    let emissionFactorId = formData.emissionFactorId;

    if (!emissionFactorId && emissionFactors.length > 0) {
      // Try to find matching emission factor by type
      const matchingFactor = emissionFactors.find(
        (factor) => factor.category?.toLowerCase() === formData.entryType
      );
      emissionFactorId = matchingFactor?._id || emissionFactors[0]._id;
    }

    if (!emissionFactorId) {
      toast.error("No emission factors available. Please contact support.");
      return;
    }

    // Format data according to backend API expectations
    const entryData = {
      entryDate: formData.entryDate,
      entryType: formData.entryType,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      emissionFactorId: emissionFactorId,
      sustainabilityLevel: formData.sustainabilityLevel,
      notes: formData.notes || undefined,
    };

    console.log("Submitting carbon entry:", entryData);

    const result = await createEntry(entryData);

    if (result.success) {
      toast.success("Carbon entry added successfully!");
      navigate("/home");
    } else {
      // Error is already handled by the store, but log for debugging
      console.error("Failed to create entry:", result.error);
    }
  };

  useEffect(() => {
    if (formData.quantity && formData.entryType) {
      calculateEmissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.quantity, formData.entryType]);

  return (
    <div className="carbon-entry-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/home")}>
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Dashboard
        </button>
        <div className="header-content">
          <h1>Add Carbon Entry</h1>
          <p>Track your organization's carbon emissions</p>
        </div>
      </div>

      <div className="entry-form-card">
        <form onSubmit={handleSubmit} className="carbon-form">
          {/* Entry Type Selection */}
          <div className="form-section">
            <h3 className="section-title">1. Select Entry Type</h3>
            <div className="category-grid">
              {entryTypes.map((type) => (
                <label
                  key={type.value}
                  className={`category-card ${
                    formData.entryType === type.value ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="entryType"
                    value={type.value}
                    checked={formData.entryType === type.value}
                    onChange={handleInputChange}
                  />
                  <div className="category-content">
                    <span className="category-icon">{type.icon}</span>
                    <span className="category-label">{type.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Entry Details */}
          <div className="form-section">
            <h3 className="section-title">2. Entry Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="entryDate">
                  Date <span className="required">*</span>
                </label>
                <input
                  id="entryDate"
                  type="date"
                  name="entryDate"
                  value={formData.entryDate}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sustainabilityLevel">
                  Sustainability Level <span className="required">*</span>
                </label>
                <select
                  id="sustainabilityLevel"
                  name="sustainabilityLevel"
                  value={formData.sustainabilityLevel}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                >
                  {sustainabilityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">
                  Quantity <span className="required">*</span>
                </label>
                <div className="input-with-unit">
                  <input
                    id="quantity"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                    disabled={isLoading}
                    min="0"
                    step="0.01"
                  />
                  <span className="unit-label">{formData.unit}</span>
                </div>
              </div>

              {calculatedEmissions && (
                <div className="form-group">
                  <label>Estimated Emissions</label>
                  <div className="emissions-display">
                    <span className="emissions-value">{calculatedEmissions}</span>
                    <span className="emissions-unit">kg CO₂e</span>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any additional details about this entry..."
                rows="3"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/home")}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">check</span>
                  <span>Add Entry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="info-card">
        <div className="info-header">
          <span className="material-symbols-outlined">info</span>
          <h4>About Carbon Tracking</h4>
        </div>
        <p>
          Carbon emissions are measured in CO₂ equivalents (CO₂e), which
          represents the global warming potential of different greenhouse gases.
        </p>
        <ul className="info-list">
          <li>Enter accurate quantities for better tracking</li>
          <li>Regular entries help identify reduction opportunities</li>
          <li>Historical data improves emission forecasting</li>
        </ul>
      </div>
    </div>
  );
}
