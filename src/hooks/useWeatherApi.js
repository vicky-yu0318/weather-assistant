import { useState, useCallback, useEffect } from "react";
import _ from "lodash";

// TODO: 拿預測天氣資料
const fetchWeatherForecast = (cityName) => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${process.env.NEXT_PUBLIC_API_KEY}&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = _.get(
        data,
        "records.location[0].weatherElement",
        []
      );

      const temp = locationData.reduce((acc, curr) => {
        if (["Wx", "PoP", "CI"].includes(curr.elementName)) {
          acc[curr.elementName] = curr?.time[0]?.parameter?.parameterName;
          // console.log("acc :>> ", acc); // {Wx: '陰有雨', PoP: '80', CI: '非常寒冷'}
        }
        return acc;
      }, {});

      return {
        // ...(temp.Wx && {
        //   description: temp.Wx,
        // }),
        description: temp.Wx || "-", //temp.Wx, //天氣現象
        rainPossibility: temp.PoP || "-", // 降雨機率 %
        comfortability: temp.CI || "-", // 舒適度
      };
      // setWeatherElement((preveState) => ({
      //   ...preveState,
      //   description: weatherElements.Wx,
      //   rainPossibility: weatherElements.PoP,
      //   comfortability: weatherElements.CI,
      // }));
    });
};

// TODO: 拿目前天氣資料
const fetchCurrentElement = (locationName) => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${process.env.NEXT_PUBLIC_API_KEY}&StationName=${locationName}`
    // "https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWA-A2BB0B75-6139-4F2B-9DC0-770ECC8F9C46"
    // &StationId=466883
  )
    .then((response) => response.json())
    .then((data) => {
      // TODO: 方法1: api 可先選所有地區，確認會回傳什麼樣的天氣型態
      // const uniqueType = [
      //   ...new Set(
      //     data.records.Station.map((item) => {
      //       return item.WeatherElement.Weather;
      //     })
      //   ),
      // ];
      // console.log("uniqueType :>> ", JSON.stringify(uniqueType));

      // TODO: 方法2: api 可先選所有地區，確認會回傳什麼樣的天氣型態
      // const temp = data.records.Station.reduce((acc, curr) => {
      //   if (!acc.includes(curr.WeatherElement.Weather)) {
      //     acc.push(curr.WeatherElement.Weather);
      //   }
      //   return acc;
      // }, []);
      // console.log("所有的 Weather :>> ", temp); //  ['陰', '有霧', '多雲', '晴', '陰有雨', '-99', '陰有霾', '多雲有靄', '多雲有霾', '陰有靄', '晴有靄', '晴有霾']
      const locationData = _.get(data, "records.Station[0]", {});
      // if (_.isEmpty(locationData)) return;  // X：因必須 return 回 fetchData func
      return {
        observationTime: locationData.ObsTime?.DateTime || "-", // or can use _.get
        locationName: locationData.StationName || "-",
        imageIcon: locationData.WeatherElement?.Weather || "-",
        temperature: locationData.WeatherElement?.AirTemperature || "-",
        windSpeed: locationData.WeatherElement?.WindSpeed || "-",
        humid: locationData.WeatherElement?.RelativeHumidity || "-",
      };
      // setWeatherElement((preveState) => ({
      //   ...preveState,
      //   observationTime: locationData.ObsTime.DateTime,
      //   locationName: locationData.StationName,
      //   description: locationData.WeatherElement.Weather,
      //   temperature: locationData.WeatherElement.AirTemperature,
      //   windSpeed: locationData.WeatherElement.WindSpeed,
      //   humid: locationData.WeatherElement.RelativeHumidity,
      // }));
    });
};

export default function useWeatherApi(currentLocationObj) {
  // console.log("currentLocationObj :>> ", currentLocationObj); // 一開始 undefined
  const [weatherElement, setWeatherElement] = useState({
    observationTime: null, //"2019-10-02 22:10:00", //"2024-01-22T20:50:00+08:00",  // ObsTime.DateTime
    locationName: "", // StationName
    description: "", // WeatherElement.Weather
    imageIcon: "",
    temperature: null, // WeatherElement.AirTemperature
    windSpeed: null, // WeatherElement.WindSpeed
    humid: null, // WeatherElement.RelativeHumidity
    isLoading: true,
  });

  const { locationName, cityName } = currentLocationObj;
  // ===================================================
  // useCallback =>
  // 幫我們把這個函式保存下來，讓它不會隨著每次組件重新執行後，因為作用域不同而得到兩個不同的函式。
  // TODO 版本 1:
  // 優點： 直接將非同步函數傳遞給 useCallback，程式碼簡潔。
  // 缺點： 如果非同步操作中出現錯誤，可能不容易追蹤到 useCallback 的錯誤訊息，因為它是非同步的。
  const fetchData = useCallback(async () => {
    setWeatherElement((preState) => ({
      ...preState,
      isLoading: true,
    }));
    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentElement(locationName),
      fetchWeatherForecast(cityName),
    ]);
    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });

    // console.log("WeatherElement :>> ", weatherElement); // 顯示預設 null, 因 setState 是異步的，這意味著它不會 "立即" 改變狀態值
  }, [cityName, locationName]); // 如 fetchingData 沒有相依到 React 組件中的資料狀態， dependencies 陣列中不帶入元素

  // TODO 版本 2:
  // 優點： 在內部函數 aa 中可以更容易處理非同步操作中的錯誤，更好地處理錯誤訊息。
  // 缺點： 在 useCallback 中創建了額外的函數，可能稍微增加了程式碼複雜性，但這通常是微不足道的。
  // const fetchData2 = useCallback(() => {
  //   const aa = async () => {
  //     const [currentWeather, weatherForecast] = await Promise.all([
  //       fetchCurrentElement(),
  //       fetchWeatherForecast(),
  //     ]);
  //     setWeatherElement({
  //       ...currentWeather,
  //       ...weatherForecast,
  //     });
  //   };
  //   aa();
  // }, []);
  // ===================================================

  useEffect(() => {
    if (_.isEmpty(currentLocationObj)) return; // 以防止 api 打失敗
    // console.log("currentLocationObj :>> ", currentLocationObj);
    // console.log("!!!!execute function in useEffect");
    fetchData();
  }, [currentLocationObj, fetchData]); // 組件渲染完後，如果 dependencies 有改變，才會呼叫 useEffect 內的 function

  return [weatherElement, fetchData];
}
