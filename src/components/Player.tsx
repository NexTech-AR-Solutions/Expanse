import {ReactElement, useEffect, useState} from 'react';
import * as THREE from 'three';

import ControlLayer from './ControlLayer';

import {
  Frustum,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
  VideoTexture,
  WebGLRenderer
} from 'three';
import styled from 'styled-components';
import Node from './Node';
import { INodeObject } from '../data/nodes';

const PlayerContainer = styled.div `
  overflow: hidden;
`

interface IExpanse {
  id?: String,
  type?: String,
  source?: String,
  nodes?: INodeObject[];
}

const Player = (props : {
  lang: any;
  videoId: String;
  expanse: IExpanse;
}) => {
  let {lang, videoId} = props;
  const [playing, setPlaying] = useState < Boolean > (true);
  const [mute, setMute] = useState < Boolean > (true);
  let nodes = props.expanse.nodes;


  // const [playing, setPlaying] = useState<Boolean>(props.isPlaying ?? true);
  // const [mute, setMute] = useState<Boolean>(props.isMute ?? true);

  let
    // Root Elements
    container: HTMLElement,
    videoSource: HTMLVideoElement,

    camera: PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100),
    scene: Scene = new THREE.Scene(),
    renderer: WebGLRenderer = new THREE.WebGLRenderer(),
    frustum: Frustum = new THREE.Frustum(),
    tempTransform: Vector3 = new THREE.Vector3(),
    lastFrameUpdate: number = Date.now(),
    texture: VideoTexture,
    material: MeshBasicMaterial,
    geometry: SphereGeometry = new THREE.SphereGeometry(500, 60, 40),
    mesh: Mesh,
    viewIndicatorInner: HTMLElement,

    frameRate: number = 0,
    playTime: number = 0,
    duration: number = 0,
    distance: number = 50,

    // Interactions
    isUserInteracting: Boolean = false,
    lon: number = 0,
    lat: number = 0,
    phi: number = 0,
    theta: number = 0,
    onPointerDownPointerX: number = 0,
    onPointerDownPointerY: number = 0,
    onPointerDownLon: number = 0,
    onPointerDownLat: number = 0;

  useEffect(() => { // Set the renderer's aspect ratio and viewport size.
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Grab the container and append the renderer.
    container = document.getElementById('container')as HTMLElement;
    container.appendChild(renderer.domElement);

    // Grab the view indicator.
    viewIndicatorInner = document.getElementById('view_indicator_inner') as HTMLElement;

    // Grab the video and create the texture with it.
    videoSource = document.getElementById('video')as HTMLVideoElement;

    let { expanse } = props;

    // Handle if it's a 360 video
    if (expanse.type === 'video') {
      videoSource.src = expanse.source as string;
      videoSource?.play();
      texture = new THREE.VideoTexture(videoSource);
    }

    // Handle if it's a 360 image
    if (expanse.type === 'image') {}

      
    nodes?.map((node) => {
      const geometry = new THREE.RingGeometry(10, 15, 8);
      const material = new THREE.MeshBasicMaterial({ color: '0x000000', transparent: true, opacity: 0 });
      const nodeMesh = new THREE.Mesh(geometry, material);

      nodeMesh.rotateY(THREE.MathUtils.degToRad(-node.x + 90));
      nodeMesh.rotateX(THREE.MathUtils.degToRad(node.y as number));

      nodeMesh.translateZ(-500); // Move outward towards sphere edge.
      nodeMesh.lookAt(0, 0, 0) // Look at camera.
      scene.add(nodeMesh);
      node.mesh = nodeMesh;
    })

    // Cameras cull the back of the vertices, so we invert the sphere's normals
    // so that the vertices point inward, toward the camera.
    geometry.scale(- 1, 1, 1);

    // Assign a new material from the video texture.
    material = new THREE.MeshBasicMaterial({map: texture});
    mesh = new THREE.Mesh(geometry, material);

    // Finally, append te mesh to the scene.
    scene.add(mesh);

    // Set up page events.
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);

    window.addEventListener('resize', onWindowResize);

    animate();

  }, [])

  // Reshapes the aspect ratio and renderer size to fit the canvas.
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  //
  const onPointerDown = (event: MouseEvent) => {
    isUserInteracting = true;
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
  }

  // Sets the longitude and latitude of the sphere as the mouse moves.
  const onPointerMove = (event: MouseEvent) => {
    if (isUserInteracting === true) {
      lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
      lat = (onPointerDownPointerY - event.clientY) * 0.1 + onPointerDownLat;
    }
  }

  // Stops waiting for user interactions on mouseUp.
  const onPointerUp = () => {
    isUserInteracting = false;
  }

  const animate = () => {
    requestAnimationFrame(animate);
    update();
  }

  const update = () => {
    lat = Math.max(- 85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    camera.position.x = distance * Math.sin(phi) * Math.cos(theta);
    camera.position.y = distance * Math.cos(phi);
    camera.position.z = distance * Math.sin(phi) * Math.sin(theta);

    frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

    // Returns in seconds. Can be used for tracked hotspots.
    playTime = videoSource.currentTime;
    let playTimePercent = playTime / duration * 100;
    // timelineFill.style.width = `${playTimePercent}%`

    // Rotate the 360 View Indicator
    if (viewIndicatorInner) {
        viewIndicatorInner.style.transform = `rotate(${(lon % 360)}deg)`
    }

    nodes?.map((node) => {
      updateNodes(node);
    })


    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  const handleTogglePlay = (set: Boolean) => {
    let vid = document.getElementById('video') as HTMLVideoElement;
    if(set && vid) {
      vid.play();
    } else {
      vid.pause();
    }
    setPlaying(set);

  }

  const renderNodes = (nodes: INodeObject[] | null) => {
    let nodeList: ReactElement[] = [] 
    nodes?.map((node, i) => {
      let el = <Node
        id={node.id}
        key={i}
        title={node.element.title}
        content={node.element.content}
        actions={node.element.actions}
        customStyle={node.element.customStyle}
      ></Node>
      nodeList.push(el);
    })
    return nodeList;

  }

  const updateNodes = (node: INodeObject) => {

    let circle = node.mesh;

    if(!circle) return;

    // get the position of the center of the circle
    circle?.updateWorldMatrix(true, false);
    circle?.getWorldPosition(tempTransform);

    // get the normalized screen coordinate of that position
    // x and y will be in the -1 to +1 range with x = -1 being
    // on the left and y = -1 being on the bottom
    tempTransform.project(camera);

    // convert the normalized position to CSS coordinates
    let canvas = document.querySelector("[class=App]");
    let x, y;
    if(canvas){
      x = (tempTransform.x * .5 + .5) * canvas.clientWidth;
      y = (tempTransform.y * -.5 + .5) * canvas.clientHeight;
    }

    // move the elem to that position
    let elem = document.querySelector("[id=" + node.id + "]") as HTMLElement;
    if (elem) {
      elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
      // Checks if the hotspot is within the camera's view. 
      // If not, hide the elements associated with that hotspot
      // This prevents the elements from popping up when the camera is turned around
      if (frustum.containsPoint(circle.position)) {
        // In View
        elem.style.display = "unset"
      } else {
        // Not In View
        elem.style.display = "none"
      }
    }

    // Check if the hotspot should be alive
    if (node.lifetime) {
        let lt = node.lifetime;
        if (lt.start !== null && lt.end !== null) {
          if (playTime > lt.start && playTime < lt.end) {
            elem.classList.remove("hidden")
          } else {
            elem.classList.add("hidden")
          }
        }
    }
  }


  return(
    <> 
      <video 
        id='video' 
        loop={true} 
        src={undefined} 
        crossOrigin={'anonymous'}  
        hidden={true}
        muted={mute as boolean}
      ></video>
      <PlayerContainer id='container'></PlayerContainer > 
      {renderNodes(nodes as INodeObject[])}
      <ControlLayer 
        // Player Controls
        playing={playing} 
        mute={mute} 
        toggleMute={setMute} 
        togglePlaying={handleTogglePlay} 
        lang={lang}
      /> 
    </>
  )
}

export default Player;
