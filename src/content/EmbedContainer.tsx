import React from "react"
import { init,  AuthType, Page, EmbedEvent, Action, HostEvent, RuntimeFilterOp} from '@thoughtspot/visual-embed-sdk';
import { SearchEmbed, LiveboardEmbed, AppEmbed, SearchBarEmbed, useEmbedRef } from '@thoughtspot/visual-embed-sdk/react';
import AdvancedDemoPage from "./custom_demos/advanced/AdvancedDemoPage"
import Tabs from "./custom_demos/incidents/Tabs";
import Surveys from "./custom_demos/surveys/Surveys";
import SurveyRicky from "./custom_demos/surveys_ricky/SurveyRicky"
import ParameterDemo from "./custom_demos/parameter/ParameterDemo"
import ABTest from "./custom_demos/ab_test/ABTest";
import ProductDemo from "./custom_demos/product/Product";
import { PageName } from "../util/Types";
import { StyleOptionList, StyleOptions } from "../util/PreBuiltStyles";
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
  const startTime = Date.now()
  const trackEvent = (data) => {
    const eventTime = Date.now()
    console.log("Event Triggered", data, eventTime, eventTime - startTime)
  }
  function onEmbedRendered(data){
    const eventTime = Date.now()
    console.log("Event Triggered", data, eventTime, eventTime - startTime)
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
        const event = new CustomEvent('popup', {detail: {data: data}});
        window.dispatchEvent(event)
    })
    embedRef.current.on(EmbedEvent.VizPointClick, (data) => {
      console.log('single click',data);
    })
    embedRef.current.on(EmbedEvent.Drilldown, (data) => {
      console.log('drill click',data);
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
    embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, {
      
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

  var visibleActions: Action[] = []
  var disabledActions: Action[] = []
  var hideDataSources: boolean = false;
  var collapseDataSources: boolean = true;
  let contentStyle: StyleOptionList = undefined;
  //Scan Properties
  if (renderContent && (renderType==PageName.Liveboard || renderType==PageName.Answer || renderType==PageName.Search|| renderType==PageName.SearchString)){
    var contents = renderContent.split("|")
    if (contents.length>1){
      var propStartIdx = renderType==PageName.SearchString ? 2 : 1
      for (var i=propStartIdx;i<contents.length;i++){
        var contentProps = contents[i].split("=");
        console.log(contentProps,"contentProps")
        if (contentProps.length>1){
          var property = contentProps[0]
          console.log(property,"visibleAction",property=="visibleAction")

          var propertyValue = contentProps[1]
          if (property == 'visibleAction'){
            visibleActions.push(Action[propertyValue.split("Action.")[1]])
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
          if (property == 'style'){
            contentStyle = propertyValue as StyleOptionList
            
          }
        }
      }
    }
  }    
  let cssStyle = undefined;
  let cssURL = '';
  let isURL = false;
  if (contentStyle && contentStyle != StyleOptionList.None){
    let styleOption = StyleOptions.filter((style) => style.name == contentStyle)[0]
    if (styleOption.customCssUrl){
      cssURL = styleOption.customCssUrl
      isURL = true
    }else{
      cssStyle = styleOption.customizations
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
        visibleActions={visibleActions.length>0 ? visibleActions : null}  
        disabledActions={disabledActions.length>0 ? disabledActions : null} 
        dataSources={renderContents} 
        enableSearchAssist={true}
        hideDataSources={hideDataSources} 

        frameParams={{width:'100%',height:'100%'}}
    />
  }

  let runtimeFilters = [
    {
      columnName: 'Property',
      columnOp: RuntimeFilterOp.IN,
      values: ['1234','1234','2345']
    },
    {
      columnName: 'Region',
      columnOp: RuntimeFilterOp.IN,
      values: ['east','west']
    }

  ]
  if (renderType==PageName.Liveboard){
    renderPage = <LiveboardEmbed 
        ref={embedRef} 
        onLiveboardRendered={onEmbedRendered}
        visibleActions={visibleActions.length>0 ? visibleActions : null}  
        disabledActions={disabledActions.length>0 ? disabledActions : null}  
        runtimeFilters={runFilters}  
        onAuthInit={trackEvent}
        onData={trackEvent}
        onLoad={onEmbedRendered}
        customizations={isURL ? undefined : cssStyle}
        liveboardId={renderContent.split("|")[0]} 
        frameParams={{width:'100%',height:'100%'}}
  />
  }
  ///Hide for mani
  if (renderType==PageName.Answer){
    renderPage = <SearchEmbed ref={embedRef} 
        visibleActions={visibleActions.length>0 ? visibleActions : null}  
        disabledActions={disabledActions.length>0 ? disabledActions : null}  
        onLoad={onEmbedRendered}  
        hideDataSources={hideDataSources}  
        runtimeFilters={runFilters}  
        answerId={renderContent.split("|")[0]} 
        frameParams={{width:'100%',height:'100vh'}}
    />
  }
  if (renderType==PageName.SearchString){
    var searchString = buildSearchString(renderContent.split("|")[0], searchFields, runFilters)
    var searchOptions = {
      searchTokenString: searchString,
      executeSearch: true,
    }
    var dataSources = renderContent.split("|")[1].split(",");
    renderPage = <SearchEmbed 
          onLoad={onEmbedRendered}
          ref={embedRef}  
          enableSearchAssist={true}
          dataSources={dataSources} 
          visibleActions={visibleActions.length>0 ? visibleActions : null}  
          disabledActions={disabledActions.length>0 ? disabledActions : null}  
          hideDataSources={hideDataSources} 
          searchOptions={searchOptions} 
          frameParams={{width:'100%',height:'100vh'}}
    />
  }
  if (renderType==PageName.App){
    renderPage = <AppEmbed pageId={{

    }[renderContent]} frameParams={{width:'100%',height:'100%'}} />
  }
  if (renderType==PageName.URL){
    //renderPage = <ClientWebsite url={renderContent}></ClientWebsite>
    renderPage = <iframe  style={{width:'100%',height:'100%',border:'none'}} src={renderContent}></iframe>
  }
  if (renderType==PageName.Image){
    renderPage = 
    <div style={{height:'100%',width:'100%',overflow:'auto'}}>
      <img  style={{width:'100%',border:'none'}} src={renderContent}></img>
    </div>

  }if (renderType==PageName.OnImageViz){
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
  if (renderType==PageName.Advanced){
    //renderPage = <ClientWebsite url={renderContent}></ClientWebsite>
    renderPage = <AdvancedDemoPage  worksheet={renderContent}></AdvancedDemoPage>
  }
  if (renderType==PageName.Tabbed){
    renderPage = <Tabs tsURL={url}></Tabs>
  }
  if (renderType==PageName.Survey){
    renderPage = <Surveys tsURL={url}></Surveys>
  }
  if (renderType==PageName.ABTest){
    renderPage = <ABTest tsURL={url}></ABTest>
  }
  // if (renderType=='Survey Demo Ricky'){
  //   renderPage = <SurveyRicky tsURL={url}></SurveyRicky>
  // }
  if (renderType=='ParamDemo'){
    renderPage = <ParameterDemo tsURL={url}></ParameterDemo>
  }
  if (renderType==PageName.ProductList){
    renderPage = <ProductDemo tsURL={url}></ProductDemo>
  }
  return (
      <div id={renderType!=PageName.Survey ? "TSContainer" : null} style={{height:'100%',width:'100%'}} key={renderKey}>
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
