import React from "react"
import { init,  AuthType, Page, EmbedEvent, Action, HostEvent} from '@thoughtspot/visual-embed-sdk';
import { SearchEmbed, LiveboardEmbed, AppEmbed, SearchBarEmbed, useEmbedRef } from '@thoughtspot/visual-embed-sdk/react';
import AdvancedDemoPage from "../custom_demos/advanced/AdvancedDemoPage"
import Tabs from "../custom_demos/incidents/Tabs";
import Surveys from "../custom_demos/surveys/Surveys";
import SurveyRicky from "../custom_demos/surveys_ricky/SurveyRicky"
export default function EmbedContainer(props){

  const {
    url,
    renderType,
    renderContent,
    embedRef,
    links,
    searchFields,
    runFilters,
    isHorizontal,
    renderKey
  } = props

  function onEmbedRendered(){
    embedRef.current.on(EmbedEvent.Data,(data) => {
      console.log("data!",data)
      //loadRestContent();
    })
    embedRef.current.on(EmbedEvent.QueryChanged,(resp) => {
      console.log("data!",resp)
      // const event = new CustomEvent('popup', {detail: {data: resp.data.search}});
      // window.dispatchEvent(event)
  })
    embedRef.current.on(EmbedEvent.VizPointDoubleClick, (data) => {
        console.log('>>> called !!', data);
        const event = new CustomEvent('popup', {detail: {data: data}});
        window.dispatchEvent(event)
    })
    embedRef.current.on(EmbedEvent.VizPointClick, (data) => {
      console.log('single click',data);
    })
    embedRef.current.on(EmbedEvent.SpotIQAnalyze, (data) => {
      const event = new CustomEvent('spotiq', {detail: {data: data}});
      window.dispatchEvent(event)
    })
    embedRef.current.on(EmbedEvent.Save, (data) => {
      const event = new CustomEvent('save', {detail: {data: data}});
      window.dispatchEvent(event)
   
    })
    embedRef.current.on(EmbedEvent.MakeACopy, (data) => {
      const event = new CustomEvent('save', {detail: {data: data}});
      window.dispatchEvent(event)
   
    })

    embedRef.current.on(EmbedEvent.CustomAction, (payload) => {
      console.log(payload)
      var data = payload.data.embedAnswerData.data[0].columnDataLite
      var alertString = "Action Triggered: "+ payload.data.id
      for (var col in data){
        alertString+= "\n\n"+data[col].dataValue.join(", ")
      }
      alert(alertString);
    })
  }

  var enabledActions = []
  var disabledActions = []
  var hideDataSources = true;
  var collapseDataSources = false;
  //Scan Properties
  if (renderContent && (renderType=='Liveboard' || renderType=='Answer' || renderType=='Search'|| renderType=='Search String')){
    var contents = renderContent.split("|")
    if (contents.length>1){
      var propStartIdx = renderType=='Search String' ? 2 : 1
      for (var i=propStartIdx;i<contents.length;i++){
        var contentProps = contents[i].split("=");
        if (props.length>1){
          var property = contentProps[0]
          var propertyValue = contentProps[1]
          if (property == 'enableAction'){
            enabledActions.push(Action[propertyValue.split("Action.")[1]])
          }
          if (property == 'disableAction'){
            disabledActions.push(Action[propertyValue.split("Action.")[1]])
          }
          if (property == 'hideDataSources'){
            hideDataSources = propertyValue.toLowerCase() == 'true'
          }
          if (property == 'collapseDataSources'){
            collapseDataSources = propertyValue.toLowerCase() == 'true'
          }
        }
      }
    }
  }    


  var renderPage = <div></div>
  if (!renderType && links){
    var firstLink =  links[0]
    //renderLink(settings.linkTypes[firstLink],settings.linkContents[firstLink],settings.linkNames[firstLink])
  }
  if (renderType=='Search'){
    var renderContents=null
    if (renderContent && renderContent.length>0){
      renderContents = renderContent.split("|")[0].split(",")
    }
    renderPage = <SearchEmbed 
        ref={embedRef} 
        onLoad={onEmbedRendered}
        disabledActions={disabledActions.length>0 ? disabledActions : null} 
        dataSources={renderContents} 
        hideDataSources={hideDataSources} 
        frameParams={{width:'100%',height:'100%'}}
    />
  }
  if (renderType=='Liveboard'){
    renderPage = <LiveboardEmbed 
        ref={embedRef} 
        onLiveboardRendered = {onEmbedRendered}
        disabledActions={disabledActions.length>0 ? disabledActions : null}  
        runtimeFilters={runFilters}  
        liveboardId={renderContent.split("|")[0]} 
        frameParams={{width:'100%',height:'100%'}}
    />
  }
  ///Hide for mani
  if (renderType=='Answer'){
    renderPage = <SearchEmbed ref={embedRef} 
        disabledActions={disabledActions.length>0 ? disabledActions : null}  
        onLoad={onEmbedRendered}  
        hideDataSources={hideDataSources}  
        runtimeFilters={runFilters}  
        answerId={renderContent.split("|")[0]} 
        frameParams={{width:'100%',height:'100vh'}}
    />
  }
  if (renderType=='Search String'){
    var searchString = buildSearchString(renderContent.split("|")[0], searchFields, runFilters)
    console.log("init search String",searchString)
    var searchOptions = {
      searchTokenString: searchString,
      executeSearch: true,
    }
    var dataSources = renderContent.split("|")[1].split(",");
    
    renderPage = <SearchEmbed 
          onLoad={onEmbedRendered}
          ref={embedRef}  
          dataSources={dataSources} 
          hideDataSources={hideDataSources} 
          searchOptions={searchOptions} 
          frameParams={{width:'100%',height:'100vh'}}
    />
  }
  if (renderType=='App'){
    renderPage = <AppEmbed pageId={{

    }[renderContent]} frameParams={{width:'100%',height:'100%'}} />
  }
  if (renderType=='URL'){
    //renderPage = <ClientWebsite url={renderContent}></ClientWebsite>
    renderPage = <iframe  style={{width:'100%',height:'100%',border:'none'}} src={renderContent}></iframe>
  }
  if (renderType=="Image"){
    renderPage = 
    <div style={{height:'100%',width:'100%',overflow:'auto'}}>
      <img  style={{width:'100%',border:'none'}} src={renderContent}></img>
    </div>

  }if (renderType=="OnImageViz"){
    var addedHeight = isHorizontal ? "75px" : "0px"; 
    renderPage = 
    <div style={{height:'100%',width:'100%',overflow:'auto'}}>
      <img  style={{width:'100%',border:'none'}} src={renderContent.image}></img>
      <div style={{position:'absolute',top:"calc("+renderContent.box.y+"% + "+addedHeight+")",left:renderContent.box.x+"%",width:renderContent.box.width+"%",height:renderContent.box.height+"%"}}>
      <LiveboardEmbed 
        ref={embedRef} 
        onLiveboardRendered = {onEmbedRendered}
        vizId={renderContent.config.split("|")[1]}
        liveboardId={renderContent.config.split("|")[0]} 
        frameParams={{width:'100%',height:'100%'}}
    />
      </div>

    </div>
  }
  if (renderType=='Advanced'){
    //renderPage = <ClientWebsite url={renderContent}></ClientWebsite>
    renderPage = <AdvancedDemoPage  worksheet={renderContent}></AdvancedDemoPage>
  }
  if (renderType=='Custom Demos'){
    renderPage = <Tabs tsURL={url}></Tabs>
  }
  if (renderType=='Survey Demo'){
    renderPage = <Surveys tsURL={url}></Surveys>
  }
  if (renderType=='Survey Demo Ricky'){
    renderPage = <SurveyRicky tsURL={url}></SurveyRicky>
  }
  
  return (
      <div id={renderType!='Survey Demo' ? "TSContainer" : null} style={{height:'100%'}} key={renderKey}>
          {renderPage}
      </div>
  )
}


function buildSearchString(baseSearchString,searchingFields,filteringFields){
  var filterString = ""
  if (searchingFields){
    for (var key of Object.keys(searchingFields)){
      for (var field of searchingFields[key]){
        filterString+=" "+field
    } 
    }
  }
  if (filteringFields){
    for (var filter of filteringFields){
      var filterVals = filter.values
      if (filter.operator == "BW_INC"){
        var startDate =  new Date(filterVals[0]*1000)
        var endDate =  new Date(filterVals[1]*1000)
        var startDay = ((startDate.getMonth() > 8) ? (startDate.getMonth() + 1) : ('0' + (startDate.getMonth() + 1))) + '/' + ((startDate.getDate() > 9) ? startDate.getDate() : ('0' + startDate.getDate())) + '/' + startDate.getFullYear()
        var endDay = ((endDate.getMonth() > 8) ? (endDate.getMonth() + 1) : ('0' + (endDate.getMonth() + 1))) + '/' + ((endDate.getDate() > 9) ? endDate.getDate() : ('0' + endDate.getDate())) + '/' + endDate.getFullYear()

        filterString+=" ["+filter.columnName+"] > '"+startDay+"'"
        filterString+=" ["+filter.columnName+"] < '"+endDay+"'"
      }
      else{
        for (var val of filterVals){

            filterString+=" ["+filter.columnName+"].'"+val+"'"
          
        }
      }
    }
  }
  var searchString = baseSearchString+filterString
  return searchString
}
