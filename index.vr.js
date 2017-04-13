import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  View,
  Mesh,
  Image
} from 'react-vr';

class TMExample extends React.Component {

  constructor (props) {
    super(props);
    this.state =  {
      scenes: [{scene_image: 'initial.jpg', step: 1, navigations: [{step:2, translate: [0,0.1,-1], rotation: [0,0,0] }] },
               {scene_image: 'step1.jpg', step: 2, navigations: [{step:3, translate: [0,0,-1], rotation: [0,0,0] }]},
               {scene_image: 'step2.jpg', step: 3, navigations: [{step:4, translate: [0,0,-1], rotation: [0,0,0] }]},
               {scene_image: 'step3.jpg', step: 4, navigations: [{step:5, translate: [0,0,-1], rotation: [0,0,0] }]},
               {scene_image: 'step4.jpg', step: 5, navigations: [{step:1, translate: [0,0,-1], rotation: [0,0,0] }]}],
      current_scene:{}
      };
      this.onNavigationClick = this.onNavigationClick.bind(this);
      this.onMainWindowMessage = this.onMainWindowMessage.bind(this);
  }

  componentWillMount(){
    window.addEventListener('message', this.onMainWindowMessage);
    this.setState({current_scene: this.state.scenes[0]})
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
      var new_scene = this.state.scenes.find(i => i['step'] === item.step);
      this.setState({current_scene: new_scene});
      postMessage({ type: "sceneChanged"})
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

  render() {
    var that = this;
    return (
      <View>
        <Pano source={asset(this.state.current_scene['scene_image'])} onInput={this.onPanoInput.bind(this)}
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
                              <Image source={asset('arrow.png')}
                                     style={{ width: 0.1,
                                            height:0.1
                                     }}/>
                      </Mesh>
          })}
      </View>
    );
  }
};

AppRegistry.registerComponent('TMExample', () => TMExample);
