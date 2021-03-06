let weather = {
    apiKey: "fa7b439db822c60b3f95528568a70b0b", // I dont care that it's public.
    fetchWeather: function (city) {
        fetch(
                "https://api.openweathermap.org/data/2.5/weather?q=" +
                city +
                "&units=metric&appid=" +
                this.apiKey
            )
            .then((response) => {
                if (!response.ok) {
                    alert("Error! No weather found.");
                    throw new Error("Error! No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const {
            name
        } = data;
        const {
            icon,
            description
        } = data.weather[0];
        const {
            temp,
            humidity
        } = data.main;
        const {
            speed
        } = data.wind;
        document.querySelector(".city").innerText = "Todays weather in " + name;
        document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText =
            "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText =
            "Wind speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage =
            "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
        if (event.key == "Enter") {
            weather.search();
        }
    });

n = new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = "Current date: " + d + "/" + m + "/" + y;

// Get visitors current city
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        fetch( // Fetch the city name from the API
            "https://api.openweathermap.org/data/2.5/weather?lat=" +
            position.coords.latitude +
            "&lon=" +
            position.coords.longitude +
            "&units=metric&appid=" +
            weather.apiKey
        )
            .then((response) => {
                if (!response.ok) {
                    alert("Error! No weather found.");
                    throw new Error("Error! No weather found.");
                }
                return response.json();
            })
            .then((data) => {
                const { name } = data; 
                weather.fetchWeather(name);
            });
    });
} else {
    alert("Geolocation is not supported by this browser. Fetching weather from default location.");
    weather.fetchWeather("London");
}