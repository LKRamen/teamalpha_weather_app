"""
main.py

Usage: main.py

Creates a weather forecast where a user can input a city and state and it returns the weather forecast.
"""
import requests
import datetime
import sys

def main():
    weather_json = initial_user_prompt()
    todays_forecast(weather_json)
    five_day_bool = prompt_user("see the five day forecast")
    if five_day_bool:
        forecast(weather_json)
    reset_bool = prompt_user("search a different forecast")
    if reset_bool:
        main()

def initial_user_prompt() -> dict:
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
        weather_json = requests.get("http://api.weatherapi.com/v1/forecast.json?key=af49b45544a4460385c173117242005&q=" + latitude + "," + longitude + "&days=6").json()
        return weather_json
    except:
        print("Sorry the city or state named was invalid. Please try again.\n")
        main()

def prompt_user(input_text: str) -> bool:
    """ Prompts the user to ask if they want to continue, so they don't get overloaded with all the info being dumped.
    :param input_text: The name of the information the user may want to see.
    :return:
    """
    reset_input = input("Would you like to " + input_text + "? Enter 'y' for Yes, 'n' for No\n")
    if reset_input == 'y':
        return True
    elif reset_input == 'n':
        sys.exit("Thank you for using this forecast")
    else:
        print("Sorry that was an invalid answer\n")
        prompt_user(input_text)

class forecast():
    def __init__(self, weather_json: dict) -> None:
        self.weather_json = weather_json
        print("This is the forecast for the next 5 days:")
        for x in range(5):
            i = x+1
            day = self.return_day_of_week(weather_json, i)
            avg_temp = str(weather_json['forecast']['forecastday'][i]['day']['avgtemp_f'])
            max_temp = str(weather_json['forecast']['forecastday'][i]['day']['maxtemp_f'])
            min_temp = str(weather_json['forecast']['forecastday'][i]['day']['mintemp_f'])
            chance_of_rain = str(weather_json['forecast']['forecastday'][i]['day']['daily_chance_of_rain'])
            chance_of_snow = str(weather_json['forecast']['forecastday'][i]['day']['daily_chance_of_snow'])
            condition = str(weather_json['forecast']['forecastday'][i]['day']['condition']['text'])
            print(f"""
{day}'s Forecast:
        Average Temperature: {avg_temp}°F(Lows of {min_temp}°F and Highs of {max_temp}°F)
        Conditions: {condition}
        Chance of Rain: {chance_of_rain}%
        Chance of Snow: {chance_of_snow}%""")



    def return_day_of_week(self, weather_json: dict, day_num: int) -> str:
        """ Returns the name of the day of the week.
        :param weather_json: API's json file with weather data
        :param day_num: The day of the week, in relation to the five days being tracked
        :return:
        """
        forecast_year = [weather_dict['date'][0:4] for weather_dict in weather_json['forecast']['forecastday']]
        forecast_month = [weather_dict['date'][5:7] for weather_dict in weather_json['forecast']['forecastday']]
        forecast_day = [weather_dict['date'][8:10] for weather_dict in weather_json['forecast']['forecastday']]
        date_datetime = datetime.date(int(forecast_year[day_num]), int(forecast_month[day_num]), int(forecast_day[day_num]))
        day = date_datetime.strftime('%A')
        return day

class todays_forecast(forecast):
    def __init__(self, weather_json: dict) -> None:
        """Takes the data from the weather API's json file, formats, and prints the forecast for the day.
        :param weather_json: API json file with weather data
        """
        self.weather_json = weather_json
        print("Today's Forecast:")
        current_temp = str(weather_json['current']['temp_f'])
        current_condition = str(weather_json['current']['condition']['text'])
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
        Current Temperature: {current_temp}°F
        Current Conditions: {current_condition}
        
        Today's Average Temperature: {avg_temp}°F(Lows of {min_temp}°F and Highs of {max_temp}°F)
        Conditions: {condition}
        Chance of Rain: {chance_of_rain}%
        Chance of Snow: {chance_of_snow}%
        Max Wind Speed: {max_wind_speed} mph
        Sunrise: {sunrise_time}
        Sunset: {sunset_time}
        """)

if __name__=='__main__':
    print("This is a Weather Forecast")
    main()