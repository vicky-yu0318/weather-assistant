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

const IconContainer = styled.div`
  height: 110px;
  img {
    height: 100%;
    width: auto;
  }
`;

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

const WeatherIcon = ({ currentWeather, currentMoment }) => {
  const weatherIcon = useMemo(
    () =>
      _.get(weatherIcons, `${currentMoment}.${currentWeather}`, defaultWeather),
    [currentMoment, currentWeather]
  );
  return (
    <IconContainer>
      {weatherIcon && <Image src={weatherIcon} alt=""></Image>}
    </IconContainer>
  );
};

export default WeatherIcon;
