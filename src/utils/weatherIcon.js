import { useMemo } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import MostlyCloudy from "@/images/mostly-cloud.svg";
import DaySunnyWithHaze from "@/images/day-sunny-haze.svg";
import DayCloudy from "@/images/day-cloudy.svg";
import Foggy from "@/images/foggy.svg";
import DayCloudyWidthRain from "@/images/day-cloudy-with-rain.svg";
import DayCloudyWithHaze from "@/images/day-cloudy-haze.svg";
import NightCloudyWidthRain from "@/images/night-cloudy-with-rain.svg";
import NightCloudyWithHaze from "@/images/night-cloudy-haze.svg";
import NightCloudy from "@/images/night-cloudy.svg";
import NightFog from "@/images/night-fog.svg";
import defaultWeather from "@/images/default-weather.png";
// import { useEffect } from "react";

const IconContainer = styled.div`
  height: 110px;
  img {
    height: 100%;
    width: auto;
  }
`;

// ["陰","陰有靄","有霧","陰有雨","-99","多雲","晴有靄","陰有靄","陰有霾"]
const weatherIcons = {
  day: {
    陰: DayCloudy,
    有霧: Foggy,
    陰有雨: DayCloudyWidthRain,
    多雲: MostlyCloudy,
    晴有靄: DaySunnyWithHaze,
    晴有霾: DaySunnyWithHaze,
    陰有靄: DayCloudyWithHaze,
    陰有霾: DayCloudyWithHaze,
  },
  night: {
    陰: NightCloudy,
    有霧: NightFog,
    陰有雨: NightCloudyWidthRain,
    多雲: MostlyCloudy,
    晴有靄: NightCloudyWithHaze,
    晴有霾: NightCloudyWithHaze,
    陰有靄: NightCloudyWithHaze,
    陰有霾: NightCloudyWithHaze,
  },
};

// 將中文 key 轉換英文方式：
// function translate(currentWeather) {
//   switch (currentWeather) {
//     case "陰有靄":
//       return "hihi";
//     default:
//       break;
//   }
// }

const WeatherIcon = ({ currentWeather, currentMoment }) => {
  // TODO: useMemo 的作用是在依賴的值發生變化時，才重新計算和返回新的值。這對於避免在每次渲染時都重新計算 iconImg 的值是很有用的，尤其是當 currentWeather 或 currentMoment 的值變化時。
  const iconImg = useMemo(
    () =>
      _.get(weatherIcons, `${currentMoment}.${currentWeather}`, defaultWeather),
    [currentMoment, currentWeather]
  );
  return (
    <>
      <IconContainer>
        <Image src={iconImg} alt="" priority as="image"></Image>
      </IconContainer>
    </>
  );
};

export default WeatherIcon;
