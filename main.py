"""
Create a weather app
"""
import requests
import json

def main():
    print("Weather Forecast")
    city_name = input("Please enter a city:\n")
    state_name = input("Please enter this city's state:\n")
    geocode_json = requests.get("https://geocode.maps.co/search?city=" + city_name + "&state=" + state_name + "&api_key=664b7f0e168b8295284849yinb13482").json()
    longitude = geocode_json[0]['lon']
    latitude = geocode_json[0]['lat']
    weather_json = requests.get("http://api.weatherapi.com/v1/forecast.json?key=af49b45544a4460385c173117242005&q=" + latitude + "," + longitude + "&days=5").json()
    forecast_dates = [str(weather_dict['date']) for weather_dict in weather_json['forecast']['forecastday']]
    forecast_avgtemps = [str(weather_dict['day']['avgtemp_f'] for weather_dict in weather_json['forecast']['forecastday']
    #with open("weather_output.json", "w") as output_file:
    #    json.dump(weather_json, output_file, indent=6)
    #    print(output_file)
def get_forecast():
    print("Weather Forecast")
    city_name = input("Please enter a city:\n")
    state_name = input("Please enter this city's state:\n")
    geocode_json = requests.get(
        "https://geocode.maps.co/search?city=" + city_name + "&state=" + state_name + "&api_key=664b7f0e168b8295284849yinb13482").json()
    longitude = geocode_json[0]['lon']
    latitude = geocode_json[0]['lat']
    weather_json = requests.get("http://api.weatherapi.com/v1/forecast.json?key=af49b45544a4460385c173117242005&q=" + latitude + "," + longitude + "&days=5").json()
    return

if __name__=="__main__":
    main()