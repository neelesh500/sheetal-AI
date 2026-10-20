"""
Unit and integration tests for Sheetal AI health and root endpoints.
Uses direct handler execution compatible with Python 3.14.
"""

import pytest
from backend.main import read_root, health_check, load_artifacts


@pytest.fixture(scope="module", autouse=True)
def setup_artifacts():
    load_artifacts()


def test_root_endpoint():
    data = read_root()
    assert data["status"] == "online"
    assert "version" in data
    assert data["ml_ready"] is True
    assert data["records_count"] == 44
    assert data["health"] == "/health"


def test_health_endpoint():
    data = health_check()
    assert data["status"] == "healthy"
    assert "timestamp_utc" in data
    assert data["services"]["ml_model_loaded"] is True
    assert data["services"]["dataset_loaded"] is True
    assert data["services"]["dataset_records"] == 44
    assert data["services"]["database_connected"] is True
    assert data["services"]["database_records"] == 44
