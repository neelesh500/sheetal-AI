"""
Unit and integration tests for the Intervention Comparison API.
"""

import pytest
from backend.main import (
    compare_interventions,
    InterventionComparisonRequest,
    InterventionScenario,
    load_artifacts
)


@pytest.fixture(scope="module", autouse=True)
def setup_artifacts():
    load_artifacts()


def test_intervention_comparison_success():
    req = InterventionComparisonRequest(
        baseline_region="New Delhi",
        baseline_latitude=28.6139,
        baseline_longitude=77.2090,
        baseline_air_temp=43.0,
        baseline_canopy_pct=10.0,
        baseline_albedo=0.15,
        baseline_impervious_pct=80.0,
        scenarios=[
            InterventionScenario(
                scenario_id="sc-1",
                name="Cool Roofs Initiative",
                canopy_cover_pct=10.0,
                surface_albedo=0.65
            ),
            InterventionScenario(
                scenario_id="sc-2",
                name="Urban Forestry & Pocket Parks",
                canopy_cover_pct=35.0,
                surface_albedo=0.20
            )
        ]
    )

    data = compare_interventions(req)
    assert data["status"] == "success"
    report = data["report"]
    assert "baseline" in report
    assert len(report["scenarios"]) == 2

    sc1 = report["scenarios"][0]
    assert sc1["scenario_name"] == "Cool Roofs Initiative"
    assert "net_additional_cooling_celsius" in sc1

    sc2 = report["scenarios"][1]
    assert sc2["scenario_name"] == "Urban Forestry & Pocket Parks"
    assert sc2["canopy_delta_pct"] == 25.0
    assert sc2["predicted_cooling_celsius"] >= report["baseline"]["initial_cooling_celsius"]
