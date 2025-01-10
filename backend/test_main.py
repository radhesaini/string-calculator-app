import pytest
from fastapi.testclient import TestClient
from main import app, Calculator, MyException


client = TestClient(app)

def test_calculator_empty_string():
    calculator = Calculator()
    assert calculator.add("") == 0

def test_calculator_single_number():
    calculator = Calculator()
    assert calculator.add("1") == 1

def test_calculator_two_numbers():
    calculator = Calculator()
    assert calculator.add("1,5") == 6

def test_calculator_multiple_numbers():
    calculator = Calculator()
    assert calculator.add("1,2,3,4,5") == 15

def test_calculator_newlines():
    calculator = Calculator()
    assert calculator.add("1\n2,3") == 6

def test_calculator_custom_delimiter():
    calculator = Calculator()
    assert calculator.add("//;\n1;2") == 3

def test_calculator_negative_numbers():
    calculator = Calculator()
    with pytest.raises(ValueError, match="negative numbers not allowed - -2,-4"):
        calculator.add("1,-2,3,-4")

# API Tests
def test_api_calculate_success():
    response = client.post("/calculate", json={"numbers": "1,2,3"})
    assert response.status_code == 200
    assert response.json() == {"result": 6}

def test_api_calculate_empty():
    response = client.post("/calculate", json={"numbers": ""})
    assert response.status_code == 200
    assert response.json() == {"result": 0}

def test_api_calculate_negative_numbers():
    response = client.post("/calculate", json={"numbers": "1,-2,3"})
    assert response.status_code == 400
    assert "negative numbers not allowed - " in response.json()["detail"]