import connectionController
from assertions import *
import database
from restApiController import *


# tests for dish API


def test_dishes_sanity():
    response = connectionController.http_get("dishes")
    assert response.status_code == 200
    assert response.json() == {}


def test_get_not_exists_dish_by_id():
    NOT_EXISTS_DISH_ID = 11235
    response = connectionController.http_get(f"dishes/{NOT_EXISTS_DISH_ID}")
    assert_err_code(response, error_code=404)
    assert_ret_value(response, returned_value=-5)


def test_get_not_exists_dish_by_name():
    NOT_EXISTS_DISH = "not_exists_dish"
    response = connectionController.http_get(f"dishes/{NOT_EXISTS_DISH}")
    assert_err_code(response, error_code=404)
    assert_ret_value(response, returned_value=-5)


def test_add_dish_identifier_is_positive_integer():
    add_dish("rice")


def test_get_dish_by_id():
    milk_id = add_dish(database.MILK["name"])
    response = connectionController.http_get(f"dishes/{milk_id}")
    assert_err_code(response, error_code=200)
    assert_dish(response.json(), database.MILK)


def test_get_dish_by_name():
    dish_name = database.FOCACCIA["name"]
    add_dish(dish_name)
    response = connectionController.http_get(f"dishes/{dish_name}")
    assert_err_code(response, error_code=200)
    assert_dish(response.json(), database.FOCACCIA)


def test_get_all_dishes():
    response = connectionController.http_get("dishes")
    assert_err_code(response, error_code=200)

    DISH_INDEX = "1"
    dishes = response.json()
    assert len(dishes) > 0
    dish = dishes[DISH_INDEX]

    assert "ID" in dish
    assert "name" in dish
    assert "cal" in dish
    assert "size" in dish
    assert "sodium" in dish
    assert "sugar" in dish


def test_dish_api_media_not_supported():
    data = {"name": "rice"}
    response = connectionController.post_raw("dishes", data, {})
    assert_err_code(response, error_code=415)
    assert_ret_value(response, 0)


def test_add_dish_name_is_not_specified():
    data = {"no name key": "rice"}
    response = connectionController.http_post("dishes", data)
    assert_err_code(response, error_code=422)
    assert_ret_value(response, -1)


def test_add_exists_dish():
    DISH_NAME = "water"
    add_dish(DISH_NAME)
    response = connectionController.http_post("dishes", {"name": DISH_NAME})
    assert_err_code(response, error_code=422)
    assert_ret_value(response, -2)


def test_add_invalid_dish():
    INVALID_DISH = {"name": "invalid dish"}
    response = connectionController.http_post("dishes", INVALID_DISH)
    assert_err_code(response, error_code=422)
    assert_ret_value(response, -3)


def test_delete_all_dishes():
    response = connectionController.http_delete("dishes")
    assert_err_code(response, error_code=405)


def test_delete_not_exists_dish_by_id():
    response = connectionController.http_delete("dishes/123110923")
    assert_err_code(response, error_code=404)
    assert_ret_value(response, -5)


def test_delete_not_exists_dish_by_name():
    response = connectionController.http_delete("dishes/not_exists_dish")
    assert_err_code(response, error_code=404)
    assert_ret_value(response, -5)


def test_delete_dish_by_id():
    dish_id = add_dish("pasta")
    response = connectionController.http_delete(f"dishes/{dish_id}")
    assert_err_code(response, error_code=200)
    assert_ret_value(response, dish_id)


def test_delete_dish_by_name():
    DISH_NAME = "pasta"
    dish_id = add_dish(DISH_NAME)
    response = connectionController.http_delete(f"dishes/{DISH_NAME}")
    assert_err_code(response, error_code=200)
    assert_ret_value(response, dish_id)


# tests for meals API


def test_meals_sanity():
    NO_MEALS = {}
    response = connectionController.http_get("meals")
    assert_err_code(response, error_code=200)
    assert_ret_value(response, NO_MEALS)


def test_first_meal_id_is_positive_integer():
    appetizer_id = add_dish("green salad")
    main_id = add_dish("sea bass")
    dessert_id = add_dish("granola")

    add_meal("healthy fish meal", appetizer_id, main_id, dessert_id)


def test_add_second_meal():
    appetizer_id = add_dish("pasta")
    main_id = add_dish("salmon")
    dessert_id = add_dish("chocolate cake")
    add_meal("fatty fish meal", appetizer_id, main_id, dessert_id)


def test_meal_api_media_not_supported():
    meal = {"name": "test_meal_api_media_not_supported meal", "appetizer": 1, "main": 1, "dessert": 1}
    response = connectionController.post_raw("meals", meal, {})
    assert_err_code(response, error_code=415)
    assert_ret_value(response, returned_value=0)


def test_add_meal_missing_parameter():
    MISSING_APPTIZER = {"name": "test_add_meal_missing_parameter meal", "main": 1, "dessert": 1}
    response = connectionController.http_post("meals", MISSING_APPTIZER)
    assert_err_code(response, error_code=422)
    assert_ret_value(response, returned_value=-1)


def test_add_exists_meal():
    meal = {"name": "test_add_exists_meal meal", "appetizer": 1, "main": 1, "dessert": 1}
    add_meal(meal["name"], meal["appetizer"], meal["main"], meal["dessert"])

    response = connectionController.http_post("meals", meal)
    assert_err_code(response, error_code=422)
    assert_ret_value(response, returned_value=-2)


def test_add_meal_without_existed_dessert():
    NOT_EXISTS_DESSERT = 1231284
    meal = {"name": "test_add_meal_without_existed_dessert meal", "appetizer": 1, "main": 1, "dessert": NOT_EXISTS_DESSERT}
    response = connectionController.http_post("meals", meal)
    assert_err_code(response, error_code=422)
    assert_ret_value(response, returned_value=-6)


def test_get_all_meals():
    response = connectionController.http_get("meals")
    assert_err_code(response, error_code=200)

    meals = response.json()
    assert len(meals) > 0

    DISH_INDEX = "1"
    meal = meals[DISH_INDEX]
    assert_meal(meal)


def test_get_meal_by_id():
    mushroom_id = add_dish(database.MUSHROOM["name"])
    risotto_id = add_dish(database.RISOTTO["name"])
    brioche_id = add_dish(database.BRIOCHE["name"])
    meal_id = add_meal("test_get_meal_by_id meal", mushroom_id, risotto_id, brioche_id)

    response = connectionController.http_get(f"meals/{meal_id}")
    assert_err_code(response, error_code=200)

    meal = response.json()
    assert_meal(meal)
    assert_meal_values(meal, database.MUSHROOM, database.RISOTTO, database.BRIOCHE)


def test_get_meal_by_name():
    hummus_id = add_dish(database.HUMMUS["name"])
    noodles_id = add_dish(database.NOODLES["name"])
    pineapple_id = add_dish(database.PINEAPPLE["name"])
    MEAL_NAME = "test_get_meal_by_name meal"
    add_meal(MEAL_NAME, hummus_id, noodles_id, pineapple_id)

    response = connectionController.http_get(f"meals/{MEAL_NAME}")
    assert_err_code(response, error_code=200)

    meal = response.json()
    assert_meal(meal)
    assert_meal_values(meal, database.HUMMUS, database.NOODLES, database.PINEAPPLE)


def test_get_not_existed_meal_by_id():
    NOT_EXISTS_MEAL_ID = 8947101
    assert_not_existed_meal(NOT_EXISTS_MEAL_ID)


def test_get_not_existed_meal_by_name():
    NOT_EXISTS_MEAL = "test_get_not_existed_meal_by_name meal"
    assert_not_existed_meal(NOT_EXISTS_MEAL)


def test_change_meal():
    bread_id = add_dish(database.BREAD["name"])
    salad_id = add_dish(database.SALAD["name"])
    watermelon_id = add_dish(database.WATERMELON["name"])
    peach_id = add_dish(database.PEACH["name"])

    meal_id = add_meal("test_change_meal meal", bread_id, salad_id, watermelon_id)
    meal = {"name": "test_change_meal meal", "appetizer": bread_id, "main": salad_id, "dessert": peach_id}
    response = connectionController.http_put(f"meals/{meal_id}", meal)
    assert_err_code(response, error_code=200)
    assert_ret_value(response, returned_value=meal_id)

    response = connectionController.http_get(f"meals/{meal_id}")
    assert_err_code(response, error_code=200)

    meal = response.json()
    assert_meal_values(meal, database.BREAD, database.SALAD, database.PEACH)


def test_delete_meal_by_id():
    meal_id = add_meal("meal 5", 1, 1, 1)
    response = connectionController.http_delete(f"meals/{meal_id}")
    assert_err_code(response, error_code=200)
    assert response.json() == meal_id
    assert_not_existed_meal(meal_id)


def test_delete_meal_by_name():
    MEAL_NAME = "meal 6"
    meal_id = add_meal(MEAL_NAME, 1, 1, 1)
    response = connectionController.http_delete(f"meals/{MEAL_NAME}")
    assert_err_code(response, error_code=200)
    assert response.json() == meal_id
    assert_not_existed_meal(meal_id)


def test_delete_no_existed_meal_by_id():
    NOT_EXISTED_MEAL = 1231258142
    response = connectionController.http_delete(f"meals/{NOT_EXISTED_MEAL}")
    assert_err_code(response, error_code=404)
    assert_ret_value(response, returned_value=-5)


def test_delete_no_existed_meal_by_name():
    NOT_EXISTED_MEAL = "not existed meal 102948094"
    response = connectionController.http_delete(f"meals/{NOT_EXISTED_MEAL}")
    assert_err_code(response, error_code=404)
    assert_ret_value(response, returned_value=-5)


def test_delete_used_dish():
    ravioli_dish_id = add_dish("ravioli")
    soap_dish_id = add_dish("tomato")
    cake_dish_id = add_dish("brownies")
    meal_id = add_meal("ravioli meal", soap_dish_id, ravioli_dish_id, cake_dish_id)

    response = connectionController.http_delete(f"dishes/{ravioli_dish_id}")
    assert_err_code(response, error_code=200)

    meal = connectionController.http_get(f"meals/{meal_id}").json()
    assert meal["main"] is None
    assert meal["appetizer"] == soap_dish_id
    assert meal["dessert"] == cake_dish_id

