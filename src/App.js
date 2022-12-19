import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Switch,
  Route,
  Link,
  
} from "react-router-dom";
import Settings from './settings/Settings'
import Content from './Content'
import React, { useState, useEffect, setState } from 'react';
import { useLocalStorage } from "./LocalStorage";

const APP_VERSION = '1-0'
let initialLoad = true;

function App() {
  const [settings, setSettings] = useLocalStorage("settings", "");
  const [settingsVisible, setSettingsVisible] = useState('')
  const [timeKey, setTimeKey] = useState('')
  function applySettings(settings){
    setSettings(settings)
    setTimeKey(Date.now());
  }
  function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  } 
  function saveSettings(settings){
    var a = document.getElementById("saveButton");
    var file = new Blob([JSON.stringify(settings)], {type: 'json'});
    a.href = URL.createObjectURL(file);
    a.download = settings.name+'v'+APP_VERSION;
  }
  function closeSettings(settings){
    setSettingsVisible(false)
  }
  function showSettings(){
    setSettingsVisible(true);
  }
  function newSettings(){
    setSettings({});
    setTimeKey(Date.now());
  }
  function loadDefaults(){
    fetch('DefaultSettings.json').then(response => response.json()).then(data => {
      setSettings(data)
      setTimeKey(Date.now());
    })
  }
  const openSettings = (file) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file)
    fileReader.onload = () => {
      var settings = JSON.parse(fileReader.result)
      setSettings(settings);
      setTimeKey(Date.now());
    }

  }  

  const popover = {
    position: 'absolute',
    zIndex: '2',
    top:'5%',
    left:'25%',
    width:'70%',
    minWidth:'600px',
    height:'85%',
    background:'#ffffff',
    boxShadow: '0px 0px 250px #ededed',
    padding:'25px'
  }

  useEffect(() => {
    if (initialLoad && !settings){
      loadDefaults();
    }
  }, [])
  
  return(
    <div>
      <Content settings={settings} showSettings={showSettings} newSettings={newSettings}/>
      { settingsVisible ? <div style={ popover }>
      <Settings openSettings={openSettings} applySettings={applySettings} saveSettings={saveSettings} settings={settings} closeSettings={closeSettings} newSettings={newSettings} loadDefaults={loadDefaults} key={timeKey} />  
      </div> : null }
          
    </div>


  );
}

export default App;
