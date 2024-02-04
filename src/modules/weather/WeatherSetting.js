import styled from "@emotion/styled";
import { useState, useRef } from "react";
import { availableLocations } from "@/utils/availableLocations";

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledInputList = styled.input`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;

  /* 修改 datalist 下拉箭頭樣式 */
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    /* display: none; 無效*/
    opacity: ${({ isOpacity }) => (isOpacity ? 0 : 1)};
    display: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

// 在 styled-components 中，&& 是用來增加特定性（specificity）的 CSS 選擇器的一種技巧。
// 優先順序更高，不容易被其他樣式覆蓋。 -> 為了蓋過上方 > button css 樣式
const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

// 可以選擇地區的清單
const locations = availableLocations.map((location) => location.cityName);

const WeatherSetting = ({ setCurrentPage, setCurrentCity, cityName }) => {
  // 把可以修改天氣地區的方法 (setCurrentCity) 透過 props 傳到 WeatherSetting 組件中，讓該組件可以修改 首頁 Home 內當前地區的資料
  const [locationName, setLocationName] = useState(cityName);

  const handleChange = (e) => {
    setLocationName(e.target.value);
  };

  // TODO 法1: Controlled
  const handleSave = () => {
    if (locations.includes(locationName)) {
      // console.log(`儲存的地區資訊為：${locationName}`);
      setCurrentCity(locationName);
      localStorage.setItem("cityName", locationName);
      setCurrentPage("weatherCard");
    } else {
      alert(`儲存失敗：您輸入的 ${locationName} 並非有效的地區`);
      return;
    }
  };

  // TODO 法2: Uncontrolled
  // 當我們在 React 組件中想要定義一些「變數」，但當這些變數改變時，又不需要像 state 一樣會重新 "導致畫面渲染" 的話，就很適合使用 useRef。
  // const inputLocationRef = useRef(null);

  //   const handleSave = () => {
  //     const locationName = inputLocationRef.current.value;
  //     console.log(`儲存的地區資訊為：${locationName}`); // 「當 input 欄位內的資料有變動時，並不像 Controlled Component 一樣會促發畫面重新渲染」
  //   };

  const handleDelete = () => {
    setLocationName("");
  };

  // TODO: 檢測畫面總共渲染幾次的方式 （ref 可定義不會導致畫面重新渲染的變數）
  const renderCount = useRef(0);

  return (
    <WeatherSettingWrapper>
      {/* {console.log("render")} */}
      {/* STEP 1：每次畫面渲染時就將 renderCount.current + 1 */}
      {/* {(renderCount.current += 1)} */}
      {/* STEP 2：顯示這是該組件第幾次重新渲染 */}
      {/* {console.log("render", renderCount.current)} */}
      <Title>設定</Title>
      <StyledLabel htmlFor="location">地區</StyledLabel>
      {/* datalist -> 使用者不只可以從下拉選單去做選擇，還可以在這個 <input> 裡面輸入文字進行搜尋 */}
      <div style={{ position: "relative" }}>
        <StyledInputList
          isOpacity={locationName}
          list="location-list"
          id="location"
          name="location"
          // ref={inputLocationRef} // Uncontrolled 方式
          // defaultValue="臺南市"
          onChange={handleChange}
          value={locationName}
        />
        <div
          onClick={handleDelete}
          style={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            right: 15,
            bottom: 0,
            top: 0,
          }}
        >
          {locationName && (
            <span style={{ fontSize: "12px", cursor: "pointer" }}>X</span>
          )}
        </div>
      </div>
      <datalist id="location-list">
        {locations.map((location) => (
          <option value={location} key={location} />
        ))}
      </datalist>
      <ButtonGroup>
        <Back onClick={() => setCurrentPage("weatherCard")}>返回</Back>
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
};

export default WeatherSetting;
