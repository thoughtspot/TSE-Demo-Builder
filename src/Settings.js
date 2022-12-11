import React, { useState, useEffect, setState, useRef } from 'react';
import { init,  AuthType} from '@thoughtspot/visual-embed-sdk';
import { SearchEmbed } from '@thoughtspot/visual-embed-sdk/react';
import { SketchPicker } from 'react-color';


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
const [links, setLinks] = useState('')
const [linkTypes, setLinkTypes] = useState('')
const [linkNames, setLinkNames] = useState('')
const [linkContents, setLinkContents] = useState('')
const [linkParents, setLinkParents] = useState('')
const [primaryColor, setPrimaryColor] = useState('')
const [secondaryColor, setSecondaryColor] = useState('')
const [buttonColor,setButtonColor]  = useState('')
const [backgroundColor,setBackgroundColor]  = useState('')
const [orientation, setOrientation] = useState('')
const [logoImage, setLogoImage] = useState('')
const [displayPrimaryPicker, setDisplayPrimaryPicker] = useState('')
const [displaySecondaryPicker, setDisplaySecondaryPicker] = useState('')
const [displayButtonPicker, setDisplayButtonPicker] = useState('')
const [displayBackgroundPicker, setDisplayBackgroundPicker] = useState('')


useEffect(()=>{
  var objDiv = document.getElementById("linkContainer");
  objDiv.scrollTop = objDiv.scrollHeight + 30;
})

function updatePrimaryColor(color){
  setPrimaryColor(color.hex);
};
function updateSecondaryColor(color){
  setSecondaryColor(color.hex);
};
function updateBackgroundColor(color){
  setBackgroundColor(color.hex);
};
function updateButtonColor(color){
  setButtonColor(color.hex);
};
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
  var settings = {
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
    logoImage: logoImage
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
    setButtonColor(settings.buttonColor)
    setBackgroundColor(settings.backgroundColor)
    setOrientation(settings.orientation)
    setLogoImage(settings.logoImage)
  }
}, [])
const popover = {
  position: 'absolute',
  zIndex: '2',
}
const cover = {
  position: 'fixed',
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
    if (linkTypes[link]=='Menu'){
      activeMenus.push(linkNames[link])
    }
  }
  var activeReports = []
  for (var link of links){
    if (linkTypes[link]=='Liveboard' || linkTypes[link]=='Search String'){
      activeReports.push(linkNames[link])
    }
  }
  var activeSearchStrings = []
  for (var link of links){
    if (linkTypes[link]=='Search String'){
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
            encType="multipart/form-data" 
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
                                  encType="multipart/form-data" 
                                  required/>
        
        <div className="settingLabel">Primary Color</div> 
        <div className="colorPlaceholder" style={{background: primaryColor, border:'1px solid #ccc'}} onClick={e => setDisplayPrimaryPicker(true) }></div>
        { displayPrimaryPicker ? <div style={ popover }>
              <div style={ cover } onClick={() => setDisplayPrimaryPicker(false) }/>
              <SketchPicker color={primaryColor}
                  onChangeComplete={updatePrimaryColor}
              />
            </div> : null }

        <div className="settingLabel">Secondary Color</div> 
        <div className="colorPlaceholder" style={{background: secondaryColor, border:'1px solid #ccc'}} onClick={e => setDisplaySecondaryPicker(true) }></div>
        { displaySecondaryPicker ? <div style={ popover }>
              <div style={ cover } onClick={ e => setDisplaySecondaryPicker(false) }/>
              <SketchPicker color={secondaryColor}
                  onChangeComplete={updateSecondaryColor}
              />
            </div> : null }
      </div>
      <div className='verticalMenu'>
      <div className="settingLabel">TS Button Color</div> 
        <div className="colorPlaceholder" style={{background: buttonColor, border:'1px solid #ccc'}} onClick={e => setDisplayButtonPicker(true) }></div>
        { displayButtonPicker ? <div style={ popover }>
              <div style={ cover } onClick={() => setDisplayButtonPicker(false) }/>
              <SketchPicker color={buttonColor}
                  onChangeComplete={updateButtonColor}
              />
            </div> : null }

        <div className="settingLabel">TS Background Color</div> 
        <div className="colorPlaceholder" style={{background: backgroundColor, border:'1px solid #ccc'}} onClick={e => setDisplayBackgroundPicker(true) }></div>
        { displayBackgroundPicker ? <div style={ popover }>
              <div style={ cover } onClick={ e => setDisplayBackgroundPicker(false) }/>
              <SketchPicker color={backgroundColor}
                  onChangeComplete={updateBackgroundColor}
              />
            </div> : null }
      </div>
      <div className="verticalMenu">
        <div className="settingLabel">Orientation</div> 
        <select onChange={e => setOrientation(e.target.value)} value={orientation}> 
            <option value="Vertical">Vertical</option>
            <option value="Horizontal">Horizontal</option>
        </select>
        {/* <div className="settingLabel">Font Familiy</div> 
      <select > 
            <option value="Vertical">Roboto</option>
            <option value="Horizontal">Horizontal</option>
        </select> */}
      </div>
    </div>
    

    <div className="settingLabel">Links</div> 
    <div className='linkHeader'>
        <div style={{width:'110px'}}>Name</div><div style={{width:'90px'}}>Type</div><div style={{flex:1}}>Configuration</div><div style={{width:'160px'}}>Parent</div>
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
  var contentInput = null;
  if (type=='Menu'){
    contentInput = null;
  }else if (type=='App'){
    contentInput = <select style={{flex:1,marginRight:'5px'}} onChange={e => handleContentChange(e.target.value)} value={content}> 
      <option value="home">Home</option>
      <option value="answers">Answers</option>
      <option value="pinboards">Liveboards</option>
      <option value="data">Data</option>
      <option value="spotiq">SpotIQ</option> 
      <option value="search">Search</option> 
    </select>
  }
  else if (type=='Image'){
   contentInput = <ImageInput value={content} setValue={handleContentChange}></ImageInput>
  }else if (type == 'OnImageViz'){
    contentInput = <ImageVizInput value={content} setValue={handleContentChange}></ImageVizInput>
  }
  else if (type=="None"){
    contentInput = null;
  }else{
    var placeholders = {
      'Search': 'WorksheetGUID|hideDataSources=false|disableAction=Action.Share|disableAction=Action.Save',
      'Search Bar': 'WorksheetGUID|hideDataSources=false|disableAction=Action.Share|disableAction=Action.Save',
      'Liveboard':'LiveboardGUID|disableAction=Action.Share|disableAction=Action.Save',
      'Answer': 'AnswerGUID|hideDataSources=false|disableAction=Action.Share|disableAction=Action.Save',
      'Filter':'East,West,South,North',
      'Field':'[Region]:Region,[Timestamp].detailed:Detailed Time',
      'Search String':'[tml] [search] [query] |WorksheetGUID|hideDataSources=false',
      'URL':'URL of website or image',
      'Rest':'tags=Retail Sales|category=my|sort=CREATED|type=liveboard',
      'Advanced':'WorksheetGUID'
    }
    contentInput = <input style={{flex:1,border:'1px solid #cccccccc', borderRadius:'5px', marginRight:'5px'}} placeholder={placeholders[type]} value={content} onChange={e => handleContentChange(e.target.value)} />;
  }

  var parentOptions = []
  var parentOptionLinks = linkNames
  if (type=='Filter' || type=='Date Filter'){
    parentOptionLinks = activeReports;
  }
  if (type=='Field'){
    parentOptionLinks = activeSearchStrings;
  }
  for (var link of Object.values(parentOptionLinks)){
    parentOptions.push(<option value={link}>{link}</option>)
  }
  var namePlaceholders = {
    'Search': 'Link Name',
    'Liveboard': 'Link Name',
    'Answer': 'Link Name',
    'Filter': 'Column Name',
    'Field': 'Column Name',
    'Search String':'Link Name',
    'URL':'Link Name',
    'App': 'Link Name',
    'Menu': 'Menu Name',
    'None':'Link Name',
    'Rest':'Link Name',
    'Advanced':'Link Name',
    'Date Filter':'Column Name',
    'Search Bar': 'Link Name',
 
  }
  return(
    <div className="link">
      <input placeholder={namePlaceholders[type]} style={{width:'100px',marginRight:'5px'}} value={name} onChange={e => handleNameChange(e.target.value)} />
      <select style={{width:'80px',marginRight:'5px'}} onChange={e => handleTypeChange(e.target.value)} value={type}> 
        <option value="None">None</option>
        <option value="Menu">Menu</option>
        <option value="Search">Search</option>
        <option value="Liveboard">Liveboard</option>
        <option value="Answer">Answer</option>
        <option value="App">Full App</option>
        <option value="URL">URL</option>
        <option value="Image">Image</option>
        <option value="Search String">Search String</option>
        <option value="Filter">Filter (Liveboard & Search String)</option>
        <option value="Field">Field (Search String)</option>
        <option value="Rest">REST Content List</option>
        <option value="Advanced">Advanced</option>
        <option value="Date Filter">Date Filter</option>
        <option value="Custom Demos">Custom Demos</option>

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
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function CloseIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor"><path d="M4 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm0-2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"></path><path d="M11.414 10l2.829 2.828a1 1 0 0 1-1.415 1.415L10 11.414l-2.828 2.829a1 1 0 1 1-1.415-1.415L8.586 10 5.757 7.172a1 1 0 0 1 1.415-1.415L10 8.586l2.828-2.829a1 1 0 0 1 1.415 1.415L11.414 10z"></path></svg>;
}
function OpenIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -4 24 24" width="24" fill="currentColor"><path d="M10.83 2H17a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h5c1.306 0 2.417.835 2.83 2zM17 4H9.415l-.471-1.334A1.001 1.001 0 0 0 8 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"></path><path d="M1 5h18v2H1z"></path></svg>;
}
function ApplyIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor"><path d="M4 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm0-2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"></path><path d="M8.414 9H14a1 1 0 1 1 0 2H8.414l2.536 2.536a1 1 0 0 1-1.414 1.414l-4.243-4.243a.997.997 0 0 1 0-1.414L9.536 5.05a1 1 0 1 1 1.414 1.414L8.414 9z"></path></svg>;
}
function SaveIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 24 24" width="24" fill="currentColor"><path d="M2 0h11.22a2 2 0 0 1 1.345.52l2.78 2.527A2 2 0 0 1 18 4.527V16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 2v14h14V4.527L13.22 2H2zm4 8h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zm0 2v4h6v-4H6zm7-9a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1zM5 3h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 3h3V5H6v1z"></path></svg>;
}
function PlusIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor"><path d="M4 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm0-2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4zm7 11v4a1 1 0 0 1-2 0v-4H5a1 1 0 0 1 0-2h4V5a1 1 0 1 1 2 0v4h4a1 1 0 0 1 0 2h-4z"></path></svg>;
}
function TrashIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2 24 24" width="24" fill="currentColor"><path d="M6 2V1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-.133l-.68 10.2a3 3 0 0 1-2.993 2.8H5.826a3 3 0 0 1-2.993-2.796L2.137 7H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4zm10 2H2v1h14V4zM4.141 7l.687 10.068a1 1 0 0 0 .998.932h6.368a1 1 0 0 0 .998-.934L13.862 7h-9.72zM7 8a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z"></path></svg>
}
function ArrowDown(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -4.5 24 24" width="24" fill="currentColor"><path d="M8 11.243l3.95-3.95a1 1 0 1 1 1.414 1.414l-5.657 5.657a.997.997 0 0 1-1.414 0L.636 8.707A1 1 0 1 1 2.05 7.293L6 11.243V1.657a1 1 0 1 1 2 0v9.586z"></path></svg>;
}
function ArrowUp(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -4.5 24 24" width="24" fill="currentColor"><path d="M6 4.071l-3.95 3.95A1 1 0 0 1 .636 6.607L6.293.95a.997.997 0 0 1 1.414 0l5.657 5.657A1 1 0 0 1 11.95 8.02L8 4.07v9.586a1 1 0 1 1-2 0V4.07z"></path></svg>
}
function RevertIcon(){
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor"><path d="M2 5h16V2H2v3zm16 2v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-1zM4 18h12V7H4v11zm4-4h4a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2z"></path></svg>;
}
const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader.result);
    }
    fileReader.onerror = (error) => {
      reject(error);
    }
  })
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
            encType="multipart/form-data" 
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
              encType="multipart/form-data" 
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
      <input style={{flex:1,border:'1px solid #cccccccc', borderRadius:'5px', marginRight:'5px'}} s onChange={handleConfigChange} placeholder="LiveboardGUID|VizGUID" value={value ? value.config : ''}></input>
     </div>
  )
}
export default SettingsMenu;