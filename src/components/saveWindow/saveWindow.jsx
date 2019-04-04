import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import styles from './saveWindow.css';
import {manualUpdateProject} from '../../reducers/project-state';
import {closeFileMenu} from '../../reducers/menus';
import xhr from 'xhr';
import queryString from 'query-string';


class SaveWindow extends React.Component{
   constructor(props) {
       super(props);
       this.state={
           bool:false,
           img:''
       }
   }
    handleClickSave () {
        this.props.dispatch(this.props.closeFileMenu());
        this.props.dispatch(this.props.manualUpdateProject());
        this.getImg(1,'https://aolincode.com/').then((data)=>{
            if(data.code===200){
                this.setState({
                    img:data.data,
                    bool:true
                })
            }
        });

    }
    getImg(id,url){
        const opts = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        };
        const queryParams = {scratchProjectId:id,url:url};
        let qs = queryString.stringify(queryParams);
        Object.assign(opts, {
            method: 'get',
            url: `https://api-test.aolincode.com/internalapi/generateUserProjectCodeUrl?${qs}`
        });
        return new Promise((resolve, reject) => {
            xhr(opts, (err, response) => {
                if (err) return reject(err);
                let data;
                try {
                    data = JSON.parse(response.body);
                } catch (e) {
                    return reject(e);
                }
                resolve(data);
            });
        });
    }
    closeImg(){
       this.setState({
           bool:false
       })
    }
    render(){
       return(
           <div className={styles.saveWindows}>
               <div style={{display:this.state.bool?'block':"none"}}>
                   <div className={styles.saveWindowsTwoImg}>
                       <img src="https://city.boolan.com/img1fgr.png"/>
                       <img src="https://city.boolan.com/closeIcon.png" onClick={this.closeImg.bind(this)}/>
                   </div>
                   <div className={styles.saveWindowsImg}>
                       <div>
                           <span>小朋友，你的作品已经保存成功！</span>
                           <span>你可以用爸爸或妈妈的手机</span>
                           <span>扫码分享到微信朋友圈哦~</span>
                       </div>
                       <div>
                           <img src={this.state.img} />
                       </div>
                   </div>
               </div>

               <div  className={styles.saveWindowsIcon}>
                   <img src="https://city.boolan.com/button.png" onClick={this.handleClickSave.bind(this)}/>
               </div>
           </div>
       )
    }
}
SaveWindow.propTypes = {
    onClickSave: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
};
// const mapDispatchToProps = dispatch => ({
//     onRequestCloseFile: () => dispatch(closeFileMenu()),
//     //保存
//     onClickSave: () => dispatch(manualUpdateProject()),
// });
export default connect(
    ()=>{}, {closeFileMenu,manualUpdateProject}
)(SaveWindow);

