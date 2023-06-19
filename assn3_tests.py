import requests
import pytest


# Test 1: Execute three POST /dishes requests
def test_post_dishes():
    dishes = ["orange", "spaghetti", "apple pie"]
    ids = set()

    for dish in dishes:
        response = requests.post("http://localhost:8000/dishes", json={"name": dish})
        assert response.status_code == 201
        response_body = response.json()
        ids.add(response_body)

    assert len(ids) == 3


# Test 2: Execute a GET dishes/<orange-ID> request
def test_get_dish():
    orange_id = get_meal_ID_by_name("orange")
    response = requests.get(f"http://localhost:8000/dishes/{orange_id}")
    assert response.status_code == 200
    data = response.json()    
    
    assert 0.9 <= data["sodium"] <= 1.1



# Test 3: Execute a GET /dishes request
def test_get_all_dishes():
    response = requests.get("http://localhost:8000/dishes")
    data = response.json()

    assert response.status_code == 200
    assert len(data) == 3
    


# Test 4: Execute a POST /dishes request with dish name "blah"
def test_post_invalid_dish():
    response = requests.post("http://localhost:8000/dishes", json={"name": "blah"})
    assert response.json() == -3
    assert response.status_code in [404, 400, 422]


# Test 5: Perform a POST dishes request with dish name "orange"
def test_post_existing_dish():
    response = requests.post("http://localhost:8000/dishes", json={"name": "orange"})
    assert response.json() == -2
    assert response.status_code in [400, 404, 422]


# Test 6: Perform a POST /meals request specifying meal details
def test_post_meal():
    appetizer_id = get_meal_ID_by_name("orange")
    main_id = get_meal_ID_by_name("spaghetti")
    dessert_id = get_meal_ID_by_name("apple pie")

    response = requests.post(
        "http://localhost:8000/meals",
        json={
            "name": "delicious",
            "appetizer": appetizer_id,
            "main": main_id,
            "dessert": dessert_id,
        },
    )
    assert response.status_code == 201
    assert response.json() > 0
    


# Test 7: Perform a GET /meals request
def test_get_all_meals():
    response = requests.get("http://localhost:8000/meals")
    data = response.json()

    assert response.status_code == 200
    
    assert len(data) == 1

    assert 400 <= data[0]["calories"] <= 500


    
# Test 8: Perform a POST /meals request with the same meal name as an existing meal
def test_post_existing_meal():
    appetizer_id = get_meal_ID_by_name("orange")
    main_id = get_meal_ID_by_name("spaghetti")
    dessert_id = get_meal_ID_by_name("apple pie")

    response = requests.post(
        "http://localhost:8000/meals",
        json={
            "name": "delicious",
            "appetizer": appetizer_id,
            "main": main_id,
            "dessert": dessert_id,
        },
    )
    assert response.status_code in [400, 422]
    assert response.json() == -2
    


def get_meal_ID_by_name(name):
    response = requests.get(f"http://localhost:8000/dishes/{name}")
    try:
        meal_id = response_orange.json()
        return meal_id
    except:
        assert False,f"No {name} in DB"