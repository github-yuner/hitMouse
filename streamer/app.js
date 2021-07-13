import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import { Animated,StyleSheet,Easing} from 'react-native'
import './app.hycss'

const { View, Image, } = UI
class App extends Component {

  state = {
    translateValue: new Animated.ValueXY({x:0, y:0})
  };

  up = () => {
    return Animated.timing(this.state.translateValue, {
      toValue: {
        x:0,
        y:0
    },
    duration: 2000,
    easing:Easing.linear
    });
  };

  down = () => {
    return Animated.timing(this.state.translateValue, {
      toValue: {
        x:0,
        y:60
    },
    duration: 2000,
    easing:Easing.linear
    });
  };

  componentDidMount(){
    Animated.sequence([this.down(),this.up()]).start()
  }

  render () {
    return (
      <View className="mouse-box">
      <Animated.View style={
            {
              transform:[
                {translateX:this.state.translateValue.x},
                {translateY:this.state.translateValue.y},
              ]
            }} className="mouse-move-box">
        <Image className="mouse-down" mode="contain" src={require('../images/hy2.png')}></Image>
      </Animated.View>
      </View>
    )
  }
}

export default App
