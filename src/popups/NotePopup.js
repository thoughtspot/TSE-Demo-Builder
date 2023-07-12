import React, { useState, useEffect, setState } from 'react';

function NotePopup(props){
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
        window.addEventListener('popup', function(e){
            var dataTitle = ''
            var dataValue = ''
            var eventData = e.detail.data.data
            if (eventData){
                if (eventData.clickedPoint.selectedAttributes.length > 0){
                    dataValue = eventData.clickedPoint.selectedAttributes[0].value
                    dataTitle = eventData.clickedPoint.selectedAttributes[0].column.name
                }
                if (eventData.clickedPoint.selectedMeasures > 0){
                    dataValue = eventData.clickedPoint.selectedMeasures[0].value
                    dataTitle = eventData.clickedPoint.selectedMeasures[0].column.name
                }
            }
            setTitle(dataTitle)
            setValue(dataValue);
            setNoteText("");
            setPopupVisible(true);
        })
      }, [])
    function saveButton(){
        alert("Note saved: \n\n"+title+" - "+value+"\n\n"+noteText)
        setPopupVisible(false)

    }
    function togglePopupVisible(){
        setPopupVisible(false)
    }
    var disp = popupVisible ? 'flex' : 'none';

    var style = {
        display:disp,
        position:'absolute',
        top:'35%',
        left:'35%',
        width:'400px',
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
        <div style={style}>
            <div style={{position:'absolute',marginLeft:'370px',marginTop:'22px',color:'#999'}} onClick={togglePopupVisible}><CloseIcon /></div>
            <div style={{background:bannerColor,padding:'5px',height:'3px',borderRadius:'5px 5px 0px 0px'}}>
            </div>
            <div style={{padding:'10px 15px 10px 15px',color:'#343434'}}>
                <div style={{fontSize:'18px',fontWeight:500}}>{value}</div>
                <div style={{fontSize:'12px',fontWeight:'400',marginBottom:'10px'}}>{title}</div>
                <textarea style={{fontFamily:'Trebuchet MS',height:'130px',width:'360px',borderRadius:'5px',border:'2px solid #efefef'}} value={noteText} onChange={(e) => setNoteText(e.target.value)}></textarea>
                <div className="button" style={{border:'2px solid var(--secondary-color)',fontSize:'14px',marginTop:'10px',height:'45px',width:'80px',display:'flex',justifyContent:'center',alignItems:'center',background:'var(--primary-color)',color:'var(--secondary-color)'}} onClick={saveButton}>Save</div>
            </div>
         </div>
    )
}

function CloseIcon(){
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 24 24" width="24" fill="currentColor"><path d="M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z"></path></svg>  
}
export default NotePopup;