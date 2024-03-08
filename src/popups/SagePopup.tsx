import React, { useState, useEffect } from 'react';
import { SearchEmbed, LiveboardEmbed, AppEmbed, SearchBarEmbed, useEmbedRef, SageEmbed } from '@thoughtspot/visual-embed-sdk/react';
import Moveable from "react-moveable";

function SagePopup(props){
    const {
        primaryColor,
        secondaryColor,
    } = props

    const [popupVisible,setPopupVisible] = useState(false)
    const [popupConfig,setPopupConfig] = useState('')
    const [title,setTitle] = useState('')
    const [value,setValue] = useState('')
    const [noteText,setNoteText] = useState('')
    const [worksheetID, setWorksheetID] = useState('')
    const [sageQuestion ,setSageQuestion] = useState('')
    useEffect(() => {
        window.addEventListener('sage', function(e: any){
            setPopupVisible(true);
            console.log(e.detail.data)
            setSageQuestion(e.detail.data);

        })
      }, [])
    function togglePopupVisible(){
        setPopupVisible(false)
    }
    var disp = popupVisible ? 'flex' : 'none';

    var style = {
        display:disp,
        position:'absolute',
        bottom:'10%',
        right:'25px',
        width:'800px',
        height:'80%',
        borderRadius:'15px',
        borderWidth:2,
        boxShadow:'0px 0px 150px #cccccc',
        flexDirection:'column',
        background:'#ffffff'
    }
    //      <div  className="shadow-lg bg-white flex-col p-4 space-y-2"  style={{width:'450px',height:'150px',display:'flex',position:'absolute',bottom:'110px',right:'25px', borderWidth:2, borderRadius:'15px'}} >

    var bannerColor = primaryColor;
    if (bannerColor =='#ffffff'){
        bannerColor = secondaryColor;
    }
    return (
        //@ts-ignore
        <div style={style} id="spotIQDiv">
            <div style={{height:'24px',display:'flex',alignItems:'center',justifyContent:'flex-end'}}onClick={togglePopupVisible}>
                <div className="mt-6" style={{background:'#eaedf2',borderRadius:'15px',display:'flex',alignItems:'center',justifyContent:'center',marginRight:'25px'}}>
                <CloseIcon></CloseIcon>
                </div>
            </div>
            <div className='p-4'>
            <SageQuestionInput defaultValue={sageQuestion} triggerSageSearch={(data)=>setSageQuestion(data)}></SageQuestionInput>
            </div>
            <div style={{flex:1}}>
            {popupVisible?
                <SageEmbed dataSource={worksheetID} 
                searchOptions={{
                    searchQuery: sageQuestion,
                    executeSearch: sageQuestion!='' ? true : false
                  }}
                customizations={{
                    style: {
                    customCSS: {
                        variables: {
                        "--ts-var-root-background": "#ffffff",
                        "--ts-var-viz-border-radius": "25px",
                        },
                        rules_UNSTABLE: {
                            '.eureka-search-bar-module__sageEmbedSearchBarWrapper':{
                                'display': 'none !important'
                            },
                            '[data-testid="pinboard-header"]': {
                                'display': 'none !important'
                            },
                            '.ReactModalPortal .ReactModal__Overlay':{
                                'background-color': '#ffffff00 !important'
                            },
                            '.answer-module__searchCurtain':{
                                'background-color': '#ffffff00 !important'
                            },
                            '[data-testid="eureka-ai-answer-header"]':{
                                'display': 'none !important'
                            },
                            '[data-testid="answer-content-loading-indicator"], .eureka-ai-answer-module__aiExpandedAnswerWrapper': {
                                'min-height':'400px',
                                'height':'400px'
                            },
                            '.eureka-ai-answer-module__aiAnswerFooter':{
                                'margin-top':'170px'
                            },
                            '.eureka-ai-answer-title-description-module__aiAnswerSummary':{
                                'padding' :'0 1.4285714286rem 0 !important'
                            },
                            '.eureka-ai-answer-module__aiAnswerContainer':{
                                'margin':'0 1.7142857143rem !important'
                            }
                        }
                        
                    }
                    }
                }}
                frameParams={{width:'100%',height:'100%'}} ></SageEmbed>

            :null}
            </div>
         </div>
    )
}

function CloseIcon(){
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 24 24" width="24" fill="currentColor"><path d="M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z"></path></svg>  
}
export default SagePopup;

function SageQuestionInput(props){

    const {
        defaultValue,
        triggerSageSearch
    } = props
    const [sageSearch, setSageSearch] = useState('')
    return (
        <div>
        <div className="flex w-full h-12 bg-white border-slate-400 border rounded-2xl my-2 p-2"> 
                  <input onKeyUp={(e)=>{
                      if (e.key === 'Enter' || e.keyCode === 13) {
                          triggerSageSearch();
                      }
                  }} onChange={(e)=>setSageSearch(e.target.value)} value={sageSearch == '' ? defaultValue : sageSearch} placeholder="Ask AI a Data Question" 
                  className="rounded-2xl w-full pl-2 bg-white border-none outline-none"></input>
                  <div onClick={triggerSageSearch} className="ml-auto text-white  flex items-center bg-blue-400 hover:bg-blue-300 rounded-lg px-4 py-2 border-none">
                      {/* <HiMiniPlay className="mr-2" /> Icon next to "GO" */}
                      GO!
                  </div>
              </div>
        </div>
    )
}