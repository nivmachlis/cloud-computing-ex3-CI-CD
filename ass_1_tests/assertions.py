import requests

import connectionController


def assert_err_code(response: requests.Response, error_code: int):
    assert response.status_code == error_code


def assert_ret_value(response: requests.Response, returned_value: any):
    assert response.json() == returned_value


def assert_valid_added_resource(response: requests.Response):
    assert response.status_code == 201
    # should be positive ID
    VALID_RETURNED_RESOURCE_ID = 0
    assert response.json() > VALID_RETURNED_RESOURCE_ID


def assert_dish(output: {}, expected_output: {}):
    assert output["name"] == expected_output["name"]
    assert output["cal"] == expected_output["cal"]
    assert output["size"] == expected_output["size"]
    assert output["sodium"] == expected_output["sodium"]
    assert output["sugar"] == expected_output["sugar"]


def assert_meal(meal: {}):
    assert "ID" in meal
    assert "appetizer" in meal
    assert "main" in meal
    assert "dessert" in meal
    assert "cal" in meal
    assert "sodium" in meal
    assert "sugar" in meal


def assert_not_existed_meal(meal_identifier: any) -> None:
    response = connectionController.http_get(f"meals/{meal_identifier}")
    assert_err_code(response, error_code=404)
    assert_ret_value(response, returned_value=-5)


def assert_meal_values(meal: {}, dish_1: {}, dish_2: {}, dish_3: {}):
    # convert float to int because of python float limitation (https://docs.python.org/3/tutorial/floatingpoint.html)
    assert int(meal["cal"]) == int(dish_1["cal"] + dish_2["cal"] + dish_3["cal"])
    assert int(meal["sodium"]) == int(dish_1["sodium"] + dish_2["sodium"] + dish_3["sodium"])
    assert int(meal["sugar"]) == int(dish_1["sugar"] + dish_2["sugar"] + dish_3["sugar"])
