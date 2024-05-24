"""
Create a weather app
"""
import requests
import datetime
import sys

def main():
    weather_json = prompt_user()
    todays_forecast(weather_json)
    forecast(weather_json)
    reset()

def prompt_user() -> dict:
    """Prompts the user to input a city and state. Then using a geocoding api, finds the longitude and latitude of that city.
    Finally it inputs that position into a forecast API which outputs all the forecast info necessary. If an invalid city is
    input, it will reprompt the user.
    :return:
    """
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

class forecast():
    def __init__(self, weather_json: dict) -> str:
        self.weather_json = weather_json
        day_of_week = self.return_day_of_week(weather_json, 0)

        forecast_avgtemps = [str(weather_dict['day']['avgtemp_f']) for weather_dict in
                             weather_json['forecast']['forecastday']]

    def return_day_of_week(self, weather_json: dict, day_num: int) -> str:
        forecast_year = [weather_dict['date'][0:4] for weather_dict in weather_json['forecast']['forecastday']]
        forecast_month = [weather_dict['date'][5:7] for weather_dict in weather_json['forecast']['forecastday']]
        forecast_day = [weather_dict['date'][8:10] for weather_dict in weather_json['forecast']['forecastday']]
        date_datetime = datetime.date(int(forecast_year[day_num]), int(forecast_month[day_num]), int(forecast_day[day_num]))
        day = date_datetime.strftime('%A')
        return day

class todays_forecast(forecast):
    def __init__(self, weather_json: dict):
        self.weather_json = weather_json
        print("Today's Forecast:")
        avg_temp = str(weather_json['forecast']['forecastday'][0]['day']['avgtemp_f'])
        max_temp = str(weather_json['forecast']['forecastday'][0]['day']['maxtemp_f'])
        min_temp = str(weather_json['forecast']['forecastday'][0]['day']['mintemp_f'])
        max_wind_speed = str(weather_json['forecast']['forecastday'][0]['day']['maxwind_mph'])
        chance_of_rain = str(weather_json['forecast']['forecastday'][0]['day']['daily_chance_of_rain'])
        chance_of_snow = str(weather_json['forecast']['forecastday'][0]['day']['daily_chance_of_snow'])
        condition = str(weather_json['forecast']['forecastday'][0]['day']['condition']['text'])
        sunrise_time = str(weather_json['forecast']['forecastday'][0]['astro']['sunrise'])
        sunset_time = str(weather_json['forecast']['forecastday'][0]['astro']['sunset'])

        print(f"""
        Temperature: {avg_temp}°F(Lows of {min_temp}°F and Highs of {max_temp}°F)
        Conditions: {condition}
        Chance of Rain: {chance_of_rain}%
        Chance of Snow: {chance_of_snow}%
        Max Wind Speed: {max_wind_speed} mph
        Sunrise: {sunrise_time}
        Sunset: {sunset_time}
        """)

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