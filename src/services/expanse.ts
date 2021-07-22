import nodes from "../data/nodes";
import expanses from "../data/video";

export const GetExpanse = (expanseId: String) => {
  for (let expanse of expanses) {
    if (expanse.id === expanseId) {
      return expanse;
    }
  }
  return null;
}

export const GetNodes = (expanseId: String) => {
  let nodeList = [];
  for(let node of nodes) {
    if(node.expanseId === expanseId) {
      nodeList.push(node);
    }
  }
  return nodeList;
}

export const ExtractExpanse = (data: JSON) => {
  
}