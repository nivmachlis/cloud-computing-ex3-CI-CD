import requests

with open("query.txt", "r") as query_file:
    query_lines = [line.rstrip("\n") for line in query_file]

response_lines = []
for dish in query_lines:
    try:
        response_post = requests.post("http://localhost:8000/dishes", json={"name": dish},headers={"Content-Type": "application/json"})
        if response_post.status_code == 201:
            response_get = requests.get(f"http://localhost:8000/dishes/{dish}",headers={"Content-Type": "application/json"})
            if response_get.status_code == 200:
                data = response_get.json()
                calories = data["cal"]
                sodium = data["sodium"]
                sugar = data["sugar"]
                
                response_lines.append(f"{dish} contains {calories} calories, {sodium} mgs of sodium, and {sugar} grams of sugar")
            else:
                raise Exception()
        else:
            raise Exception()        
    except:
        response_lines.append(f"Error: Failed to retrieve data for {dish}")
        

with open("response.txt", "w") as response_file:
    response_file.write("\n".join(response_lines))


