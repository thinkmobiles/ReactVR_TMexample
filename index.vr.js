import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  View,
  Mesh,
  Image,
  VrButton
} from 'react-vr';

const DEFAULT_ANIMATION_BUTTON_RADIUS = 50;
const DEFAULT_ANIMATION_BUTTON_SIZE = 0.05;

class TMExample extends React.Component {

  constructor (props) {
    super(props);
    this.state =  {
      scenes: [{scene_image: 'initial.jpg', step: 1, navigations: [{step:2, translate: [0.73,-0.15,0.66], rotation: [0,36,0] }] },
               {scene_image: 'step1.jpg', step: 2, navigations: [{step:3, translate: [-0.43,-0.01,0.9], rotation: [0,140,0] }]},
               {scene_image: 'step2.jpg', step: 3, navigations: [{step:4, translate: [-0.4,0.05,-0.9], rotation: [0,0,0] }]},
               {scene_image: 'step3.jpg', step: 4, navigations: [{step:5, translate: [-0.55,-0.03,-0.8], rotation: [0,32,0] }]},
               {scene_image: 'step4.jpg', step: 5, navigations: [{step:1, translate: [0.2,-0.03,-1], rotation: [0,20,0] }]}],
      current_scene:{},
      animationWidth: DEFAULT_ANIMATION_BUTTON_SIZE,
      animationRadius: DEFAULT_ANIMATION_BUTTON_RADIUS
      };
      this.onNavigationClick = this.onNavigationClick.bind(this);
      this.onMainWindowMessage = this.onMainWindowMessage.bind(this);
      this.animatePointer = this.animatePointer.bind(this);
      this.sceneOnLoad = this.sceneOnLoad.bind(this);
      this.sceneOnLoadEnd = this.sceneOnLoadEnd.bind(this);
  }

  componentWillMount(){
    window.addEventListener('message', this.onMainWindowMessage);
    this.setState({current_scene: this.state.scenes[0]})
  }

  componentWillUnmount(){
    if (this.frameHandle) {
       cancelAnimationFrame(this.frameHandle);
       this.frameHandle = null;
      }
  }

  componentDidMount(){
    this.animatePointer();
  }

  onMainWindowMessage(e){
      switch (e.data.type) {
        case 'newCoordinates':
          var scene_navigation = this.state.current_scene.navigations[0];
          this.state.current_scene.navigations[0]['translate'] = [e.data.coordinates.x,e.data.coordinates.y,e.data.coordinates.z]
          this.forceUpdate();
        break;
        default:
        return;
      }
  }

  onPanoInput(e){
    if (e.nativeEvent.inputEvent.eventType === 'keydown'){
      this.rotatePointer(e.nativeEvent.inputEvent)
    }
  }

  onNavigationClick(item,e){
    if(e.nativeEvent.inputEvent.eventType === "mousedown" && e.nativeEvent.inputEvent.button === 0){
      cancelAnimationFrame(this.frameHandle);
      var new_scene = this.state.scenes.find(i => i['step'] === item.step);
      this.setState({current_scene: new_scene});
      postMessage({ type: "sceneChanged"})
      this.state.animationWidth = DEFAULT_ANIMATION_BUTTON_SIZE;
      this.state.animationRadius = DEFAULT_ANIMATION_BUTTON_RADIUS;
      this.animatePointer();
    }
  }

  rotatePointer(nativeEvent){
      switch (nativeEvent.keyCode) {
        case 38:
          this.state.current_scene.navigations[0]['rotation'][1] += 4;
        break;
        case 39:
          this.state.current_scene.navigations[0]['rotation'][0] += 4;
        break;
        case 40:
          this.state.current_scene.navigations[0]['rotation'][2] += 4;
        break;
        default:
        return;
      }
      this.forceUpdate();
  }

  animatePointer(){
    var delta = this.state.animationWidth + 0.002;
    var radius = this.state.animationRadius + 10;
    if(delta >= 0.13){
      delta = DEFAULT_ANIMATION_BUTTON_SIZE;
      radius = DEFAULT_ANIMATION_BUTTON_RADIUS;
    }
    this.setState({animationWidth: delta, animationRadius: radius})
    this.frameHandle = requestAnimationFrame(this.animatePointer);
  }

  sceneOnLoad(){
    postMessage({ type: "sceneLoadStart"})
  }

  sceneOnLoadEnd(){
    postMessage({ type: "sceneLoadEnd"})
  }

  render() {
    var that = this;
    return (
      <View>
        <Pano source={asset(this.state.current_scene['scene_image'])} onInput={this.onPanoInput.bind(this)}
          onLoad={this.sceneOnLoad} onLoadEnd={this.sceneOnLoadEnd}
          style={{ transform: [{translate: [0, 0, 0]}] }}/>
        {this.state.current_scene['navigations'].map(function(item,i){
              return  <Mesh  key={i}
                            style={{
                                layoutOrigin: [0.5, 0.5],
                                transform: [{translate: item['translate']},
                                            {rotateX: item['rotation'][0]},
                                            {rotateY: item['rotation'][1]},
                                            {rotateZ: item['rotation'][2]}]
                            }}
                      onInput={ e => that.onNavigationClick(item,e)}>
                              <VrButton
                                     style={{ width: 0.15,
                                            height:0.15,
                                            borderRadius: 50,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderStyle: 'solid',
                                            borderColor: '#FFFFFF80',
                                            borderWidth: 0.01
                                     }}>
                                     <VrButton
                                            style={{ width: that.state.animationWidth,
                                                   height:that.state.animationWidth,
                                                   borderRadius: that.state.animationRadius,
                                                   backgroundColor: '#FFFFFFD9'
                                            }}>
                                     </VrButton>
                              </VrButton>
                      </Mesh>
          })}
      </View>
    );
  }
};

AppRegistry.registerComponent('TMExample', () => TMExample);
