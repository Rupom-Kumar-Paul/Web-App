const apikey = "628f1a965610350c7d904d33e47063b8";
const apiUrl = "https://localhost/prototype2/connection.php?q=";

const searchBox = document.getElementById("city");
const searchBtn = document.querySelector(".search-button");
const weatherIcon = document.getElementById("weathericon");


async function checkweather(city) {
    // Check if data exists in local storage
    const cachedData = localStorage.getItem(city.toLowerCase());
    if (cachedData){
        console.log("Loading from local storage...");
        displayweatherData(JSON.parse(cachedData));
        return;
    }

    try{
        const response = await fetch(apiUrl + encodeURIComponent(city),{
            method: "GET",
            mode: "cors",
            headers: {
                "Accept": "application/json"
            }

        });

        if(!response.ok){
            document.querySelector(".weather-output").style.display = "none";
            alert("Error fetching weather data: " + response.statusText);
            return;
        }

        const data = await response.json();
        console.log("Fetched Data:",data);

        if(data.error) {
            alert("Error: " + data.error);
            return;
        }

        // save to local storage
        localStorage.setItem(city.toLowerCase(), JSON.stringify(data));

        // Display the fetched data
        displayweatherData(data);
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Something went wrong while fetching weather data.");

    }

    }



    function displayweatherData(weatherData) {
        document.getElementById("city-name").innerHTML = weatherData.city;

        document.getElementById("temperature").innerHTML = Math.round(weatherData.temperature) + "C";

        document.getElementById("Hvalue").innerHTML = weatherData.humidity + "%";

        document.getElementById("Wvalue").innerHTML = weatherData.wind-speed + "km/h";

        document.getElementById("Pvalue").innerHTML = weatherData.pressure + "hpa";

        document.getElementById("Cvalue").innerHTML = weatherData.clouds + "%";


        const now = new Date();
        document.getElementById("date").innerHTML = now.toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month:'long', day:'numeric', hour:'2-digit', minute: '2-digit'
        });

        weatherIcon.innerHTML = '<img src="http://openweathermap.org/img/wn/${weatherData.icon}@2x.png" alt= "${weatherData.descriptions}">';

        document.querySelector(".weather-output").style.display = 'block';
    }

    // Load last searched city on page
    window.onload = function() {
        const lastsearchedcity = this.localStorage.getItem("lastcity");
        if (lastsearchedcity) {
            checkweather(lastsearchedcity);
        }
    };


    searchBtn.addEventListener("click", () => {
        const city = searchBox.ariaValueMax.trim();
        if (city) {
            localStorage.setItem("lastcity", city.toLocaleLowerCase());
            checkweather(city);
        } else {
            alert("please enter a city name.");
        }
    })
    
