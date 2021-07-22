import { ReactElement } from "react";
import { INode } from "../components/Node";
import NodeAction from "../components/Nodes/NodeAction";

interface ILifetime {
  start: Number | null;
  end: Number | null;
}

export interface INodeObject {
  expanseId: String;
  id: String;
  x: Number;
  y: Number;
  lifetime?: ILifetime;
  element: INode;
  mesh?: THREE.Mesh;
}

const nodes: INodeObject[] = [
  {
    expanseId: 'testExpanse',
    id: 'tourism-in-uk',
    x: -110,
    y: -9,
    lifetime: { start: null, end: null },
    element: {
      title: 'Tourism in the UK',
      content: '<p>Stuff</p>',
      customStyle: {
        pulseColor: 'red',
        nodeColor: 'blue'
      },
      actions: [
        {
          type: null,
          text: 'Action',
          customStyle: {
            background: 'red',
          }
        },
        {
          type: null,
          text: 'Action',
          customStyle: {
            border: "1px solid #00000033"
          }
        }
      ]
    }
  }
]

export default nodes;