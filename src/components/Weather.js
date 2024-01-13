import { useState } from "react";
import { useWeather } from "../context/WeatherContext";
import { useTheme } from "../context/ThemeContext";

function Weather() {
  const [cityInput, setCityInput] = useState(""); // State to store user input

  const {
    cities,
    setCities,
    selected,
    setSelected,
    weathers,
    setWeathers,
    unit,
    setUnit,
  } = useWeather();

  const { theme, setTheme } = useTheme();

  const handleChange = (e) => {
    const newValue = e.target.value.split(",");
    setSelected({
      id: newValue[0],
      name: newValue[1],
      latitude: newValue[2],
      longitude: newValue[3],
      population: newValue[4],
      region: newValue[5],
    });
  };

  const handleSwitch = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  const handleCitySearch = async () => {
    try {
      const apiKey = "4327f11f6458df3e888e99c6b054069c";

      // Use a geocoding service to get coordinates based on the city name
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${apiKey}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];

        // Update the 'selected' state with the new city data
        setSelected({
          id: 0, // Set a default ID or any value you prefer
          name: cityInput,
          latitude: lat,
          longitude: lon,
          population: 0, // You might not have population data from geocoding
          region: "", // You might not have region data from geocoding
        });

        // Perform the API call with the new coordinates
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${apiKey}`
        );
        const weatherData = await weatherResponse.json();

        // Update the 'weathers' state with the new weather data
        setWeathers(weatherData);
      } else {
        // Handle case when no coordinates are found for the given city name
        console.error("No coordinates found for the given city name");
      }
    } catch (error) {
      // Handle any errors that occur during the fetch requests
      console.error("Error fetching data:", error);
    }
  };
  const createDate = (dt) => {
    const newDate = new Date(dt * 1000);
    return newDate.toDateString().slice(3);
  };

  const createDay = (dt, type) => {
    const day = new Date(dt * 1000);
    if (type === "long") {
      let options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return day.toLocaleString("en-us", options);
    } else {
      return day.toLocaleString("en-us", { weekday: "long" });
    }
  };

  const dt = weathers?.current?.dt;
  return (
    <>
      <aside>
        <div className={`aside ${theme}`}>
          <div className="aside-container">
            <div className="aside-header">
              <input
                type="text"
                placeholder="Enter city name"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
              />
              <button onClick={handleCitySearch}>Search</button>
            </div>
            <div className="aside-main">
              <h1>{selected.name}</h1>
              <h2>
                <span>{createDate(weathers?.current?.dt)}</span>
                <span>{createDay(dt)}</span>
              </h2>
              {weathers?.current?.weather?.[0].icon && (
                <img alt=""
                  src={`https://openweathermap.org/img/wn/${weathers?.current?.weather?.[0].icon}@2x.png`}
                />
              )}
              <span className="aside-degree">
                {Math.round(weathers?.current?.temp)}
                {unit === "metric" ? (
                  <span>&#8451;</span>
                ) : (
                  <span> &#8457; </span>
                )}
              </span>
              <div className="aside-main-item">
                <div>
                  Feels Like
                  <span className="material-symbols-rounded">
                    device_thermostat
                  </span>
                </div>
                <span>
                  {Math.round(weathers?.current?.feels_like)}
                  {unit === "metric" ? (
                    <span>&#8451;</span>
                  ) : (
                    <span> &#8457; </span>
                  )}
                </span>
              </div>
              <div className="aside-main-item">
                <div>
                  Day
                  <span className="material-symbols-rounded">light_mode</span>
                </div>
                <span>
                  {Math.round(weathers?.daily?.[0]?.temp?.day)}
                  {unit === "metric" ? (
                    <span>&#8451;</span>
                  ) : (
                    <span> &#8457; </span>
                  )}
                </span>
              </div>
              <div className="aside-main-item">
                <div>
                  Night
                  <span className="material-symbols-rounded">bedtime</span>
                </div>
                <span>
                  {Math.round(weathers?.daily?.[0]?.temp?.night)}
                  {unit === "metric" ? (
                    <span>&#8451;</span>
                  ) : (
                    <span> &#8457; </span>
                  )}
                </span>
              </div>
              <div className="aside-main-item">
                <div>
                  Humidity
                  <ion-icon name="water"></ion-icon>
                </div>
                <span>{weathers?.current?.humidity}%</span>
              </div>
              <div className="aside-main-item">
                <div>
                  Wind
                  <span className="material-symbols-rounded">air</span>
                </div>
                <span>{weathers?.current?.wind_speed}</span>
              </div>
            </div>
            <div className="aside-footer">
              <span
                className="mode"
                onClick={() => setTheme(theme === "Dark" ? "Light" : "Dark")}
              >
                {theme === "Dark" ? (
                  <ion-icon name="sunny"></ion-icon>
                ) : (
                  <ion-icon name="moon"></ion-icon>
                )}
              </span>
              <div className="unity">
                <div>C</div>
                <div>
                  <label className="switch">
                    <input type="checkbox" onChange={handleSwitch} />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div>F</div>
              </div>
              <a
                href="https://github.com/pintu44/weather_forecast_dashboard"
                target="_blank"
                className={`logo-github ${theme}`}
              >
                <ion-icon name="logo-github"></ion-icon>
              </a>
            </div>
          </div>
        </div>
      </aside>
      <section>
        <div className="section-container">
          {weathers?.daily?.map((dayily, i) => (
            <div key={i} className={`grid-item ${theme}`}>
              <div className="grid-item-header">{createDate(dayily?.dt)}</div>
              <div className="grid-item-container">
                <img alt=""
                  src={`https://openweathermap.org/img/wn/${dayily?.weather?.[0].icon}@2x.png`}
                />
                <span>{createDay(dayily?.dt)}</span>
                <span>{dayily?.weather?.[0]?.description}</span>
              </div>
              <div className="grid-item-footer">
                <div>
                  Min: {Math.round(dayily?.temp?.min)}
                  {unit === "metric" ? (
                    <span>&#8451;</span>
                  ) : (
                    <span> &#8457; </span>
                  )}
                </div>
                <div>
                  Max: {Math.round(dayily?.temp?.max)}
                  {unit === "metric" ? (
                    <span>&#8451;</span>
                  ) : (
                    <span> &#8457; </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Weather;
