import React from 'react';
import styled from 'styled-components';

export interface INodeAction {
  text?: String;
  type?: 'url' | 'function' | null;
  action?: String | Function;
  customStyle?: React.CSSProperties | null;
}

const ActionContainer = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: all 222ms;
  cursor: pointer;
  margin-right: 0.5rem;

`

const NodeAction = (props: INodeAction) => {

  const handleClick = () => {
    console.log(props.action);
    switch(props.type) {
      case 'url': window.open(props.action as string, "_blank"); break;
      case 'function': 
        let fn = eval(props.action as string);
        fn();
      break;
      case typeof null: return;
      default: return;
    }
  }

  return (
    <ActionContainer onClick={handleClick} style={{...props.customStyle}}>
      {props.text}
    </ActionContainer>
  )
}

export default NodeAction;