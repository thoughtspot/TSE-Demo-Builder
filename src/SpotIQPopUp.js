import React, { useState, useEffect, setState } from 'react';
import { SearchEmbed, LiveboardEmbed, AppEmbed, SearchBarEmbed, useEmbedRef } from '@thoughtspot/visual-embed-sdk/react';
import Moveable from "react-moveable";

function SpotIQPopup(props){
    const {
        primaryColor,
        secondaryColor
    } = props

    const [popupVisible,setPopupVisible] = useState('')
    const [popupConfig,setPopupConfig] = useState('')
    const [title,setTitle] = useState('')
    const [value,setValue] = useState('')
    const [noteText,setNoteText] = useState('')
    useEffect(() => {
        window.addEventListener('spotiq', function(e){
            setPopupVisible(true);
        })
      }, [])
    function togglePopupVisible(){
        setPopupVisible(false)
    }
    var disp = popupVisible ? 'flex' : 'none';

    var style = {
        display:disp,
        position:'absolute',
        top:'10%',
        left:'10%',
        width:'80%',
        height:'800px',
        borderRadius:'5px',
        boxShadow:'0px 0px 150px #cccccc',
        flexDirection:'column',
        background:'#ffffff'
    }
    var bannerColor = primaryColor;
    if (bannerColor =='#ffffff'){
        bannerColor = secondaryColor;
    }
    return (
        <div style={style} id="spotIQDiv">
            <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end'}}onClick={togglePopupVisible}>
                <div style={{background:'#eaedf2',borderRadius:'15px',display:'flex',alignItems:'center',justifyContent:'center',marginRight:'25px',marginTop:'15px',marginBottom:'15px'}}>
                <CloseIcon></CloseIcon>
                </div>
            </div>
            <div style={{flex:1}}>
            {popupVisible?
                <AppEmbed pageId={'spotiq'} frameParams={{width:'100%',height:'740px'}} ></AppEmbed>

            :null}
            </div>
         </div>
    )
}

function CloseIcon(){
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 24 24" width="24" fill="currentColor"><path d="M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z"></path></svg>  
}
export default SpotIQPopup;