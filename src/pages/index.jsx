import _ from "lodash";
import { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
// import { css } from "@emotion/react";
import { format, getTime } from "date-fns";

import WeatherCard from "@/modules/weather/weatherCard";
import WeatherSetting from "@/modules/weather/WeatherSetting";
import useWeatherApi from "@/hooks/useWeatherApi";
import { findLocation } from "@/utils/availableLocations";

// STEP 1：定義主題配色
const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 將 CSS 樣式定義成 JavaScript 函式 ===================
// const buttonDefault = () => css`
//   display: block;
//   width: 120px;
//   height: 30px;
//   font-size: 14px;
//   background-color: transparent;
//   color: #212121;
// `;

// const RejectButton = styled.button`
//   ${buttonDefault}
//   background-color: red;
// `;
// ===================================================
// 客戶端使用 useState 函數
function useLocalStorage(key, defaultValue) {
  const isClient = typeof window !== "undefined";

  const [state, setState] = useState(() => {
    if (isClient) {
      // 客戶端環境中使用 localStorage
      const storageValue = localStorage.getItem(key);
      return storageValue !== null ? storageValue : defaultValue;
    } else {
      // 伺服器端或渲染階段的預設值
      return defaultValue;
    }
  });

  const setClientState = (value) => {
    setState(value);
    if (isClient) {
      localStorage.setItem(key, value);
    }
  };

  return [state, setClientState];
}

export default function Home() {
  // console.log("invoke Home function component");

  const [currentPage, setCurrentPage] = useState("weatherCard");
  // ===================================================
  const [currentCity2] = useLocalStorage("cityName", "臺北市"); // TODO: 使用自定義 hook（不用寫於 useEffect 內）, 不會有 undefined 狀況發生
  const [currentCity, setCurrentCity] = useState();
  // console.log("currentCity :>> ", currentCity);
  // console.log("currentCity2 :>> ", currentCity2);

  const currentLocationObj = useMemo(
    () => findLocation(currentCity) || {},
    [currentCity]
  );

  useEffect(() => {
    const storageCity = localStorage.getItem("cityName");
    setCurrentCity(storageCity || "臺北市"); // storageCity ? setCurrentCity(storageCity) : setCurrentCity("臺北市");
  }, [currentCity, currentCity2]);

  const [weatherElement, fetchData] = useWeatherApi(currentLocationObj); // 引入當下會跑 useEffect

  // ===================================================
  const [currentMoment, setCurrentMoment] = useState();
  const currentTheme = useMemo(
    () => (currentMoment === "night" ? "dark" : "light"),
    [currentMoment]
  );

  useEffect(() => {
    async function fetchData() {
      // TODO: 拿太陽日落日出時間
      const getMoment = (locationName) => {
        const currentDate = format(new Date(), "yyyy-MM-dd");
        const currentTimestamp = getTime(new Date());
        // fetch('https://opendata.cwa.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWA-A2BB0B75-6139-4F2B-9DC0-770ECC8F9C46&CountyName=%E6%96%B0%E5%8C%97%E5%B8%82&parameter=SunRiseTime,SunSetTime')
        return fetch(
          `https://opendata.cwa.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWA-A2BB0B75-6139-4F2B-9DC0-770ECC8F9C46&CountyName=${locationName}&Date=${currentDate}`
        )
          .then((response) => response.json())
          .then((data) => {
            const tempDate = _.get(
              data,
              "records.locations.location[0].time[0]",
              {}
            );
            // const tempDate =
            //   data?.records?.locations?.location[0]?.time[0] ?? {};
            const { SunRiseTime, SunSetTime } = tempDate;
            const sunRiseTimestamp = getTime(`${currentDate} ${SunRiseTime}`);
            const sunSetTimestamp = getTime(`${currentDate} ${SunSetTime}`);
            // const test = getTime(undefined);
            // console.log("test :>> ", test); // NaN

            const moment =
              currentTimestamp >= sunRiseTimestamp &&
              sunSetTimestamp > currentTimestamp
                ? "day"
                : "night";
            return moment;
          });
      };
      // console.log("currentLocationObj :>> ", currentLocationObj);
      // console.log("currentLocationObj2 :>> ", currentLocationObj2); // 不會有空物件的情況發生
      if (_.isEmpty(currentLocationObj)) return;
      const moment = await getMoment(currentLocationObj.cityName);
      setCurrentMoment(moment);
    }
    fetchData();
  }, [currentLocationObj]);

  return (
    <>
      <ThemeProvider theme={theme[currentTheme]}>
        <Container>
          {currentPage === "weatherCard" && (
            <WeatherCard
              cityName={currentLocationObj.cityName}
              currentMoment={currentMoment}
              setCurrentPage={setCurrentPage}
              weatherElement={weatherElement}
              fetchData={fetchData}
            />
          )}
          {currentPage === "weatherSetting" && (
            <WeatherSetting
              setCurrentPage={setCurrentPage}
              setCurrentCity={setCurrentCity}
              cityName={currentLocationObj.cityName}
            />
          )}
        </Container>
      </ThemeProvider>
    </>
  );
}
