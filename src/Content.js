import React, { useState, useEffect, setState } from 'react';
import { init,  AuthType, Page, EmbedEvent, Action, HostEvent} from '@thoughtspot/visual-embed-sdk';
import { SearchEmbed, LiveboardEmbed, AppEmbed, useEmbedRef } from '@thoughtspot/visual-embed-sdk/react';
import { MultiSelect } from "react-multi-select-component";
import NotePopup from './NotePopup';
import ClientWebsite from './ClientWebsite'
import AdvancedDemoPage from './advanced_demo/AdvancedDemoPage';
function Content(props) {
const {
  settings,
  showSettings
} = props
const thoughtspot_URL = "https://se-thoughtspot-cloud.thoughtspot.cloud/#/" 

const [renderType, setRenderType] = useState('')
const [renderContent, setRenderContent] = useState('')
const [renderName, setRenderName] = useState('')
const [runFilters, setRunFilters] = useState('')
const [selectedFilters, setSelectedFilters] = useState('')
const [filterKey, setFilterKey] = useState('')
const [renderKey, setRenderKey] = useState('')
const [searchFields , setSearchFields] = useState('')
const embedRef = useEmbedRef();
const [popupVisible, setPopupVisible] = useState('')
const [popupConfig, setPopupConfig] = useState('')
const [token,setToken]=useState('')
const [restLiveboards,setRestLiveboards] = useState('')
const [restAnswers,setRestAnswers] = useState('')

const MemorizedSearchEmbed = React.memo(SearchEmbed);

function togglePopupVisible(){
  setPopupVisible(!popupVisible)
}

useEffect(() => {
  if (settings.URL){
    console.log(settings.URL)
    try {
      init({
        thoughtSpotHost: settings.URL,
        authType: AuthType.None,
        customCssUrl: 'cdn.jsdelivr.net/gh/piduguSai/TS-Custom-CSS@main/TS-custom-styles.css',
        callPrefetch: true,
      });
    }
    catch(err){
      alert("could not connect to thoughtspot")
    }
    if (settings.username){
      
      //getToken()
    }
  }

  loadDefaultFilters();
  loadRestContent();


}, [])
function loadDefaultFilters(){
  var defaultFilters = {}
  if (settings.links){
    var filterObjs = []
    var defaultsFound = false;
    for (var link of settings.links){
      if (settings.linkTypes[link]=='Filter'){
        var filterContent = settings.linkContents[link].split("|")
        var filterName = settings.linkNames[link]
        if (filterContent.length>1){
          for (var i=1;i<filterContent.length;i++){
            var prop = filterContent[i].split("=")[0]
            var val  = filterContent[i].split("=")[1]
            if (prop=='default'){
              var filterObj  = {
                columnName: filterName,
                operator: 'IN',
                values: [val]
              }
              defaultFilters[filterName] = [{label:val,value:val}]
              filterObjs.push(filterObj)
              defaultsFound=true;
            }
          }
        }
      }
    }
  }
  if (defaultsFound){
    setRunFilters(filterObjs);
    setSelectedFilters(defaultFilters)
  } 
  if (!runFilters && !defaultsFound) setRunFilters([])
  if (!selectedFilters && !defaultsFound)  setSelectedFilters({})
}
function renderLink(type,content,name){
  setRenderContent(content);
  setRenderType(type);
  setRenderName(name);
  setRenderKey(Date.now())
  var newRunFilters = []
    
  //Only keep filter values if that filter exists in the new content
  for (var link of settings.links){
    if ((settings.linkTypes[link]=='Filter' || settings.linkTypes[link]=='Field') && settings.linkParents[link]==name){ 
      for (var filter of runFilters){
          if (filter.columnName == settings.linkNames[link]){
            newRunFilters.push(filter)
          }
      }
    }
  }
  setRunFilters(newRunFilters)
}
function buildSearchString(searchingFields,filteringFields){
  if (!searchingFields) searchingFields = searchFields
  if (!filteringFields) filteringFields = runFilters

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
      for (var val of filterVals){
        filterString+=" ["+filter.columnName+"].'"+val+"'"
      }
    }
  }
  var searchString = renderContent.split("|")[0]+filterString
  return searchString
}


function setField(key,fields){
    // embedRef.current.trigger(HostEvent.Search, {
  //   searchQuery: buildSearchString(fields, null),
  //   executeSearch: true,

  // });
  setSearchFields({ ...searchFields, [key]: fields });
}
// =============
// REST CONTENT
// =============
async function loadRestContent(){
  var restConfigs = []
  for (var link of settings.links){
    if (settings.linkTypes[link]=='Rest'){
      var type = "all"
      var restURLParams = "" 
      var catType = "ALL"
      var batchsize = 5
      if (settings.linkContents[link]){
        var params = settings.linkContents[link].split("|")
        for (var param of params){
          var paramKey = param.split("=")[0]
          var paramVal = param.split("=")[1]
          if (paramKey=="type"){
            type = paramVal
          }
          if (paramKey=="sort"){
            restURLParams+="&sort="+paramVal
          }
          if (paramKey=="tags"){
            restURLParams+="&tagname="+encodeURIComponent(JSON.stringify(paramVal.split(",")));
          }
          if (paramKey=="category"){
            catType = paramVal.toUpperCase();
          } 
      }    
      }
      restURLParams+="&category="+catType+"&batchsize="+batchsize;
      restConfigs.push({type:type,link:link,restURLParams:restURLParams})
    }
  }
  if (restConfigs.length>0){
    var restAnswersCopy = {}
    var restLiveboardsCopy = {}
    for (var config of restConfigs){
      if (config.type=='all' || config.type=='liveboard'){
        var liveboards = await getLiveboards(config.restURLParams);
      }
      if (config.type=='all' || config.type=='answer'){
        var answers = await getAnswers(config.restURLParams)
      }
      if (liveboards && liveboards.length>0){
        restLiveboardsCopy[config.link] = liveboards 
      }
      if (answers && answers.length>0){
        restAnswersCopy[config.link] = answers
      }
    }
    setRestLiveboards(restLiveboardsCopy)
    setRestAnswers(restAnswersCopy)
  }
}
async function getLiveboards(restURLParams){
  var baseURL = settings.URL.replace("#/","").replace("#","")
  return await fetch(baseURL+"callosum/v1/tspublic/v1/metadata/list?type=PINBOARD_ANSWER_BOOK"+restURLParams,
  {
    credentials: 'include',
  })
  .then(response => response.json()).then(
    data => data.headers)
}
async function getAnswers(restURLParams){
  var baseURL = settings.URL.replace("#/","").replace("#","")
  return await fetch(baseURL+"callosum/v1/tspublic/v1/metadata/list?type=QUESTION_ANSWER_BOOK"+restURLParams,
  {
    credentials: 'include',
  })
  .then(response => response.json()).then(
    data => data.headers)
}

function setFilter(newFilterObj){
  var filterObjs = runFilters;
  var found = false;
  for (var i=0;i<filterObjs.length;i++){
    var filterObj = filterObjs[i]
    if (!filterObj) continue;
    if (filterObj.columnName == newFilterObj.columnName){
      filterObjs[i] = newFilterObj
      found = true;
    }
  }
  if (!found){
    filterObjs.push(newFilterObj)
  }
  if (renderType=='Liveboard'){
    embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, filterObjs);
  }else{
    setRunFilters(filterObjs);
    setRenderKey(Date.now())
    // embedRef.current.trigger(HostEvent.Search, {
    //   searchQuery: buildSearchString(null,filterObjs)
    // });
  }

}
function onEmbedRendered(){
  embedRef.current.on(EmbedEvent.MakeACopy,(data) => {
    console.log("copy!")
    //loadRestContent();
  })
  embedRef.current.on(EmbedEvent.Data,(data) => {
    console.log("data!",data)
    //loadRestContent();
  })
  embedRef.current.on(EmbedEvent.VizPointDoubleClick, (data) => {
      console.log('>>> called', data);
      const event = new CustomEvent('popup', {detail: {data: data}});
      window.dispatchEvent(event)
  })
  embedRef.current.on(EmbedEvent.VizPointClick, (data) => {
    console.log('single click',data);
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





var isHorizontal = (settings.orientation=='Horizontal') 

if (settings.links){
  var linkContainers = []
  var topLevel = []
  for (var link of settings.links){
    if (!settings.linkParents[link] || settings.linkParents[link]=='None'){
      topLevel.push(link)
    }
  }
  for (var link of topLevel){
    var childrenLinks = []
    console.log("rest answers",restAnswers,restLiveboards)
    if (settings.linkTypes[link]=='Rest' && restAnswers && restAnswers[link]){
      for (var contentItem of restAnswers[link]){
        childrenLinks.push(
          <LinkContainer
          key={contentItem.id}
          id={contentItem.id}
          name={contentItem.name}
          content={contentItem.id}
          type="Answer"
          renderLink={renderLink}
          isHorizontal={isHorizontal}
        />
        )       
      }
    }
    if (settings.linkTypes[link]=='Rest' && restLiveboards && restLiveboards[link]){
      for (var contentItem of restLiveboards[link]){
        childrenLinks.push(
          <LinkContainer
          key={contentItem.id}
          id={contentItem.id}
          name={contentItem.name}
          content={contentItem.id}
          type="Liveboard"
          renderLink={renderLink}
          isHorizontal={isHorizontal}
        />
        )       
      }
    }
    for (var child of settings.links){
      if (settings.linkParents[child]==settings.linkNames[link]){
        childrenLinks.push(
          <LinkContainer
          key={child}
          id={child}
          name={settings.linkNames[child]}
          content={settings.linkContents[child]}
          type={settings.linkTypes[child]}
          renderLink={renderLink}
          isHorizontal={isHorizontal}
        />
        )
      }
    }
    linkContainers.push(<LinkContainer
      key={link}
      id={link}
      name={settings.linkNames[link]}
      content={settings.linkContents[link]}
      type={settings.linkTypes[link]}
      renderLink={renderLink}
      children={childrenLinks}
      isHorizontal={isHorizontal}
    />)
  }
}
var filters = []
if (settings.links){
  for (var link of settings.links){
    if ((settings.linkTypes[link]=='Filter' || settings.linkTypes[link]=='Field') && settings.linkParents[link]==renderName){
      var filterContent = settings.linkContents[link].split("|")
      var  hasSelectAll = true;
      var filterValues = filterContent[0].split(',')
      var filterLabels = []
      
      if (settings.linkTypes[link]=='Field'){
        var filterOptions = []
        for (var val of filterValues){
          filterOptions.push(val.split(":")[0])
          filterLabels.push(val.split(":")[1])
        }
        filterValues = filterOptions
      }else{
        filterLabels = filterValues
      }
      var filterName = settings.linkNames[link]
      if (filterContent.length>1){
        for (var i=1;i<filterContent.length;i++){
          var prop = filterContent[i].split("=")[0]
          var val  = filterContent[i].split("=")[1]
          if (prop=='selectAll'){
            if (val=='false'){
              hasSelectAll=false;  
            }
          }
        }
      }
      var filterType = 'Filter'
      if (settings.linkTypes[link]=='Field'){
        filterType='Field'
      }
      var options = []
      for (var val in filterValues){
        options.push({'value':filterValues[val],'label':filterLabels[val]})
      }
      
      if (selectedFilters[filterName]){
        filters.push(<Filter type={filterType} setField={setField} hasSelectAll={hasSelectAll} filterName={filterName} options={options} setFilter={setFilter} defaultValues={selectedFilters[filterName]}></Filter>)
        //ilters.push(<MultiSelect multi={true} hasSelectAll={hasSelectAll} value={selectedFilters[filterName]} options={options} placeholder={"Select "+filterName} onChange={setFilter} overrideStrings={overrideStrings}/>)
      }else{
        filters.push(<Filter type={filterType} setField={setField}  hasSelectAll={hasSelectAll} filterName={filterName} options={options} setFilter={setFilter}></Filter>)
        //filters.push(<MultiSelect multi={true} hasSelectAll={hasSelectAll} options={options} placeholder={"Select "+filterName} onChange={setFilter} overrideStrings={overrideStrings}/>)
      }
      
    }
  }
}

//Set primary CSS variables for page
document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);

//Style filter dropdown with CSS variables
if (!isHorizontal){
  document.documentElement.style.setProperty('--rmsc-p', '8px');
  document.documentElement.style.setProperty('--rmsc-radius', '3px');
  document.documentElement.style.setProperty('--rmsc-h', '30px');
  document.documentElement.style.setProperty('--dropdown-width', '130px');
  document.documentElement.style.setProperty('--dropdown-container-right-margin', '0px');
  document.documentElement.style.setProperty('--dropdown-container-bottom-margin', '10px');
  document.documentElement.style.setProperty('--dropdown-left-margin', '130px');
  document.documentElement.style.setProperty('--dropdown-top-margin', '-240px');
  document.documentElement.style.setProperty('--dropdown-top-margin', '-240px');
  document.documentElement.style.setProperty('--dropdown-max-height', '240px');

}else{
  document.documentElement.style.setProperty('--rmsc-p', '8px');
  document.documentElement.style.setProperty('--rmsc-radius', '3px');
  document.documentElement.style.setProperty('--rmsc-h', '30px');
  document.documentElement.style.setProperty('--dropdown-width', '150px');
  document.documentElement.style.setProperty('--dropdown-container-right-margin', '10px');
  document.documentElement.style.setProperty('--dropdown-container-bottom-margin', '0px');
  document.documentElement.style.setProperty('--dropdown-left-margin', '0px');
  document.documentElement.style.setProperty('--dropdown-top-margin', '0px');
  document.documentElement.style.setProperty('--dropdown-max-height', '500px');
}

var enabledActions = []
var disabledActions = []
var hideDataSources = true;
//Scan Properties
if (renderContent && (renderType=='Liveboard' || renderType=='Answer' || renderType=='Search')){
  var contents = renderContent.split("|")
  if (contents.length>1){
    for (var i=1;i<contents.length;i++){
      var props = contents[i].split("=");
      if (props.length>1){
        var prop = props[0]
        var val = props[1]
        if (prop == 'enableAction'){
          enabledActions.push(Action[val.split("Action.")[1]])
        }
        if (prop == 'disableAction'){
          disabledActions.push(Action[val.split("Action.")[1]])
        }
        if (prop == 'hideDataSources'){
          console.log(val.toLowerCase(), "ahdsfasd")
          hideDataSources = val.toLowerCase() == 'true'
        }
      }
    }
  }
}


var renderPage = <div></div>
if (!renderType && settings && settings.links){
  var firstLink =  settings.links[0]
  //renderLink(settings.linkTypes[firstLink],settings.linkContents[firstLink],settings.linkNames[firstLink])
}
if (renderType=='Search'){
  var renderContents=null
  if (renderContent && renderContent.length>0){
    renderContents = renderContent.split("|")[0].split(",")
  }
  renderPage = <MemorizedSearchEmbed 
      enabledActions={enabledActions.length>0 ? enabledActions : null} 
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
      enabledActions={enabledActions.length>0 ? enabledActions : null} 
      disabledActions={disabledActions.length>0 ? disabledActions : null}  
      hideDataSources={true}  
      runtimeFilters={runFilters}  
      liveboardId={renderContent.split("|")[0]} 
      frameParams={{width:'100%',height:'100%'}}
  />
}
///Hide for mani
if (renderType=='Answer'){
  renderPage = <MemorizedSearchEmbed ref={embedRef} 
      enabledActions={enabledActions.length>0 ? enabledActions : null} 
      disabledActions={disabledActions.length>0 ? disabledActions : null}  
      onLoad={onEmbedRendered}  
      hideDataSources={hideDataSources}  
      answerId={renderContent.split("|")[0]} 
      frameParams={{width:'100%',height:'100vh'}}
  />
}
if (renderType=='Search String'){
  var searchString = buildSearchString()
  console.log("init search String",searchString)
  var searchOptions = {
    searchTokenString: searchString,
    executeSearch: true,
  }
  var dataSources = renderContent.split("|")[1].split(",");
  
  renderPage = <SearchEmbed ref={embedRef}  dataSources={dataSources} hideDataSources={hideDataSources} searchOptions={searchOptions} frameParams={{width:'100%',height:'100vh'}}
  />
}
if (renderType=='App'){
  renderPage = <AppEmbed pageId={renderContent} frameParams={{width:'100%',height:'100%'}} />
}
if (renderType=='URL'){
  //renderPage = <ClientWebsite url={renderContent}></ClientWebsite>
  renderPage = <iframe  style={{width:'100%',height:'100%',border:'none'}} src={renderContent}></iframe>
}
if (renderType=='Advanced'){
  //renderPage = <ClientWebsite url={renderContent}></ClientWebsite>
  renderPage = <AdvancedDemoPage  worksheet={renderContent}></AdvancedDemoPage>
}
document.title = settings.name


function openTS(){
  window.open(settings.URL,'_blank')
}
function openGit(){
  window.open('https://github.com/hannsta/TSE-Demo-Builder','_blank')
}


return (
  <div style={isHorizontal ? horizontalContainer : verticalContainer}>
      <div style={isHorizontal ? topMenu : leftMenu}>
        <div style={isHorizontal ? logoImageHolderHorizontal: logoImageHolderVertical}>
          <img src={settings.logoImage} style={isHorizontal ? horizontalLogoImage : verticalLogoImage}></img>
        </div>
        <div>
        <NotePopup  popupVisible={popupVisible} togglePopupVisible={togglePopupVisible} popupConfig={popupConfig} primaryColor={settings.primaryColor} secondaryColor={settings.secondaryColor}></NotePopup> 
      </div>
        {linkContainers}
        <div style={isHorizontal ? horizontalIcons : verticalIcons}>
          {!isHorizontal ? <div style={{margin:'10px',}}>
              {filters}
            </div> : <div></div>}
          <div style={{display:'flex',flexDirection:'row',alignItems:'center', marginTop:'15px', marginBottom:'10px'}}>
          {isHorizontal ? <div style={{display:'flex',flexDirection:'row',padding:'10px',}}>
            {filters}
          </div> : <div></div>}
            <div onClick={showSettings} style={{marginRight:'5px'}}>
            <SettingsIcon />
            </div>
            <div style={{width:'30px',height:'30px',marginRight:'5px'}} onClick={openTS} >
            <TSLogo />
            </div>
            <div style={{width:'22px',height:'22px', marginRight:'5px'}} onClick={openGit}>
            <GitHubLogo/>
            </div>
          </div>
        </div>

      </div>
      <div id="TSContainer" style={{height:'100%'}} key={renderKey}>
        {renderPage}
      </div>
  </div>
)
}
function LinkContainer(props){
  const {
    id,
    name,
    content,
    type,
    renderLink,
    children,
    isHorizontal
  } = props
  
  const [hoverVisible, setHoverVisible] = useState('')

  function handleLinkClick(){
    renderLink(type, content, name)
  }
  var isDropdown=false;
  if (children){
    if (children.length>0){
      isDropdown=true;
    }
  }

  function handleMouseEnter(){
    setHoverVisible(true)
  }
  function handleMouseLeave(){
    setHoverVisible(false)
  }
  return(
    <div style={isHorizontal ? horizontalLink : null}>

      {isDropdown 
        ?
        <div style={isHorizontal ? contentLinkHorizontal : contentLinkVertical} className="contentLink" onMouseEnter={handleMouseLeave} onMouseLeave={handleMouseEnter}>
            {name}
            {hoverVisible ? 
              null
            : 
            <div style={isHorizontal ? hoverMenuHorizontal : hoverMenuVertical} className='hoverMenu'>
              {children}
            </div>}

        </div>
        :
        <div style={isHorizontal ? contentLinkHorizontal : contentLinkVertical} className="contentLink" onClick={handleLinkClick}>
            {name}
        </div>      
      }      
  </div>)
}

// CSS to be used for vertical and horizontal alignments
const leftMenu = {
  background: 'var(--primary-color)',
  color: 'var(--secondary-color)',
  borderRight: '1px solid #dddddd',
  width: '150px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0px 0px 15px #dddddd'
}
const topMenu = {
  background: 'var(--primary-color)',
  color: 'var(--secondary-color)',
  borderBottom: '1px solid #dddddd',
  width: '100%',
  height: '75px',
  minHeight: '75px',
  display: 'flex',
  flexDirection: 'row',
  boxShadow: '0px 0px 15px #dddddd'
}
const verticalContainer = {
  display:'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100vh',
  overflow: 'hidden'
}
const horizontalContainer = {
  display:'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  overflow: 'hidden'

}

const logoImageHolderVertical = {
  height: '150px',
  width: '150px',
  display: 'flex',
  justifyContent: 'center',
  alignItems:'center',
  marginTop:'20px',
  marginBottom:'20px'
}
const logoImageHolderHorizontal = {
  display: 'flex',
  justifyContent: 'center',
  alignItems:'center',
  marginLeft:'20px',
  marginRight:'100px',
}
const verticalLogoImage ={
  width:'75px',
}
const horizontalLogoImage ={
  height:'50px',
}
const horizontalIcons = {
  display:'flex',
  flexDirection:'column',
  justifyContent:'center', 
  alignItems:'flex-end',
  width:'100%',
  marginRight: '15px'
}
const verticalIcons = {
  display:'flex',
  flexDirection:'column',
  alignItems:'center', 
  justifyContent:'flex-end',
  height:'100vh'
}
const contentLinkVertical = {
  fontSize:'14px',
  fontFamily: "'Open Sans', sans-serif",
  paddingLeft:'15px',
  paddingTop:'10px',
  paddingBottom:'10px',
  marginBottom: '5px'
}
const contentLinkHorizontal = {
  maxWidth:'165px',
  height:'50px',
  display:'flex',
  alignItems: 'center',
  flexShrink:0,
  paddingLeft:'10px',
  paddingRight:'25px',
}
const horizontalLink = {
  display:'flex',
  alignItems: 'flex-end',
  flexShrink:0,
}
const hoverMenuHorizontal ={
  position: 'absolute',
  width: '200px',
  top: '75px',
  marginLeft:'-10px',
}
const hoverMenuVertical = {
  position: 'absolute',
  width: '200px',
  paddingRight:'10px',
  left: '150px',
  marginTop:'-29px',
}

function Filter(props){
  const {
    hasSelectAll,
    filterName,
    options,
    type,
    setFilter,
    setField,
    defaultValues
  } = props
  const [selectedFilter, setSelectedFilter] = useState('')
  
  useEffect(() => {
    if (defaultValues){
      setSelectedFilter(defaultValues)
    }else{
      setSelectedFilter([])
    }
  }, [])
  
  var overrideStrings = {
    "allItemsAreSelected": "All "+filterName,
    "search": "Search "+filterName,
    "selectAll": "Select All",
    "selectAllFiltered": "Select All (Filtered)",
    "selectSomeItems": filterName,
    "create": "Create",
  }
  function handleFieldChange(e){
    setSelectedFilter(e)
    var filterVals = []
    for (var i=0;i<e.length;i++){
      filterVals.push(e[i].value)
    }
    setField(filterName, filterVals)
  }
  function handleFilterChange(e){
    var filterVals = []
    for (var i=0;i<e.length;i++){
      filterVals.push(e[i].label)
    }
    var filtersObj  = {
      columnName: filterName,
      operator: 'IN',
      values: filterVals
    }
    setSelectedFilter(e)
    setFilter(filtersObj)
  }

  return (
  <MultiSelect 
    multi={true} 
    hasSelectAll={hasSelectAll} 
    value={selectedFilter} 
    options={options} 
    placeholder={"Select "+filterName} 
    onChange={type == 'Field' ? handleFieldChange: handleFilterChange} 
    overrideStrings={overrideStrings}/>
  )
}

function UserIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-14a4 4 0 0 1 4 4v2a4 4 0 1 1-8 0V8a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v2a2 2 0 1 0 4 0V8a2 2 0 0 0-2-2zM5.91 16.876a8.033 8.033 0 0 1-1.58-1.232 5.57 5.57 0 0 1 2.204-1.574 1 1 0 1 1 .733 1.86c-.532.21-.993.538-1.358.946zm8.144.022a3.652 3.652 0 0 0-1.41-.964 1 1 0 1 1 .712-1.868 5.65 5.65 0 0 1 2.284 1.607 8.032 8.032 0 0 1-1.586 1.225z"></path></svg>
}
function SettingsIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor"><path d="M20 8.163A2.106 2.106 0 0 0 18.926 10c0 .789.433 1.476 1.074 1.837l-.717 2.406a2.105 2.105 0 0 0-2.218 3.058l-2.062 1.602A2.104 2.104 0 0 0 11.633 20l-3.29-.008a2.104 2.104 0 0 0-3.362-1.094l-2.06-1.615A2.105 2.105 0 0 0 .715 14.24L0 11.825A2.106 2.106 0 0 0 1.051 10C1.051 9.22.63 8.54 0 8.175L.715 5.76a2.105 2.105 0 0 0 2.207-3.043L4.98 1.102A2.104 2.104 0 0 0 8.342.008L11.634 0a2.104 2.104 0 0 0 3.37 1.097l2.06 1.603a2.105 2.105 0 0 0 2.218 3.058L20 8.162zM14.823 3.68c0-.063.002-.125.005-.188l-.08-.062a4.103 4.103 0 0 1-4.308-1.428l-.904.002a4.1 4.1 0 0 1-4.29 1.43l-.095.076A4.108 4.108 0 0 1 2.279 7.6a4.1 4.1 0 0 1 .772 2.399c0 .882-.28 1.715-.772 2.4a4.108 4.108 0 0 1 2.872 4.09l.096.075a4.104 4.104 0 0 1 4.289 1.43l.904.002a4.1 4.1 0 0 1 4.307-1.428l.08-.062A4.108 4.108 0 0 1 17.7 12.4a4.102 4.102 0 0 1-.773-2.4c0-.882.281-1.716.773-2.4a4.108 4.108 0 0 1-2.876-3.919zM10 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path></svg>
}

function TSLogo(){
  return <svg xmlns="http://www.w3.org/2000/svg" focusable="false" width="100%" height="100%" viewBox='0 0 512 512'><g fill="currentColor" fill-rule="evenodd"><path d="M328.33 378.112c0-20.677 16.767-37.445 37.444-37.445 20.684 0 37.448 16.768 37.448 37.445 0 20.68-16.764 37.448-37.448 37.448-20.677 0-37.445-16.768-37.445-37.448M106 209.61h100.634v203.608h18.72V209.61h18.724v203.608h18.724V209.61h18.72v203.608h18.725V209.61H400.88v-18.724H106v18.724M106 172.165h294.88v-18.724H106zM106 134.72h294.88V116H106z"/></g></svg>;
}
function GitHubLogo(){
  return <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 256 250" version="1.1" preserveAspectRatio="xMidYMid"><g><path d="M128.00106,0 C57.3172926,0 0,57.3066942 0,128.00106 C0,184.555281 36.6761997,232.535542 87.534937,249.460899 C93.9320223,250.645779 96.280588,246.684165 96.280588,243.303333 C96.280588,240.251045 96.1618878,230.167899 96.106777,219.472176 C60.4967585,227.215235 52.9826207,204.369712 52.9826207,204.369712 C47.1599584,189.574598 38.770408,185.640538 38.770408,185.640538 C27.1568785,177.696113 39.6458206,177.859325 39.6458206,177.859325 C52.4993419,178.762293 59.267365,191.04987 59.267365,191.04987 C70.6837675,210.618423 89.2115753,204.961093 96.5158685,201.690482 C97.6647155,193.417512 100.981959,187.77078 104.642583,184.574357 C76.211799,181.33766 46.324819,170.362144 46.324819,121.315702 C46.324819,107.340889 51.3250588,95.9223682 59.5132437,86.9583937 C58.1842268,83.7344152 53.8029229,70.715562 60.7532354,53.0843636 C60.7532354,53.0843636 71.5019501,49.6441813 95.9626412,66.2049595 C106.172967,63.368876 117.123047,61.9465949 128.00106,61.8978432 C138.879073,61.9465949 149.837632,63.368876 160.067033,66.2049595 C184.49805,49.6441813 195.231926,53.0843636 195.231926,53.0843636 C202.199197,70.715562 197.815773,83.7344152 196.486756,86.9583937 C204.694018,95.9223682 209.660343,107.340889 209.660343,121.315702 C209.660343,170.478725 179.716133,181.303747 151.213281,184.472614 C155.80443,188.444828 159.895342,196.234518 159.895342,208.176593 C159.895342,225.303317 159.746968,239.087361 159.746968,243.303333 C159.746968,246.709601 162.05102,250.70089 168.53925,249.443941 C219.370432,232.499507 256,184.536204 256,128.00106 C256,57.3066942 198.691187,0 128.00106,0 Z M47.9405593,182.340212 C47.6586465,182.976105 46.6581745,183.166873 45.7467277,182.730227 C44.8183235,182.312656 44.2968914,181.445722 44.5978808,180.80771 C44.8734344,180.152739 45.876026,179.97045 46.8023103,180.409216 C47.7328342,180.826786 48.2627451,181.702199 47.9405593,182.340212 Z M54.2367892,187.958254 C53.6263318,188.524199 52.4329723,188.261363 51.6232682,187.366874 C50.7860088,186.474504 50.6291553,185.281144 51.2480912,184.70672 C51.8776254,184.140775 53.0349512,184.405731 53.8743302,185.298101 C54.7115892,186.201069 54.8748019,187.38595 54.2367892,187.958254 Z M58.5562413,195.146347 C57.7719732,195.691096 56.4895886,195.180261 55.6968417,194.042013 C54.9125733,192.903764 54.9125733,191.538713 55.713799,190.991845 C56.5086651,190.444977 57.7719732,190.936735 58.5753181,192.066505 C59.3574669,193.22383 59.3574669,194.58888 58.5562413,195.146347 Z M65.8613592,203.471174 C65.1597571,204.244846 63.6654083,204.03712 62.5716717,202.981538 C61.4524999,201.94927 61.1409122,200.484596 61.8446341,199.710926 C62.5547146,198.935137 64.0575422,199.15346 65.1597571,200.200564 C66.2704506,201.230712 66.6095936,202.705984 65.8613592,203.471174 Z M75.3025151,206.281542 C74.9930474,207.284134 73.553809,207.739857 72.1039724,207.313809 C70.6562556,206.875043 69.7087748,205.700761 70.0012857,204.687571 C70.302275,203.678621 71.7478721,203.20382 73.2083069,203.659543 C74.6539041,204.09619 75.6035048,205.261994 75.3025151,206.281542 Z M86.046947,207.473627 C86.0829806,208.529209 84.8535871,209.404622 83.3316829,209.4237 C81.8013,209.457614 80.563428,208.603398 80.5464708,207.564772 C80.5464708,206.498591 81.7483088,205.631657 83.2786917,205.606221 C84.8005962,205.576546 86.046947,206.424403 86.046947,207.473627 Z M96.6021471,207.069023 C96.7844366,208.099171 95.7267341,209.156872 94.215428,209.438785 C92.7295577,209.710099 91.3539086,209.074206 91.1652603,208.052538 C90.9808515,206.996955 92.0576306,205.939253 93.5413813,205.66582 C95.054807,205.402984 96.4092596,206.021919 96.6021471,207.069023 Z" fill="currentColor"/></g></svg>
}


export default Content;