import styled, { keyframes } from 'styled-components';
import NodeAction, { INodeAction } from './Nodes/NodeAction';
import ReactHTMLParser from 'react-html-parser'

const NodeContainer = styled.div`
  position: absolute;
  width: 400px;
  top: 0;
  left: 0;
  opacity: 1;
  transition: opacity 222ms;
  user-select: none;
  pointer-events: all;
  font-family: Arial, Helvetica, sans-serif;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }

  &.force-open {
    opacity: 1;
  }

  &:hover .nodePulse {
    opacity: 0;
  }

  


`

const pulseRing = keyframes`
  0% {
    transform: scale(0.33);
  }

  80%,
  100% {
    opacity: 0;
  }
`

const pulseDot = keyframes`
  0% {
    transform: scale(0.8);
  }

  50% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.8);
  }
`

export interface INodePulse {
  nodeColor?: String;
  pulseColor?: String;
}

const NodePulse = styled.div<INodePulse>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 30px;
  height: 30px;
  transition: opacity 222ms;

  &.clickable {
    cursor: pointer;
  }

  &:not(.clickable) {
    pointer-events: none;
  }

  &:before {
    content: "";
    position: relative;
    display: block;
    width: 300%;
    height: 300%;
    box-sizing: border-box;
    margin-left: -100%;
    margin-top: -100%;
    border-radius: 45px;
    background-color: ${props => (props.pulseColor) ? props.pulseColor as string : 'cyan'};
    animation: ${pulseRing} 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
  }

  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    width: 100%;
    height: 100%;
    background-color: ${props => (props.nodeColor) ? props.nodeColor as string: 'white'};
    border-radius: 15px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
    animation: ${pulseDot} 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
  }

`

const NodeWrapper = styled.div`
  opacity: 0;
  background: #CCCCFF88;
  border-radius: 0.5rem;
  box-shadow: 0 0 1rem #00000088;
  backdrop-filter: blur(10px);
  transition: opacity 222ms;
  padding: 1rem;
  z-index: 100;

  &:hover {
    opacity: 1;
  }
`

const NodeTitle = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
`

const NodeActionWrapper = styled.div`
  display: flex;
  margin: 0.25rem 0;
`

const NodeRule = styled.div`
  height: 1px;
  width: 100%;
  border: none;
  margin: 0.5rem 0;
  background: #33333333;
`

export interface INodeCustomStyle {
  nodeColor: String;
  pulseColor: String;
}

export interface INode {
  id?: String;
  title?: String;
  type?: 'clickable' | 'hover';
  clickAction?: String;
  content?: String | null;
  actions?: INodeAction[];
  customStyle?: INodeCustomStyle;
}

const renderActions = (actions: INodeAction[] | undefined) => {
  let els: INodeAction[] = []
  actions?.map((action, i) => {
    els.push(<NodeAction key={i} type={action.type} text={action.text} customStyle={action.customStyle} action={action.action} />);
  })
  return els;
}

const Node = (props: INode) => {

  return (
    <NodeContainer id={props.id as string} >
      <NodePulse 
        onClick={() => props.clickAction && window.open(props.clickAction as string, '_PARENT')}
        className={'nodePulse '+(props.type === 'clickable') ? 'clickable' : ''}
        nodeColor={props.customStyle?.nodeColor} 
        pulseColor={props.customStyle?.pulseColor} 
      />
      {(!props.type || props.type === 'hover') &&
        <NodeWrapper>
          <NodeTitle>{props.title}</NodeTitle>
          {props.title && <NodeRule />}
          {ReactHTMLParser(props.content as string)}
          {props.actions && <NodeRule />}
          <NodeActionWrapper>
            {renderActions(props.actions)}
          </NodeActionWrapper>
          {/* <div class="spot-title">Not the Burj Khalifa</div>
          <div class="spot-description">Still pretty tall, though!</div>
          <div class="actions-wrapper">
          <a class="positive" href="https://www.google.com" target="_blank">Action 1</a>
          <a class="negative" href="https://www.nextechar.com" target="_blank">Action 2</a>
        </div> */}
        </NodeWrapper>
      }
    </NodeContainer>
  )
}

export default Node;