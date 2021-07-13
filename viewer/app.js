import { Route, Router } from "@hyext/router"
import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import CryptoJS from 'crypto-js'
import Game from './Game'
import './app.hycss'

const {View, Text ,BackgroundImage,Button,Image,Avatar,Modal,Dialog} = UI

export default class App extends Component {
    constructor () {
        super()
        this.state = {
            
            // 我的排行榜数据
            myRankList: 
            {
                id: 10,
                rank: 8,
                headImg: '',
                nickName: '虎牙',
                score:66
            },
            // 排行榜数据
            rankLists: [
                {
                    id: 1,
                    rank: 1,
                    headImg: '',
                    nickName: '昵称',
                    score:98
                },
                {
                    id: 2,
                    rank: 2,
                    headImg: '',
                    nickName: '昵称',
                    score:98
                },
                {
                    id: 3,
                    rank: 3,
                    headImg: '',
                    nickName: '昵称',
                    score:98
                },
                {
                    id: 4,
                    rank: 3,
                    headImg: '',
                    nickName: '昵称',
                    score:98
                },
                {
                    id: 5,
                    rank: 3,
                    headImg: '',
                    nickName: '昵称',
                    score:98
                },
                {
                    id: 6,
                    rank: 3,
                    headImg: '',
                    nickName: '昵称',
                    score:98
                },
                {
                    id: 7,
                    rank: 3,
                    headImg: '',
                    nickName: '昵称',
                    score:98
                },
                {
                    id: 8,
                    rank: 3,
                    headImg: '',
                    nickName: '昵称',
                    score:98
                },
                {
                    id: 9,
                    rank: 3,
                    headImg: '',
                    nickName: '昵称',
                    score:98
                }
                
            ],
            chooseLevel: 'easy',
            isShow:true
        }
    }
    componentDidMount() {
        hyExt.logger.info('获取当前用户Token')
        hyExt.vip.getJWT().then(resp => {
            hyExt.logger.info('获取当前用户Token成功，返回：' + JSON.stringify(resp))
            
            let detailsInfo= CryptoJS.enc.Hex.stringify(JSON.stringify(resp))
            console.log(detailsInfo)
            

        }).catch(err => {
            hyExt.logger.info('获取当前用户Token失败，错误信息：' + err.message)
        })

        this.token = PubSub.subscribe('isBack', (_, back) => {
            // console.log(back);
            if (back) {
                console.log(this.$router.history);
                this.$router.history.replace('/App')
            }
        })

    }
    startGame = () => {
        // console.log("开始游戏:" + this.state.chooseLevel)
        this.$router.history.replace('/Game',{userId:'111'})
        console.log(this.$router.history)
        this.setState({
            isShow: false
        })

    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.token)
    }


    render() {
        const { myRankList, rankLists,isShow } = this.state
        return (
            <div style={{ width: "100%", height: window.innerHeight + "px" }}>
            <Router initialEntries={['./App']} ref={c => { this.$router = c }}>
                    <Route path={'/Game'} component={Game}></Route>
                    <Route path={'/App'} component={App}></Route>
                {/* </Router> */}
                    <BackgroundImage style={{width:'100%',height:'100%',display:isShow?'flex':'none'}}  src={require('../images/loginBg.png')}>
                    <div className="huya">
                        <img className="hyImage" mode="cover"  src={require('../images/homePageHuya.png')}></img>  
                    </div>
                    <div className="buttons">
                        <Button className="btn" size="md" textColorInverse onPress={() => {this.modalCancel.open()}}><Text className="btnTxt" >排行榜</Text></Button>
                        <Button className="btn" size="md" textColorInverse onPress={this.startGame}><Text className="btnTxt">开始游戏</Text></Button>
                        <Button className="btn" size="md" textColorInverse onPress={() => {this.modalRule.open()}}><Text className="btnTxt">游戏规则</Text></Button>
                    </div>

                    { /*排行榜 模态框*/}
                    <Modal className="modelChartList" ref={c => {this.modalCancel = c}} cancelable >
                        <div className="chartList">
                            <div className="listHeader">
                                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ myRankList.rank}<br />我的排名</div>
                                <Avatar 
                                    size="s" 
                                    borderColor="#f90909"
                                    backupSrc={require('../images/huyaLogo.png')} // 网络错误显示默认图
                                    src={require('../images/huyaLogo.png')}
                                    >
                                </Avatar>
                                <div>{myRankList.nickName }</div>
                                <div>{ myRankList.score}</div>
                            </div>
                            
                            <div className="showList">
                                { /*showListBox 去滚动条 */}
                            <div className="showListBox">
                                {
                                    rankLists.map((item) => {
                                        return (
                                            <div className="lists" key={item.id}>
                                                <div>&nbsp;&nbsp;{ item.rank}<br />排名</div>
                                                <Avatar 
                                                    size="s" 
                                                    borderColor="#f90909"
                                                    backupSrc={require('../images/huyaLogo.png')} // 网络错误显示默认图
                                                    src={require('../images/huyaLogo.png')}
                                                    >
                                                </Avatar>
                                                <div>{ item.nickName}</div>
                                                <div>{ item.score}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            </div>
                        </div>
                    </Modal>

                    {/* 游戏规则 */}
                    <Modal className="modelChartList" ref={c => { this.modalRule = c }} cancelable >
                        <div className="ruleContainer">
                            <div>游戏规则</div>
                        </div>
                    </Modal>
                </BackgroundImage>
            </Router>
            </div>
        )
    }
}

