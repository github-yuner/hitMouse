import { Route, Router } from "@hyext/router"
import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import { Animated, Easing, TouchableWithoutFeedback } from 'react-native'
import { NativeModules } from '@hyext-beyond/hy-ui-native'
import './index.hycss'
import Action from '../../src/Action'
import Record from '../../src/Record'

const { View, Text, BackgroundImage, Image } = UI
const { createSound } = NativeModules

var actionTimer = null
var countDownTimer = null
var animationTimer = null
var musicTimer = null
class Game extends Component {

  state = {
    holes: [
      { id: 1,  animationStyle: {}, opacity: 0, mouse: 'mouse11.png', scoreImg: 'tenScore1.png' },
      { id: 2,  animationStyle: {}, opacity: 0, mouse: 'mouse11.png', scoreImg: 'tenScore1.png' },
      { id: 3,  animationStyle: {}, opacity: 0, mouse: 'mouse11.png', scoreImg: 'tenScore1.png' },
      { id: 4,  animationStyle: {}, opacity: 0, mouse: 'mouse11.png', scoreImg: 'tenScore1.png' },
      { id: 5,  animationStyle: {}, opacity: 0, mouse: 'mouse11.png', scoreImg: 'tenScore1.png' },
      { id: 6,  animationStyle: {}, opacity: 0, mouse: 'mouse11.png', scoreImg: 'tenScore1.png' },
      { id: 7,  animationStyle: {}, opacity: 0, mouse: 'mouse11.png', scoreImg: 'tenScore1.png' },
      { id: 8,  animationStyle: {}, opacity: 0, mouse: 'mouse11.png', scoreImg: 'tenScore1.png' },
      { id: 9,  animationStyle: {}, opacity: 0, mouse: 'mouse11.png', scoreImg: 'tenScore1.png' },
      { id: 10, animationStyle: {}, opacity: 0, mouse: 'mouse11.png', scoreImg: 'tenScore1.png' },
      { id: 11, animationStyle: {}, opacity: 0, mouse: 'mouse11.png', scoreImg: 'tenScore1.png' },
      { id: 12, animationStyle: {}, opacity: 0, mouse: 'mouse11.png', scoreImg: 'tenScore1.png' },
    ],
    actionFlag: true,
    scoreRecord: { hightRecord: 99999, currentRecord: 0 },
    time: 60,
    recordFlag: false,
    translateValue: new Animated.ValueXY({ x: 0, y: 0 }),
    fadeoutValue: new Animated.Value(0),
    animationTime: 500,//控制难度（出洞入洞时间）
      stopImg: 'btn15.png',
      musicImg: 'musicStart.png',
    musicFlag: true,
  }

  //传递给Record的方法,在Record中调用
  handleReturn = (order) => {
    const { scoreRecord } = this.state
    if (order === "endGame") {
      //这里写点击退出按钮后，传递一个标识值给入口程序，
      //在那里写究竟使退回到首页还是进入到游戏页面(可以用子给父传值的方式)
        console.log("退出游戏");
        PubSub.publish('isBack', { back:true })


    } else if (order === "onceMore") {
      //再来一局时需要重置当前份数为0
        this.setState({
            scoreRecord: { hightRecord: scoreRecord.hightRecord, currentRecord: 0 },
            stopImg: 'btn15.png'
        })
      console.log("再来一局");
    }
  }

  //倒计时定时器方法
  countDown = (num) => {
    return () => {
      num--;
      if (num <= 0) {
        //游戏60秒结束需要弹出计分框
        this.setState({ recordFlag: true })
        clearInterval(countDownTimer)
        clearInterval(animationTimer)
      }
      // console.log(this.state.time);
      //每隔一秒状态里的时间就减少1
      this.setState({ time: num })
    }
  }

  // 地鼠随机出现定时器方法
  animation = () => {
    const { holes } = this.state
    const mouses = [{mouseImg: "mouse11.png", scoreImg:'tenScore3.png'},
    {mouseImg: "mouse21.png", scoreImg:'tenScore3.png'},
    {mouseImg: "mouse32.png", scoreImg:'tenScore2.png'},
    {mouseImg: "mouse41.png", scoreImg:'tenScore2.png'}]//老虎图片和对应的分数图片
    //随机一个数组长度
    this.arrLength = Math.floor(Math.random() * 3) + 2//2~4
    //给随机的老鼠做组合动画
    holes.map((hole) => {
      for (let i = 0; i < this.arrLength; i++) {
        // console.log("hh",i);
        this.random = Math.floor(Math.random() * 11) + 1

        //随机一个老鼠加动画
        if (this.random === hole.id) {
          hole.animationStyle = {
            transform: [
              { translateX: this.state.translateValue.x },
              { translateY: this.state.translateValue.y },
            ]
          }
          //组合动画
          Animated.sequence([this.up(), this.down()]).start()
          //随机给这个老鼠造型
          const num = Math.floor(Math.random() * 4)
          hole.mouse = mouses[num].mouseImg
          hole.scoreImg = mouses[num].scoreImg
        } else {
          // 其他的老鼠取消动画
          hole.animationStyle = {}
        }
      }
    })
    // console.log(holes);
    // console.log('@',this.arrLength);
  }


  //点击暂停按钮，结束游戏弹出计分框,结束游戏倒计时（实际该轮游戏结束）
  endGame = () => {
    this.setState({ recordFlag: true,stopImg: 'btn22.png' })
    //这里有个小bug（在321go倒计时未结束时点击会没用，因为此时countDownTimer定时器还未开启）
    clearInterval(actionTimer)
    clearInterval(countDownTimer)
    clearInterval(animationTimer)
  }

  // try = 0
  //点击地鼠后改变状态
  hitMouse = (id, mouse) => {
    return () => {
      const { scoreRecord,holes,fadeoutValue } = this.state
      let currentRecord = 0
      let hightRecord = 0
      //打到不同的老鼠加上不同的分
      switch (mouse) {
        case "mouse11.png":
          currentRecord = scoreRecord.currentRecord + 10
          hightRecord = scoreRecord.hightRecord
          this.setState({ scoreRecord: { hightRecord, currentRecord } })
        case "mouse21.png":
          currentRecord = scoreRecord.currentRecord + 10
          hightRecord = scoreRecord.hightRecord
          this.setState({ scoreRecord: { hightRecord, currentRecord } })
        case "mouse32.png":
          currentRecord = scoreRecord.currentRecord + 20
          hightRecord = scoreRecord.hightRecord
          this.setState({ scoreRecord: { hightRecord, currentRecord } })
        case "mouse41.png":
          currentRecord = scoreRecord.currentRecord + 20
          hightRecord = scoreRecord.hightRecord
          this.setState({ scoreRecord: { hightRecord, currentRecord } })
      }
      //这里写打中老鼠音效的开始
      this.hitMusic()

      //打中的老鼠头上显示份数(开始淡入淡出动画)
      holes.map((hole)=>{
        if(id === hole.id){
          //给打中的老鼠加组合动画
          hole.opacity = fadeoutValue
          //组合动画
          Animated.sequence([this.fadeIn(), this.fadeOut()]).start()
          console.log(id,hole.id);
        }else{
          //其他老鼠取消动画
          hole.opacity = 0
        }
      })

      // this.try = this.try+1
      // console.log(scoreRecord.currentRecord,mouse,"--------------------------打到了",this.try)
    }
  }

  //上升动画
  up = () => {
    return Animated.timing(this.state.translateValue, {
      toValue: {
        x: 0,
        y: -45
      },
      duration: this.state.animationTime,
      easing: Easing.linear
    })
  }

  //下降动画
  down = () => {
    return Animated.timing(this.state.translateValue, {
      toValue: {
        x: 0,
        y: 0
      },
      duration: this.state.animationTime,
      easing: Easing.linear
    })
  }

  //淡入动画
  fadeIn = () => {
    return Animated.timing(this.state.fadeoutValue, {
      toValue: 1,
      duration: 100//动画在多少毫秒内完成
    })
  }
  //淡出动画
  fadeOut = () => {
    return Animated.timing(this.state.fadeoutValue, {
      toValue: 0,
      duration: this.state.animationTime
    })
  }


  //背景音乐和打中老鼠的音乐
  music = () => {
    this.sound1 = createSound('https://img.tukuppt.com/newpreview_music/09/01/24/5c89d09611cca66007.mp3', (err) => {
      console.log(err, 'Sound1')
      this.sound1.play(() => {
        musicTimer = setInterval(() => {
          this.sound1.play()
        }, 1000);
      })
    })
  }
  hitMusic = () => {
    const sound2 = createSound('https://img.tukuppt.com/newpreview_music/00/07/61/5d0c7a015b04397235.mp3', (err) => {
      // console.log(err, 'Sound1')
      sound2.play(() => {
        sound2.release()
      })
    })
  }

  //触发背景音乐
  clickMusic = () => {
    this.music()
    console.log('@----------', this.music);
    }
    
    //音乐开始/暂停
    musicChange = () => {
        const { musicFlag} = this.state
        if (musicFlag) {
            this.setState({ musicFlag: !musicFlag, musicImg: 'musicStop.png' })
            this.sound1.pause()
        } else {
            this.setState({ musicFlag: !musicFlag, musicImg: 'musicStart.png' })
            this.sound1.play()
        }
    }

  componentDidMount() {
    //订阅消息
    this.token = PubSub.subscribe('countDown', (_, actionFlag) => {
      this.setState(actionFlag)
      //结束上一个定时器
      clearInterval(countDownTimer)
      clearInterval(animationTimer)
      //订阅到开始倒计时结束，开启倒计时的定时器
      countDownTimer = setInterval(this.countDown(60), 1000)
      animationTimer = setInterval(this.animation, this.state.animationTime * 2)
    })
    this.token1 = PubSub.subscribe('isAgain', (_, obj) => {
      this.setState(obj)
    })

    //组合动画
    Animated.sequence([this.up(), this.down()]).start()
    //触发clickMusic方法
    this.clickMusic()
  }

  componentWillUnmount() {
    clearInterval(actionTimer)
    clearInterval(musicTimer)
    clearInterval(countDownTimer)
    clearInterval(animationTimer)
    PubSub.unsubscribe(this.token)
      PubSub.unsubscribe(this.token1)
      this.sound1.stop(() => {
          this.sound1.release()
      })
      
  }



  render() {
    const { holes, actionFlag, recordFlag, scoreRecord, time ,stopImg,musicImg} = this.state
    return (
        <View className="main">
        <BackgroundImage  className="main-bg" src={require('../../images/bg2.jpg')}>
          <View className="header">
            <View className="count-down">
              <BackgroundImage className="count-down-bg" src={require('../../images/time2.png')}>
                <Image onClick={this.musicChange} className="count-down-music" mode="contain" src={require(`../../images/${musicImg}`)}></Image>
                <Image className="count-down-image" mode="contain" src={require('../../images/timeTxt.png')}></Image>
                <BackgroundImage className="time-bg" mode="contain" src={require('../../images/hy7.png')}>
                  <Text className="count-down-time">{time}</Text>
                </BackgroundImage>
              </BackgroundImage>
            </View>
            <View className="scoring-area">
              <View className="score-highest">
                <Image className="score-highest-image" mode="contain" src={require('../../images/maxScore.png')}></Image>
                <BackgroundImage className="score-bg" src={require('../../images/score.png')}>
                  <Text className="score-text">{scoreRecord.hightRecord}</Text>
                </BackgroundImage>
              </View>
              <View className="score">
                <Image className="score-image" mode="contain" src={require('../../images/scoreTxt.png')}></Image>
                <BackgroundImage className="score-bg" src={require('../../images/score.png')}>
                  <Text className="score-text">{scoreRecord.currentRecord}</Text>
                </BackgroundImage>
              </View>
              <View className="suspend">
                <Image onClick={this.endGame} className="suspend-image" mode="contain" src={require(`../../images/${stopImg}`)}></Image>
              </View>
            </View>
          </View>
          <View className="hole-view">
            {
              holes.map((item) => {
                return (
                  <BackgroundImage key={item.id} className="hole-bg" src={require(`../../images/hole.png`)}>
                    <View style={{ position: "absolute", bottom: "31px", width: "150px", height: "60px", overflow:"hidden", margin: "auto" }}>
                      <Animated.View style={{opacity: item.opacity}}>
                        <Image className="mouse-down-score" mode="contain" src={require(`../../images/${item.scoreImg}`)}></Image>
                      </Animated.View>
                      <Animated.View style={item.animationStyle} className="mouse-move-box">
                        <TouchableWithoutFeedback onClick={this.hitMouse(item.id, item.mouse)} className="mouse-touch">
                          <Image className="mouse-down" mode="contain" src={require(`../../images/${item.mouse}`)}></Image>
                        </TouchableWithoutFeedback>
                      </Animated.View>
                    </View>
                  </BackgroundImage>
                )
              })
            }
          </View>
          {
            actionFlag ? <Action /> : null
          }
          {
            recordFlag ? <Record hightRecord={scoreRecord.hightRecord} currentRecord={scoreRecord.currentRecord} handleReturn={this.handleReturn} /> : null
          }

          {/* <Audio /> */}
        </BackgroundImage>
      </View>
    )
  }
}

export default Game
