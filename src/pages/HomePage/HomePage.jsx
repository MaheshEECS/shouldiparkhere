import React from "react";
import { useState, useEffect, useRef } from "react";
import "./HomePage.css";
import { IoSearchCircle } from "react-icons/io5";
import Result from "../../components/Result";
import Loading from "../../components/Loading";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

let incidentsNum;
const center = { lat: 37.75706947363287, lng: -122.44369916441754 };

const HomePage = () => {
  const [address, setAddress] = useState("");
  const [riskLevel, setRiskLevel] = useState(0);
  const [riskDescription, setRiskDescription] = useState("SAFE");
  const [riskColor, setRiskColor] = useState("");
  const [loading, setLoading] = useState(false);

  const autoCompleteRef = useRef();
  const inputRef = useRef();

  const options = {
    componentRestrictions: { country: "us" },
    fields: ["ALL"],
    bounds: {
      north: center.lat + 0.05,
      south: center.lat - 0.05,
      east: center.lng + 0.05,
      west: center.lng - 0.05,
    },
    strictBounds: true,
  };

  const handleSubmit = async (coords) => {
    setLoading(true);
    await getRiskInformation(coords);
    setLoading(false);
  };

  const getRiskInformation = async (coords) => {
    const url = "https://data.sfgov.org/resource/wg3w-h783.json";
    const incident_subcategory = "incident_subcategory=Larceny - From Vehicle";
    const SoQL = `$where=incident_date between '2023-05-25' and '2023-07-25' and within_circle(point, ${coords.lat}, ${coords.lng}, 320)`;
    const constrainedUrl = url + "?" + incident_subcategory + "&" + SoQL;
    const response = await fetch(constrainedUrl, {
      method: "GET",
      headers: {
        "X-App-Token": "5N4Z3ws1tNxbolG5KLKrxRobI",
      },
    });
    const incidents = await response.json();
    incidentsNum = incidents.length;
    console.log(incidentsNum);
    await getRiskLevel(incidentsNum);
  };

  const getRiskLevel = async (incidentsNum) => {
    switch (true) {
      case incidentsNum >= 100: //100-200 is severse
        setRiskLevel(5);
        setRiskDescription("SEVERE");
        setRiskColor("#FF0D0D");
        break;
      case incidentsNum >= 50: //50-99 is high
        setRiskLevel(4);
        setRiskDescription("HIGH");
        setRiskColor("#FF4E11");
        break;
      case incidentsNum >= 25: //25-49 is medium
        setRiskLevel(3);
        setRiskDescription("MEDIUM");
        setRiskColor("#FF8E15");
        break;
      case incidentsNum >= 5: //5-24 is light
        setRiskLevel(2);
        setRiskDescription("LIGHT");
        setRiskColor("#FAB733");
        break;
      default: //0-4 is safe
        setRiskLevel(1);
        setRiskDescription("SAFE");
        setRiskColor("#69B34C");
        break;
    }
  };

  //try searching up Painted Ladies

  useEffect(() => {

    // if (address.length === 0)
    // {
    //   setRiskLevel(0)
    //   console.log("address")
    // }

    document.title = 'Should I Park Here?';

    try {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      autoCompleteRef.current.addListener("place_changed", async () => {
        const place = await autoCompleteRef.current.getPlace();
        if (place) {
          const viewport = place.geometry.viewport;
          console.log(viewport);
          const midpointLat = (viewport.Va.hi + viewport.Va.lo) / 2;
          const midpointLng = (viewport.Ja.hi + viewport.Ja.lo) / 2;
          const coords = { lat: midpointLat, lng: midpointLng };

          setAddress(place.formatted_address);
          await handleSubmit(coords);
        }
      });
    } catch {
      console.log("failed...");
    }

    const searchbar = document.querySelector(".search-bar");
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    };
    searchbar.addEventListener("keydown", keyDownHandler);

    return () => {
      searchbar.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <>
      <section id="homepage">
        <div className="container">
          <div className="row">
            <div className="card">
              <h1 className="title">shouldiparkhere?</h1>
              <p className="text">
                View the risk level of parking in any location in San
                Francisco!
              </p>
              <form onSubmit={(e) => console.log("submitted")}>
                <div className="search-wrapper">
                  <input
                    ref={inputRef}
                    className="search-bar text"
                    type="text"
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Search an address..."
                    value={address}
                  />
                  {/* <IoSearchCircle  className="search-icon" /> */}
                </div>
              </form>

              <div className="results">
                {loading ? (
                  <Loading />
                ) : riskLevel === 0 ? (
                  <>
                    <p className="text">Our data is ethically sourced from <a target="_blank" href="https://data.sfgov.org/Public-Safety/Police-Department-Incident-Reports-2018-to-Present/wg3w-h783">San Francisco Police Department's dataset</a>. Using this data, we request all car-related thefts in a 4-block radius of your location in the last 60 days. Based on the number of incidents, we calculate the risk score for parking in that area.</p>
                  </>
                ) : (
                  <Result
                    riskLevel={riskLevel}
                    riskDescription={riskDescription}
                    riskColor={riskColor}
                    incidentsNum={incidentsNum}
                  />
                )}
              </div>
            </div>
            <div className="credit">
              <p className="text">Made by S.M.A.S.H at Berkeley</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
