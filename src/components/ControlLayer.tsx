import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PlayIcon from '../image/icons/play-40.png';
import PauseIcon from '../image/icons/pause-40.png';
import AudioIcon from '../image/icons/audio-40.png';
import MuteIcon from '../image/icons/mute-40.png';

import VIInner from '../image/viewIndicatorInner.png';
import VIOuter from '../image/viewIndicatorOuter.png';
import { IExpanseControls } from './Player';

interface ControlPanelProps {
  top?: String;
  right?: String;
  bottom?: String;
  left?: String;
  direction?: 'row' | 'column'
}

const ControlPanel = styled.div<ControlPanelProps>`
  position: absolute;
  border-radius: 0.5rem;
  background: #00000033;
  box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.15);

  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  overflow: hidden;
  backdrop-filter: blur(10px);
  flex-direction: ${props => props.direction ? props.direction : 'row'};

  ${props => props.top ? 'top: '+props.top+';' : ''}
  ${props => props.right ? 'right: '+props.right+';' : ''}
  ${props => props.bottom ? 'bottom: '+props.bottom+';' : ''}
  ${props => props.left ? 'top: '+props.left+';' : ''}
`

const ControlButton = styled.div`
  width: 24px;
  height: 24px;
  padding: 1rem;

  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  text-align: center;

  transition: all 111ms;

  user-select: none;

  &:hover {
    background: #FFFFFF88;
  }

  & img {
    transition: all 111ms;
  }

  &:hover img {
    transform: scale(1.1);
  }
`

const ViewIndicatorContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 60px;
  height: 60px;

  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;

  opacity: 0.25;
  transition: all 222ms;

  &:hover {
    opacity: 1;
  }
`

interface IViewIndicatorPart {
  angle?: number;
}

const ViewIndicatorPart = styled.img<IViewIndicatorPart>`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

const ControlLayer = (props: {
  controls?: IExpanseControls;
  playing: Boolean;
  mute: Boolean;
  toggleMute: Function;
  togglePlaying: Function;
  lang?: any;
}) => {

  const handleMute = () => props.toggleMute(!props.mute);
  const handlePause = () => props.togglePlaying(!props.playing);

  return (
    <>
      {/* View Indicator */}
      <ViewIndicatorContainer
        style={(props.controls?.radialGuide) ? {} : {display: 'none'}}
      >
        <ViewIndicatorPart src={VIOuter} />
        <ViewIndicatorPart src={VIInner} id='view_indicator_inner' />
      </ViewIndicatorContainer>

      {/* Play & Pause */}
      <ControlPanel 
        right={'1rem'}
        top={'1rem'}
        direction={'column'}
      >
        <ControlButton 
          style={(props.controls?.pause) ? {} : {display: 'none'}}
          onClick={handlePause}
          title={(props.playing) ? props.lang.playerControls.pause : props.lang.playerControls.play} 
        >
          {(props.playing) ? <img src={PauseIcon} alt={''} /> : <img src={PlayIcon} alt={''} />}
        </ControlButton>
        <ControlButton 
          style={(props.controls?.sound) ? {} : {display: 'none'}}
          onClick={handleMute}
          title={(props.mute) ? props.lang.playerControls.mute : props.lang.playerControls.unmute} 
        >
          {(props.mute) ? <img src={MuteIcon} alt={''} /> : <img src={AudioIcon} alt={''} />}
        </ControlButton>
      </ControlPanel>
    </>
  )
}

export default ControlLayer;