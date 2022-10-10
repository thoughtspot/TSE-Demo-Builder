import { useState,useEffect,useRef } from "react";

export default function ClientWebsite(props){
    const {
        url 
    } = props
    useEffect(()=>{
        fetch("https://crossorigin.me/"+url,{method:'GET',mode:'cors'}).then(response => response.text()).then(data => {
            document.getElementById("clientSite").innerHTML = data
        })
    },[])
    return (
        <div id="clientSite">
            
        </div>
    )
}