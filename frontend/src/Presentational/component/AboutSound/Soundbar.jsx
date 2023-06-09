import React, { memo, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { GlobalStyle } from "../../../action/GlobalStyle";

const Soundbar = (props) => {
  const { onChange, percentage, timeline, duration } = props;
  const [style, setStyle] = useState({
    position: 0, //Thumb 위치 지정
    marginLeft: 0, //Thumb 좌측 margin 설정
    progressBarWidth: 0, //재생 시 바의 길이 조정
  });

  const [timeStamp, setTimeStamp] = useState([]);

  const rangeRef = useRef();
  const thumbRef = useRef();
  const prograssbarRef = useRef();

  useEffect(() => {
    //파일 전체 길이가 0이 아니면
    if (duration !== 0) {
      //현재 너비를 통해 진행된 상태, 재생 길이, Thumb 위치 등을 반환함
      const rangeWidth = rangeRef.current.getBoundingClientRect().width; //현재 너비를 가져옴
      const thumbWidth = 20;
      const centerThumb = (thumbWidth / 100) * percentage * -1;
      const centerProgressBar =
        thumbWidth +
        (rangeWidth / 100) * percentage -
        (thumbWidth / 100) * percentage;

      setStyle(() => {
        return {
          position: percentage,
          marginLeft: centerThumb,
          progressBarWidth: centerProgressBar,
        };
      });

      //각 타임스탬프 위치 set
      setTimeStamp(() => {
        return timeline.map((el) => {
          const thisTime = parseFloat(el.secondTime);
          return (thisTime / duration) * rangeWidth;
        });
      });
    }
  }, [props]);

  return (
    <SliderContainer>
      <GlobalStyle />
      {timeStamp !== {} ? (
        <>
          {/* 재생되고 있을 때 보이는 바 */}
          <ProgressBar ref={prograssbarRef} width={style.progressBarWidth}>
            {timeStamp.map((el, idx) => {
              return <TimeStampBox key={idx} timeStampMargin={el} />;
            })}
          </ProgressBar>

          {/* 조절하는 컴포넌트 */}
          <Thumb
            position={style.position}
            ref={thumbRef}
            marginLeft={style.marginLeft}
          />

          {/* 백그라운드 바 */}
          <Range
            type={"range"}
            ref={rangeRef}
            step={"0.01"}
            onChange={onChange}
            value={style.position}
          />
        </>
      ) : null}
    </SliderContainer>
  );
};

export default memo(Soundbar);

const TimeStampBox = styled.div`
  position: absolute;
  height: 0.5rem;
  width: 5px;
  background-color: var(--primary-light);
  margin-left: ${(props) => props.timeStampMargin}px;
  display: inline-block;
`;

const Range = styled.input`
  -webkit-appearance: none;
  background-color: rgba(8, 80, 214, 0.644);
  height: 10px;
  width: 100%;
  cursor: pointer;
  opacity: 0;
  margin: 0 auto;
`;

const Thumb = styled.div`
  width: var(--thumb-width);
  height: var(--thumb-height);
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.753);
  z-index: 3;
  background: var(--white);
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: ${(props) => props.position}%;
  transform: translate(0%, -50%);
  pointer-events: none;
  user-select: none;
  margin-left: ${(props) => props.marginLeft}px;
  box-shadow: 0px 0.1rem 0.3rem 0px var(--greyLight-3);
`;

const ProgressBar = styled.div`
  background: var(--primary);
  background: linear-gradient(
    -1deg,
    var(--primary-dark) 0%,
    var(--primary) 50%,
    var(--primary-light) 100%
  );
  width: ${(props) => props.width}px;
  height: 0.5rem;
  display: block;
  position: absolute;
  border-radius: 10px;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2),
    -0.2rem -0.2rem 0.5rem var(--white);
  z-index: 1;
  user-select: none;
  pointer-events: none;
`;

const SliderContainer = styled.div`
  --progress-bar-height: 5px;
  --thumb-width: 20px;
  --thumb-height: 20px;

  position: relative;
  width: 100%;

  &::before {
    content: "";
    box-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2),
      inset -0.2rem -0.2rem 0.5rem var(--white);
    background-color: var(--greyLight-2);
    width: 100%;
    height: 0.5rem;
    display: block;
    position: absolute;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    opacity: 1;
  }
`;
