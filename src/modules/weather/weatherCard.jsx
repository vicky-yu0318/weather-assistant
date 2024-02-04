import WeatherIcon from "@/utils/weatherIcon";
import styled from "@emotion/styled";
import Image from "next/image";
import AirFlowIcon from "@/images/airFlow.svg";
import RainIcon from "@/images/rain.svg";
import RefreshIcon from "@/images/refresh.svg";
import LoadingIcon from "@/images/loading.svg";
import CogIcon from "@/images/cog.svg";
import { format, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";

const LoadingWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    animation: rotate ease-in infinite;
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  height: 350px;
  box-shadow: 0 1px 3px 0 #ccc;
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: content-box;
  padding: 30px 15px;
`;

// https://www.npmjs.com/package/@emotion/styled
const Location = styled.div`
  font-size: 28px;
  /* color: ${(props) => (props.theme === "dark" ? "#aaa" : "#faa")}; */
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  color: #828282;
`;

const WeatherElement = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  color: ${({ theme }) => theme.textColor};
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  margin-bottom: 10px;
  img {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  color: ${({ theme }) => theme.textColor};
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  img {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  display: flex;
  gap: 5px;
  justify-content: end;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.textColor};
  margin-top: 20px;
  img {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate ease-in infinite;
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

// CogIcon 不能直接拿來當 component 用，因此失效
// const Cog = styled(CogIcon)`
//   position: absolute;
//   top: 30px;
//   right: 15px;
//   width: 15px;
//   height: 15px;
//   cursor: pointer;
// `;

const Cog = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  img {
    width: 100%;
    height: auto;
  }
`;

export default function WeatherCard({
  currentMoment,
  setCurrentPage,
  weatherElement,
  fetchData,
  cityName,
}) {
  const {
    observationTime,
    description,
    temperature,
    windSpeed,
    humid,
    imageIcon,
    isLoading,
    rainPossibility,
    comfortability,
  } = weatherElement;

  if (isLoading) {
    return (
      <WeatherCardWrapper>
        <LoadingWrapper>
          <Image src={LoadingIcon} alt="" priority></Image>
        </LoadingWrapper>
      </WeatherCardWrapper>
    );
  }
  // ===================================================
  return (
    <WeatherCardWrapper>
      <Cog>
        <Image
          src={CogIcon}
          alt=""
          onClick={() => setCurrentPage("weatherSetting")}
        ></Image>
      </Cog>
      <Location>{cityName}</Location>
      <Description>{description}</Description>
      <Description style={{ fontSize: 12 }}>{comfortability}</Description>

      <WeatherElement>
        <Temperature>
          {_.isNumber(temperature) ? Math.round(temperature) : "-"}
          <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon
          currentWeather={imageIcon}
          currentMoment={currentMoment}
        ></WeatherIcon>
      </WeatherElement>

      <AirFlow>
        <Image src={AirFlowIcon} alt=""></Image>
        <div> {windSpeed} m/h</div>
      </AirFlow>
      <Rain>
        <Image src={RainIcon} alt=""></Image>
        <div> {rainPossibility} %</div>
      </Rain>

      <Refresh>
        <div>
          最後觀測時間：
          {observationTime !== "-"
            ? format(parseISO(observationTime), "M/d a HH:mm", { locale: zhTW })
            : "--"}
        </div>
        <Image
          src={isLoading ? LoadingIcon : RefreshIcon}
          alt=""
          onClick={fetchData}
        ></Image>
      </Refresh>
    </WeatherCardWrapper>
  );
}
