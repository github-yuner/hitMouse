import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import './index.hycss'


const { View, Text, Image, BackgroundImage, Button } = UI
export default class Record extends Component {

    onceMore = () => {
        this.props.handleReturn('onceMore')
        // 发布消息，点击再来一局改变actionFlag、recordFlag、time状态
        PubSub.publish('isAgain', { actionFlag: true, recordFlag: false, time: 60 })
    }
    endGame = () => {
        this.props.handleReturn('endGame')
    }

    static propTypes = {
        hightRecord: PropTypes.number.isRequired,
        currentRecord: PropTypes.number.isRequired,
        handleReturn: PropTypes.func.isRequired
    }
    render() {
        const { hightRecord, currentRecord } = this.props
        return (
            <View className="record-box">
                <BackgroundImage className='record' mode="stretch" src={require('../../images/gameoverImg.png')}>
                    <View className="recordContainer">
                        <View className='recordTitle'>
                            <Image className='recordTxt' mode="stretch" src={require('../../images/gameRecord.png')}></Image>
                        </View>
                        <View className='huyaLogon'>
                            <Image className='recordTxt' mode="stretch" src={require('../../images/huyaLogo.png')}></Image>
                        </View>
                        <View className='currentScore'>
                            <Image className='currentScoreImg' mode="stretch" src={require('../../images/currentScore.png')}></Image>
                            <Text className='currentScoreTxt'>{currentRecord}分</Text>
                        </View>
                        <View className='maxScore'>
                            <Image className='maxScoreImg' mode="stretch" src={require('../../images/maxScore.png')}></Image>
                            <Text className='maxScoreTxt'>{hightRecord}分</Text>
                        </View>
                        <View className='recordBtn'>
                            <Image onClick={this.onceMore} className='onceMore' mode="stretch" src={require('../../images/onceMore.png')}></Image>
                            <Image onClick={this.endGame} className='endGame' mode="stretch" src={require('../../images/endGame.png')}></Image>
                        </View>
                    </View>
                </BackgroundImage>
            </View>
        )
    }
}
