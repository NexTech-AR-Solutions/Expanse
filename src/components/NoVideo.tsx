import React from 'react'
import styled from 'styled-components';

const NoVideoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
`

const Video = styled.video`
  height: 100vh;
  width: 100vw;
  object-fit: cover;
`

const NoVideoText = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  color: #333;
  font-weight: bold;
  flex-wrap: wrap;

  & div {
    width: 100%;
  }
  
  & .header {
    font-size: 3rem;
  }

  & .subtext {
    font-size: 2rem;
  }
`

const NoVideo = (props: any) => {
  let { lang } = props;

  return (
    <> 
      <NoVideoContainer>
        <Video autoPlay={true} muted={true} loop={true}>
          <source src='https://inferno-event-assets.s3.us-west-2.amazonaws.com/misc/jtools/experiments/360video/geometric_loop.mp4'></source>
        </Video>
        <NoVideoText>
          <div className={'header'}>
            {lang?.errors.noVideoId}
          </div> 
          <div className={'subtext'}>
            {lang?.errors.noVideoDescription}
          </div>
        </NoVideoText>
      </NoVideoContainer>
    </>
  )
}

export default NoVideo;