"""
Unit tests for the ML evaluation pipeline and baseline comparison.
"""

from backend.evaluate_model import run_evaluation


def test_reproducible_evaluation_metrics():
    res = run_evaluation()

    assert res["dataset_samples"] == 44
    assert res["cities_count"] == 7

    # Assert LOCO metrics for Random Forest
    rf_loco = res["loco"]["Random Forest"]
    assert rf_loco["r2"] > 0.90
    assert rf_loco["rmse"] < 0.50
    assert rf_loco["mae"] < 0.30

    # Assert baseline comparisons exist
    assert "Ridge Linear Baseline" in res["loco"]
    assert "Mean Persistence Baseline" in res["loco"]

    # Random forest should vastly outperform mean baseline
    assert rf_loco["rmse"] < res["loco"]["Mean Persistence Baseline"]["rmse"]

    # All 7 cities covered in breakdown
    assert len(res["city_breakdown"]) == 7
    for city in ["New Delhi", "Mumbai", "Bengaluru", "Ahmedabad", "Chennai", "Hyderabad", "Phoenix"]:
        assert city in res["city_breakdown"]
        assert res["city_breakdown"][city]["rmse"] < 0.60
