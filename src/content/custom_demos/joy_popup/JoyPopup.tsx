import { EmbedEvent, HostEvent, LiveboardEmbed, SearchEmbed, useEmbedRef } from "@thoughtspot/visual-embed-sdk/react"
import React, { useState, useEffect, useRef } from 'react';
import dateFormat, { masks } from "dateformat";

export default function JoyPopup(props){

    const {
        liveboardId,
        worksheetId,
        baseSearchString
    } = props
    const embedRef = useEmbedRef<typeof LiveboardEmbed>();

    function onLoad(){
        embedRef.current.on(EmbedEvent.CustomAction,(data)=>{
            console.log("Data",data)
            const event = new CustomEvent('JoySearch', {detail: {data: data}});
            window.dispatchEvent(event)
        })
    }

    return (
        <>
        <LiveboardEmbed 
            ref={embedRef} 
            onLoad={onLoad}
            liveboardId={"04898a8a-9a91-4fa4-8713-89700248a269"}
            fullHeight={true}
            frameParams={{width:'100%',height:'100%'}}
            />   
        <SearchPopup></SearchPopup>

        </>
    )
}
function SearchPopup(){

    const embedRef = useEmbedRef<typeof SearchEmbed>();
    const ref = useRef(null);
    window.addEventListener('JoySearch', function(e: any){
        console.log(e)
        let eventData = e.detail.data.data
        ref.current.style.display = 'flex';
        let baseSearchString = "[EmployeeID]"
        for (var attribute of eventData.contextMenuPoints.clickedPoint.selectedAttributes){
            if (attribute.column.dataType=='DATE'){
                let date = new Date(attribute.value * 1000)
                date.setDate(date.getDate()+1);
                baseSearchString += ' ['+attribute.column.referencedColumns[0].displayName+'].'+"'"+dateFormat(date,"mmmm yyyy").toLowerCase()+"'";
            }
            else{
                baseSearchString += ' ['+attribute.column.name+'].'+"'"+attribute.value+"'";
            }
        }
        console.log("esarch!!!",baseSearchString);
        embedRef.current.trigger(HostEvent.Search,{
            searchQuery: baseSearchString,
            execute: true
        })
    })
    function ClosePopup(){
        ref.current.style.display = 'none';
    }
    return (
        <div ref={ref}
        style={{position:'absolute',top:'10%',left:'10%',width:'75%',height:'75%', display:'none'}}>
            <div style={{display:'flex',flexDirection:'column',width:'100%',height:'100%'}}>
                <div onClick={ClosePopup}>X</div>
            <SearchEmbed 
                ref={embedRef}
                forceTable={true}
                dataSource="0e70c10a-079c-4c1e-9d94-3c9d4c2a4292"
                hideDataSources={true}
            />
            </div>
        </div>
    )
}