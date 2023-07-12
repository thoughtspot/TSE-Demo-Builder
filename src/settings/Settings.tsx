import React, { useState, useEffect, useRef } from 'react';
import { init,  AuthType, Page} from '@thoughtspot/visual-embed-sdk';
import { SketchPicker } from 'react-color';
import { defaultPages, DemoPage, PageName, Settings } from '../util/Types';
import { ApplyIcon, TrashIcon, RevertIcon, OpenIcon, SaveIcon, CloseIcon, PlusIcon, ArrowUp, ArrowDown } from '../util/Icons';
import {uuidv4, convertBase64} from '../util/Util'
import { StyleOptionList } from '../util/PreBuiltStyles';

function SettingsMenu(props) {
const {
  applySettings,
  saveSettings,
  closeSettings,
  openSettings,
  newSettings,
  settings,
  loadDefaults
} = props

const fileInput = useRef(null)
const imageInput = useRef(null)

const [name, setName] = useState('')
const [URL, setURL] = useState('')
const [links, setLinks] = useState([])
const [linkTypes, setLinkTypes] = useState({})
const [linkNames, setLinkNames] = useState({})
const [linkContents, setLinkContents] = useState({})
const [linkParents, setLinkParents] = useState({})
const [primaryColor, setPrimaryColor] = useState('')
const [secondaryColor, setSecondaryColor] = useState('')
const [buttonColor,setButtonColor]  = useState('')
const [backgroundColor,setBackgroundColor]  = useState('')
const [orientation, setOrientation] = useState('')
const [prebuiltStyle, setPrebuiltStyle] = useState(StyleOptionList.None)
const [logoImage, setLogoImage] = useState<any>()
const [displayPrimaryPicker, setDisplayPrimaryPicker] = useState(false)
const [displaySecondaryPicker, setDisplaySecondaryPicker] = useState(false)
const [displayButtonPicker, setDisplayButtonPicker] = useState(false)
const [displayBackgroundPicker, setDisplayBackgroundPicker] = useState(false)


useEffect(()=>{
  var objDiv = document.getElementById("linkContainer");
  objDiv.scrollTop = objDiv.scrollHeight + 30;
})

const handleLinkTypeChange = (linkId, value) => {
  setLinkTypes({ ...linkTypes, [linkId]: value });
};
const handleLinkNameChange = (linkId, value) => {
  setLinkNames({ ...linkNames, [linkId]: value });
};
const handleLinkContentChange = (linkId, value) => {
  setLinkContents({ ...linkContents, [linkId]: value });
};
const handleLinkParentChange = (linkId, value) => {
  setLinkParents({ ...linkParents, [linkId]: value });
};
const addLink = () =>{
  var uuid = uuidv4()
  setLinks([...links, uuid])
  setLinkNames({ ...linkNames, [uuid]: undefined });
  setLinkContents({ ...linkContents, [uuid]: undefined });
  setLinkParents({ ...linkParents, [uuid]: undefined });
  setLinkTypes({ ...linkTypes, [uuid]: 'None' });
  
}
const removeLink = (id) =>{
  setLinks(links.filter((e)=>(e !== id)))
  setLinkNames({ ...linkNames, [id]: undefined });
  setLinkContents({ ...linkContents, [id]: undefined });
  setLinkParents({ ...linkParents, [id]: undefined });
  setLinkTypes({ ...linkTypes, [id]: undefined });
}
const moveUp = (id) => {
  var linkCopy = [... links]
  var currIndex = links.indexOf(id)
  if (currIndex>0){
    var newIndex = currIndex - 1;
    var replacement = links[newIndex];
    linkCopy[newIndex] = id
    linkCopy[currIndex] = replacement
    setLinks(linkCopy)
  }
}
const moveDown = (id) => {
  var linkCopy = [... links]
  var currIndex = links.indexOf(id)
  if (currIndex<links.length-1){
    var newIndex = currIndex + 1;
    var replacement = links[newIndex];
    linkCopy[newIndex] = id
    linkCopy[currIndex] = replacement
    setLinks(linkCopy)
  }
}
const getSettingsObj = () =>{
  var settings: Settings = {
    name: name,
    URL: URL,
    links: links,
    linkTypes: linkTypes,
    linkNames: linkNames,
    linkContents: linkContents,
    linkParents: linkParents,
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
    buttonColor: buttonColor,
    backgroundColor: backgroundColor,
    orientation: orientation,
    logoImage: logoImage,
    prebuiltStyle: prebuiltStyle
  }
  return settings;
}
const saveSettingMenu = () =>{
  saveSettings(getSettingsObj());
}
const applySettingMenu = () =>{
  applySettings(getSettingsObj());
}
useEffect(() => {
  if (settings){
    setName(settings.name)
    setURL(settings.URL)
    setLinks(settings.links)
    setLinkTypes(settings.linkTypes)
    setLinkNames(settings.linkNames)
    setLinkContents(settings.linkContents)
    setLinkParents(settings.linkParents)
    setPrimaryColor(settings.primaryColor)
    setSecondaryColor(settings.secondaryColor)
    setPrebuiltStyle(settings.prebuiltStyle)
    setButtonColor(settings.buttonColor)
    setBackgroundColor(settings.backgroundColor)
    setOrientation(settings.orientation)
    setLogoImage(settings.logoImage)
  }
}, [])
const popover = {
  position:  'absolute' as 'absolute',
  zIndex: '2',
}
const cover = {
  position: 'fixed' as 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
}

if (!links){
  setLinks([])
}else{
  var activeMenus = []
  for (var link of links){
    if (linkTypes[link]==PageName.Menu){
      activeMenus.push(linkNames[link])
    }
  }
  var activeReports = []
  for (var link of links){
    if (linkTypes[link]==PageName.Liveboard || linkTypes[link]==PageName.SearchString){
      activeReports.push(linkNames[link])
    }
  }
  var activeSearchStrings = []
  for (var link of links){
    if (linkTypes[link]==PageName.SearchString){
      activeSearchStrings.push(linkNames[link])
    }
  }
  var linkObjs   = links.map(link => (
    <Link
      key={link}
      id={link}
      saveLinkName={handleLinkNameChange}
      saveLinkType={handleLinkTypeChange}
      saveLinkContent={handleLinkContentChange}
      saveLinkParent={handleLinkParentChange}
      name={linkNames[link]}
      type={linkTypes[link]}
      content={linkContents[link]}
      parent={linkParents[link]}
      linkNames={activeMenus}
      activeReports={activeReports}
      activeSearchStrings={activeSearchStrings}
      removeLink={removeLink}
      moveDown={moveDown}
      moveUp={moveUp}
    />
  ));
} 

const handleSettingsRead = async (event) => {
  openSettings(event.target.files[0])
}
const handleFileRead = async (event) => {
  const file = event.target.files[0]
  const base64 = await convertBase64(file)
  setLogoImage(base64);
}

const triggerInputFile = () => {
  fileInput.current.click()
}
const triggerInputImage = () => {
  imageInput.current.click()
}
const hideSettings = () => {
  closeSettings();
}
return (
  <div id="settingsContainer">
    <div id="settingsHeader">
      <div className="button" onClick={applySettingMenu}>
        <ApplyIcon />
        Apply
      </div>
      <div className='close'>
        <div  className="button" onClick={newSettings} >
          <TrashIcon />
          Clear
        </div>
        <div  className="button" onClick={loadDefaults} >
          <RevertIcon />
          Default
        </div>
        <div className="button" onClick={triggerInputFile} >
          <OpenIcon />
          Open
        </div>
        <input type="file" 
            ref={fileInput} 
            name="file" 
            className="upload-file" 
            id="file"
            onChange={handleSettingsRead}
            formEncType="multipart/form-data" 
            style={{display:'none'}}
            required/>
        <div className="button" onClick={saveSettingMenu}>
          <SaveIcon />
          <a id="saveButton"> Save </a>
        </div>
        <div className="button"  onClick={hideSettings}>
          <CloseIcon />
          Close
        </div>      
      </div>

    </div>
    <div className="settingLabel">Settings Name</div> 
    <input type="text" value={name} onChange={e => setName(e.target.value)}></input>
    <div className="settingLabel">ThoughtSpot URL</div> 
    <input  type="text" value={URL} onChange={e => setURL(e.target.value)}></input>
    
    <div className="horizontalMenu">
      <div className="verticalMenu">
        <div className="settingLabel">Logo Image</div> 
        <img className="logoImagePreview" onClick={triggerInputImage} src={logoImage}></img> 
      </div>
      <div className="verticalMenu">
        <input ref={imageInput} type="file" name="file" 
                                  className="upload-file" 
                                  id="file"
                                  onChange={handleFileRead}
                                  style={{display:'none'}}
                                  formEncType="multipart/form-data" 
                                  required/>
        
        <div className="settingLabel">Primary Color</div> 
        <div className="colorPlaceholder" style={{background: primaryColor, border:'1px solid #ccc'}} onClick={e => setDisplayPrimaryPicker(true) }></div>
        { displayPrimaryPicker ? <div style={ popover }>
              <div style={ cover } onClick={() => setDisplayPrimaryPicker(false) }/>
              <SketchPicker color={primaryColor}
                  onChangeComplete={(color)=>setPrimaryColor(color.hex)}
              />
            </div> : null }

        <div className="settingLabel">Secondary Color</div> 
        <div className="colorPlaceholder" style={{background: secondaryColor, border:'1px solid #ccc'}} onClick={e => setDisplaySecondaryPicker(true) }></div>
        { displaySecondaryPicker ? <div style={ popover }>
              <div style={ cover } onClick={ e => setDisplaySecondaryPicker(false) }/>
              <SketchPicker color={secondaryColor}
                  onChangeComplete={(color)=>setSecondaryColor(color.hex)}
              />
            </div> : null }
      </div>
      <div className='verticalMenu'>
      <div className="settingLabel">TS Button Color</div> 
        <div className="colorPlaceholder" style={{background: buttonColor, border:'1px solid #ccc'}} onClick={e => setDisplayButtonPicker(true) }></div>
        { displayButtonPicker ? <div style={ popover }>
              <div style={ cover } onClick={() => setDisplayButtonPicker(false) }/>
              <SketchPicker color={buttonColor}
                  onChangeComplete={(color)=>setButtonColor(color.hex)}
              />
            </div> : null }

        <div className="settingLabel">TS Background Color</div> 
        <div className="colorPlaceholder" style={{background: backgroundColor, border:'1px solid #ccc'}} onClick={e => setDisplayBackgroundPicker(true) }></div>
        { displayBackgroundPicker ? <div style={ popover }>
              <div style={ cover } onClick={ e => setDisplayBackgroundPicker(false) }/>
              <SketchPicker color={backgroundColor}
                  onChangeComplete={(color)=>setBackgroundColor(color.hex)}
              />
            </div> : null }
      </div>
      <div className="verticalMenu">
        <div className="settingLabel">Orientation</div> 
        <select onChange={e => setOrientation(e.target.value)} value={orientation}> 
            <option value="Vertical">Vertical</option>
            <option value="Horizontal">Horizontal</option>
        </select>
        <div className="settingLabel">Pre-Built Style</div> 
        <select onChange={e => setPrebuiltStyle(e.target.value as StyleOptionList)} value={prebuiltStyle}> 
        {Object.keys(StyleOptionList).map((style: StyleOptionList)=>{
          return (<option value={style}>{style}</option>)
        })}
        </select>
      </div>
    </div>
    

    <div className="settingLabel">Links</div> 
    <div className='linkHeader'>
        <div style={{width:'150px'}}>Name</div><div style={{width:'150px'}}>Type</div><div style={{flex:1}}>Configuration</div><div style={{width:'160px'}}>Parent</div>
      </div>
    <div id="linkContainer" className="linkContainer">

      <div>
      {linkObjs}

      </div>
    </div>
    <div style={{display:'flex',flexDirection:'row'}}>
    <div className="button addLink" onClick={addLink}>
      <PlusIcon />
      Add Link
    </div>
  </div>
  </div>
)
}

function Link(props){

  const {
    id,
    name,
    type,
    parent,
    content,
    saveLinkName,
    saveLinkType,
    saveLinkContent,
    saveLinkParent,
    linkNames,
    activeReports,
    activeSearchStrings,
    removeLink,
    moveDown,
    moveUp,
  } = props

  function handleNameChange(linkName){
    saveLinkName(id,linkName)
  }
  function handleTypeChange(linkType){
    saveLinkType(id,linkType)
  }
  function handleParentChange(linkParent){
    saveLinkParent(id,linkParent)
  }
  function handleContentChange(linkContent){
    saveLinkContent(id,linkContent)
  }
  let demoPage: DemoPage = defaultPages.filter((page: DemoPage) => page.id == type as PageName)[0]
  if (!demoPage){
    demoPage = defaultPages.filter((page: DemoPage) => page.id == PageName.None)[0]
  }
  console.log(demoPage,"demoPage",defaultPages)
  var contentInput = null;
  if (type==PageName.Menu){
    contentInput = null;
  }else if (type==PageName.App){
    contentInput = <select style={{flex:1,marginRight:'5px'}} onChange={e => handleContentChange(e.target.value)} value={content}> 
      <option value="home">Home</option>
      <option value="answers">Answers</option>
      <option value="pinboards">Liveboards</option>
      <option value="data">Data</option>
      <option value="spotiq">SpotIQ</option> 
      <option value="search">Search</option> 
    </select>
  }
  else if (type==PageName.Image){
   contentInput = <ImageInput value={content} setValue={handleContentChange}></ImageInput>
  }else if (type == PageName.OnImageViz){
    contentInput = <ImageVizInput value={content} setValue={handleContentChange}></ImageVizInput>
  }
  else if (type==PageName.None){
    contentInput = null;
  }else{
    contentInput = <input style={{flex:1,border:'1px solid #cccccccc', borderRadius:'5px', marginRight:'5px'}} placeholder={demoPage.configDesc} value={content} onChange={e => handleContentChange(e.target.value)} />;
  }

  var parentOptions = []
  var parentOptionLinks: {link: string} = linkNames
  if (type=='Filter' || type=='Date Filter'){
    parentOptionLinks = activeReports;
  }
  if (type=='Field'){
    parentOptionLinks = activeSearchStrings;
  }
  for (var link of Object.values(parentOptionLinks)){
    parentOptions.push(<option value={link}>{link}</option>)
  }
  return(
    <div className="link">
      <input placeholder={demoPage.configName} style={{width:'150px',marginRight:'5px'}} value={name} onChange={e => handleNameChange(e.target.value)} />
      <select style={{width:'150px',marginRight:'5px'}} onChange={e => handleTypeChange(e.target.value)} value={type}> 
      {defaultPages.map((page: DemoPage)=>{
          return (
            <option value={page.id}>{page.name}</option>
          )
        })}
      </select>
      {contentInput}
      {(type!='Menu' && type!='Rest') ? 
        <select style={{width:'80px',marginRight:'5px'}} onChange={e => handleParentChange(e.target.value)} value={parent}> 
          <option value="None">None</option>
          {parentOptions}
        </select>     
      : null }
      <div style={{width:'20px',marginRight:'5px'}} onClick={() => removeLink(id)}>
        <TrashIcon/>
      </div>
      <div style={{width:'20px',marginRight:'5px'}} onClick={() => moveUp(id)}>
        <ArrowUp/>
      </div>
      <div style={{width:'20px',marginRight:'5px'}} onClick={() => moveDown(id)}>
        <ArrowDown/>
      </div>

     </div>
  )
}

function ImageInput(props){
  const {
    value,
    setValue
  } = props

  const imageInput = useRef(null)
  async function handleImageChange(event){
    const file = event.target.files[0]
    const base64 = await convertBase64(file)
    setValue(base64)
  }
  const triggerInputImage = () => {
    imageInput.current.click()
  }
  return (
    <div>
      <img className="logoImagePreview" onClick={triggerInputImage} src={value}></img> 
      <input ref={imageInput} type="file" name="file" 
            className="upload-file" 
            id="file"
            onChange={handleImageChange}
            style={{display:'none'}}
            formEncType="multipart/form-data" 
            required/>
     </div>
  )
}
function ImageVizInput(props){
  const {
    value,
    setValue
  } = props
  const [areaVisible,setAreaVisible] = useState(false)
  const [isSelecting,setIsSelecting] = useState(false)
  const [x,setX] = useState(0)
  const [y,setY] = useState(0)
  const [width,setWidth] = useState(0)
  const [height,setHeight] = useState(0)
  const imageInput = useRef(null)

  async function handleImageChange(event){
    const file = event.target.files[0]
    const base64 = await convertBase64(file)
    var valueCopy = value ? value : {}
    valueCopy['image'] = base64
    setValue(valueCopy)
  }
  const triggerInputImage = () => {
    imageInput.current.click()
  }
  useEffect(()=>{

  },[])
  function exposeDragArea(){
    setAreaVisible(!areaVisible)
    document.getElementById("settingsContainer").parentElement.style.background = "transparent"
  }
  function  handleMouseDown(e){
    setX(e.clientX)
    setY(e.clientY)
    setIsSelecting(true)


  }
  function handleMouseUp(e){
    if (isSelecting){
      setIsSelecting(false)
      setAreaVisible(!areaVisible)
      setWidth(0)
      setHeight(0)
      document.getElementById("settingsContainer").parentElement.style.background = "#ffffff"
    }
    var valueCopy = value ? value : {}
    valueCopy['box'] = {
      x: x / window.innerWidth * 100,
      y: y / window.innerHeight * 100,
      width:width / window.innerWidth * 100,
      height:height / window.innerHeight * 100,
    }
    console.log(valueCopy)
    setValue(valueCopy)
  }
  function handleMouseMove(e){
    if (isSelecting){
      setHeight(e.clientY - y)
      setWidth(e.clientX - x)
    }
  }
  function handleConfigChange(e){
    var valueCopy = value ? value : {}
    valueCopy['config'] = e.target.value
    setValue(valueCopy)
  }
  return (
    <div style={{display:'flex',flexDirection:'row',width:'100%'}}>
        <img className="logoImagePreview" onClick={triggerInputImage} src={value ? value.image : ""}></img> 
        <input ref={imageInput} type="file" name="file" 
              className="upload-file" 
              id="file"
              onChange={handleImageChange}
              style={{display:'none'}}
              formEncType="multipart/form-data" 
              required/>
        <div onClick={exposeDragArea} style={{width:'75px',height:'30px',background:'#ffffff',border:'1px solid #cccccc'}}>
          Select Area
        </div>
        {areaVisible?
          <div onMouseDown={(e)=>handleMouseDown(e)}
          onMouseMove={(e)=>handleMouseMove(e)} onMouseUp={(e)=>handleMouseUp(e)} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'#efefef33',cursor:'crosshair'}}>
            <img style={{position:'fixed',top:0,left:0,width:'100%',height:'100%'}} src={value ? value.image : ""}></img> 
            <div style={{top:y+"px",left:x+"px",display:'flex',alignItems:'center',justifyContent:'center',width:width,height:height,position:'fixed',background:'#efefef99',border:'1px dashed #cccccc'}}>
                Viz will go here
            </div>
          </div>: 
        null}
      <input style={{flex:1,border:'1px solid #cccccccc', borderRadius:'5px', marginRight:'5px'}} onChange={handleConfigChange} placeholder="LiveboardGUID|VizGUID" value={value ? value.config : ''}></input>
     </div>
  )
}
export default SettingsMenu;