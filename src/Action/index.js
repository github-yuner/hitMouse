import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import { NativeModules } from '@hyext-beyond/hy-ui-native'
import './index.hycss'

const { View,Image } = UI
const { createSound } = NativeModules

let actionTimer = null
let musicTimer = null
class Action extends Component {

    state = {
        numImg:"3.png",
    }
    flag = 2;

    //readyGo音效
    startMusic = () => {
        const sound1 = createSound('https://img.tukuppt.com/newpreview_music/00/06/19/5cc17e133e4174739.mp3', (err) => {
          console.log(err, 'startMusic')
          sound1.play(() => {
            sound1.release()
          })
        })
      }

    componentDidMount(){
        let i=0
        //开启定时器
        actionTimer = setInterval(()=>{
            //结束定时器改变app状态
            i++
            if(i>=4){
                //定时器结束发布消息改变actionFlag和time状态
                PubSub.publish('countDown',{actionFlag: false,time:60})
                //结束定时器
                clearInterval(actionTimer)
            }
            if(this.flag ===2){
                this.setState({numImg:"2.png"})
                this.flag = 1;
            } else if(this.flag === 1){
                this.setState({numImg:"1.png"})
                this.flag = 0;
            } else{
                this.setState({numImg:"go.png"})
                this.flag = 3;
            }
            console.log(this.state.numImg);
        },1000)

        //倒计时最后两秒触发倒计时readyGo音效
        musicTimer = setTimeout(()=>{
            this.startMusic()
        },3000)
    }

    componentWillUnmount(){
        //清除定时器
        clearInterval(actionTimer)
        clearTimeout(musicTimer)
    }

    render() {
        const {numImg} = this.state
        return (
            <View className="action-bg" style={{display:`${this.props.display}`}}>
                <Image className="action-time-img" mode="contain" src={require(`../../images/${numImg}`)}></Image>
            </View>
        )
    }
}

export default Action
