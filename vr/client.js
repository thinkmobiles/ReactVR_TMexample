// Auto-generated content.
// This file contains the boilerplate to set up your React app.
// If you want to modify your application, start in "index.vr.js"

// Auto-generated content.
import {VRInstance} from 'react-vr-web';
import {get3DPoint} from '../helpers/cameraHelper.js'

function init(bundle, parent, options) {
  const vr = new VRInstance(bundle, 'TMExample', parent, {
    // Add custom options here
    ...options,
  });
  vr.render = function() {
    // Any custom behavior you want to perform on each frame goes here
  };
  // Begin the animation loop
  vr.start();
  window.playerCamera = vr.player._camera;
  window.vr = vr;
  window.ondblclick= onRendererDoubleClick;
  window.onmousewheel = onRendererMouseWheel;
  vr.rootView.context.worker.addEventListener('message', onVRMessage);
  return vr;
}

window.ReactVR = {init};

function onVRMessage(e) {
  switch (e.data.type) {
    case 'sceneChanged':
    if (window.playerCamera.zoom != 1) {
      window.playerCamera.zoom = 1;
      window.playerCamera.updateProjectionMatrix();
    }
    break;
    case 'sceneLoadStart':
      document.getElementById('loader').style.display = 'block';
    break;
    case 'sceneLoadEnd':
      document.getElementById('loader').style.display = 'none';
    break;
    default:
    return;
  }
}

function onRendererDoubleClick(){
  var x  = 2 * (event.x / window.innerWidth) - 1;
  var y = 1 - 2 * ( event.y / window.innerHeight );
  var coordinates = get3DPoint(window.playerCamera, x, y);
  vr.rootView.context.worker.postMessage({ type: "newCoordinates", coordinates: coordinates });
}

function onRendererMouseWheel(){
  if (event.deltaY > 0 ){
     if(window.playerCamera.zoom  > 1) {
       window.playerCamera.zoom -= 0.1;
       window.playerCamera.updateProjectionMatrix();
      }
   }
   else {
     if(window.playerCamera.zoom < 3) {
      window.playerCamera.zoom += 0.1;
      window.playerCamera.updateProjectionMatrix();
     }
   }
}
