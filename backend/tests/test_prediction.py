"""
Unit and edge-case tests for the AI prediction pipeline and input validation.
"""

import pytest
from pydantic import ValidationError
from backend.main import run_ai_prediction, PredictionRequest, load_artifacts


@pytest.fixture(scope="module", autouse=True)
def setup_artifacts():
    load_artifacts()


def test_prediction_success():
    req = PredictionRequest(
        region="New Delhi",
        latitude=28.6139,
        longitude=77.2090,
        air_temp_2m_celsius=42.0,
        ndvi=0.25,
        surface_albedo=0.20,
        canopy_cover_pct=20.0,
        impervious_surface_pct=70.0
    )
    res = run_ai_prediction(req)
    assert res.status == "success"
    assert res.data_mode == "trained_model"
    assert res.predicted_cooling_celsius >= 0.0
    assert res.projected_air_temp_celsius <= req.air_temp_2m_celsius
    assert res.empirical_error_bound_celsius > 0.0
    assert "Leave-One-City-Out" in res.validation_strategy


def test_prediction_rejects_out_of_bounds_latitude():
    with pytest.raises(ValidationError):
        PredictionRequest(
            region="Invalid",
            latitude=125.0,  # Invalid latitude (>90)
            longitude=77.2,
            air_temp_2m_celsius=40.0,
            ndvi=0.2,
            surface_albedo=0.2,
            canopy_cover_pct=10.0,
            impervious_surface_pct=50.0
        )


def test_prediction_rejects_physically_inconsistent_land_cover():
    with pytest.raises(ValidationError) as exc_info:
        PredictionRequest(
            region="Impossible",
            latitude=28.6,
            longitude=77.2,
            air_temp_2m_celsius=40.0,
            ndvi=0.2,
            surface_albedo=0.2,
            canopy_cover_pct=80.0,
            impervious_surface_pct=80.0  # Sum = 160% > 120%
        )
    assert "realistic boundary" in str(exc_info.value)


def test_prediction_rejects_negative_ndvi_with_dense_trees():
    with pytest.raises(ValidationError) as exc_info:
        PredictionRequest(
            region="Impossible",
            latitude=28.6,
            longitude=77.2,
            air_temp_2m_celsius=40.0,
            ndvi=-0.5,  # Water/snow index
            surface_albedo=0.2,
            canopy_cover_pct=50.0,  # Impossible canopy with negative NDVI
            impervious_surface_pct=30.0
        )
    assert "strongly negative NDVI" in str(exc_info.value)
