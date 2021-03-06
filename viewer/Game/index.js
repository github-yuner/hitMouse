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
    animationTime: 500,//????????????????????????????????????
      stopImg: 'btn15.png',
      musicImg: 'musicStart.png',
    musicFlag: true,
  }

  //?????????Record?????????,???Record?????????
  handleReturn = (order) => {
    const { scoreRecord } = this.state
    if (order === "endGame") {
      //????????????????????????????????????????????????????????????????????????
      //???????????????????????????????????????????????????????????????(?????????????????????????????????)
        console.log("????????????");
        PubSub.publish('isBack', { back:true })


    } else if (order === "onceMore") {
      //??????????????????????????????????????????0
        this.setState({
            scoreRecord: { hightRecord: scoreRecord.hightRecord, currentRecord: 0 },
            stopImg: 'btn15.png'
        })
      console.log("????????????");
    }
  }

  //????????????????????????
  countDown = (num) => {
    return () => {
      num--;
      if (num <= 0) {
        //??????60??????????????????????????????
        this.setState({ recordFlag: true })
        clearInterval(countDownTimer)
        clearInterval(animationTimer)
      }
      // console.log(this.state.time);
      //???????????????????????????????????????1
      this.setState({ time: num })
    }
  }

  // ?????????????????????????????????
  animation = () => {
    const { holes } = this.state
    const mouses = [{mouseImg: "mouse11.png", scoreImg:'tenScore3.png'},
    {mouseImg: "mouse21.png", scoreImg:'tenScore3.png'},
    {mouseImg: "mouse32.png", scoreImg:'tenScore2.png'},
    {mouseImg: "mouse41.png", scoreImg:'tenScore2.png'}]//????????????????????????????????????
    //????????????????????????
    this.arrLength = Math.floor(Math.random() * 3) + 2//2~4
    //?????????????????????????????????
    holes.map((hole) => {
      for (let i = 0; i < this.arrLength; i++) {
        // console.log("hh",i);
        this.random = Math.floor(Math.random() * 11) + 1

        //???????????????????????????
        if (this.random === hole.id) {
          hole.animationStyle = {
            transform: [
              { translateX: this.state.translateValue.x },
              { translateY: this.state.translateValue.y },
            ]
          }
          //????????????
          Animated.sequence([this.up(), this.down()]).start()
          //???????????????????????????
          const num = Math.floor(Math.random() * 4)
          hole.mouse = mouses[num].mouseImg
          hole.scoreImg = mouses[num].scoreImg
        } else {
          // ???????????????????????????
          hole.animationStyle = {}
        }
      }
    })
    // console.log(holes);
    // console.log('@',this.arrLength);
  }


  //????????????????????????????????????????????????,???????????????????????????????????????????????????
  endGame = () => {
    this.setState({ recordFlag: true,stopImg: 'btn22.png' })
    //???????????????bug??????321go???????????????????????????????????????????????????countDownTimer????????????????????????
    clearInterval(actionTimer)
    clearInterval(countDownTimer)
    clearInterval(animationTimer)
  }

  // try = 0
  //???????????????????????????
  hitMouse = (id, mouse) => {
    return () => {
      const { scoreRecord,holes,fadeoutValue } = this.state
      let currentRecord = 0
      let hightRecord = 0
      //???????????????????????????????????????
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
      //????????????????????????????????????
      this.hitMusic()

      //?????????????????????????????????(????????????????????????)
      holes.map((hole)=>{
        if(id === hole.id){
          //?????????????????????????????????
          hole.opacity = fadeoutValue
          //????????????
          Animated.sequence([this.fadeIn(), this.fadeOut()]).start()
          console.log(id,hole.id);
        }else{
          //????????????????????????
          hole.opacity = 0
        }
      })

      // this.try = this.try+1
      // console.log(scoreRecord.currentRecord,mouse,"--------------------------?????????",this.try)
    }
  }

  //????????????
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

  //????????????
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

  //????????????
  fadeIn = () => {
    return Animated.timing(this.state.fadeoutValue, {
      toValue: 1,
      duration: 100//??????????????????????????????
    })
  }
  //????????????
  fadeOut = () => {
    return Animated.timing(this.state.fadeoutValue, {
      toValue: 0,
      duration: this.state.animationTime
    })
  }


  //????????????????????????????????????
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

  //??????????????????
  clickMusic = () => {
    this.music()
    console.log('@----------', this.music);
    }
    
    //????????????/??????
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
    //????????????
    this.token = PubSub.subscribe('countDown', (_, actionFlag) => {
      this.setState(actionFlag)
      //????????????????????????
      clearInterval(countDownTimer)
      clearInterval(animationTimer)
      //????????????????????????????????????????????????????????????
      countDownTimer = setInterval(this.countDown(60), 1000)
      animationTimer = setInterval(this.animation, this.state.animationTime * 2)
    })
    this.token1 = PubSub.subscribe('isAgain', (_, obj) => {
      this.setState(obj)
    })

    //????????????
    Animated.sequence([this.up(), this.down()]).start()
    //??????clickMusic??????
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
