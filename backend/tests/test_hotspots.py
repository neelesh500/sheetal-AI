"""
Unit tests for Sheetal AI Hotspot & Dataset Catalog endpoints.
"""

import pytest
from backend.main import get_hotspots, get_dataset_catalog, load_artifacts


@pytest.fixture(scope="module", autouse=True)
def setup_artifacts():
    load_artifacts()


def test_get_all_hotspots():
    data = get_hotspots()
    assert data["status"] == "success"
    assert data["total"] == 44
    assert len(data["data"]) == 44

    first = data["data"][0]
    assert "lst_celsius" in first
    assert "air_temp_2m_celsius" in first
    assert "latitude" in first
    assert "longitude" in first
    assert "satellite_sensor" in first


def test_filter_hotspots_by_region():
    data = get_hotspots(region="New Delhi")
    assert data["status"] == "success"
    assert data["total"] == 12
    for item in data["data"]:
        assert item["region"].lower() == "new delhi"


def test_dataset_catalog_endpoint():
    data = get_dataset_catalog()
    assert data["status"] == "success"
    assert data["total_records"] == 44
    assert "provenance" in data
