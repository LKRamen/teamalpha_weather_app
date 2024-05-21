"""
Create a weather app
"""
import requests
import datetime
import sys

def main():
    weather_json = prompt_user()
    format_forecast(weather_json)
    reset()

def prompt_user() -> dict:
    city_name = input("Please enter a city:\n")
    state_name = input("Please enter this city's state:\n")
    try:
        geocode_json = requests.get("https://geocode.maps.co/search?city=" + city_name + "&state=" + state_name + "&api_key=664b7f0e168b8295284849yinb13482").json()
        longitude = geocode_json[0]['lon']
        latitude = geocode_json[0]['lat']
        weather_json = requests.get("http://api.weatherapi.com/v1/forecast.json?key=af49b45544a4460385c173117242005&q=" + latitude + "," + longitude + "&days=5").json()
        return weather_json
    except:
        print("Sorry the city or state named was invalid. Please try again.\n")
        main()

def format_forecast(weather_json: dict) -> str:
    forecast_year = [weather_dict['date'][0:4] for weather_dict in weather_json['forecast']['forecastday']]
    forecast_month = [weather_dict['date'][5:7] for weather_dict in weather_json['forecast']['forecastday']]
    forecast_day = [weather_dict['date'][8:10] for weather_dict in weather_json['forecast']['forecastday']]
    date_datetime = datetime.date(int(forecast_year[0]), int(forecast_month[0]), int(forecast_day[0]))
    day = date_datetime.strftime('%a')
    print(day)
    forecast_avgtemps = [str(weather_dict['day']['avgtemp_f']) for weather_dict in weather_json['forecast']['forecastday']]

def reset() -> None:
    reset_input = input("Would you like to search a different forecast? Enter 'y' for Yes, 'n' for No\n")
    if reset_input == 'y':
        main()
    elif reset_input == 'n':
        sys.exit("Thank you for using this forecast")
    else:
        print("Sorry that was an invalid answer\n")
        reset()

if __name__=='__main__':
    print("This is a Weather Forecast")
    main()