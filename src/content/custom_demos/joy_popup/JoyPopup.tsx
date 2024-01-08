import { EmbedEvent, HostEvent, LiveboardEmbed, SearchEmbed, useEmbedRef , Action, RuntimeFilterOp, RuntimeFilter} from "@thoughtspot/visual-embed-sdk/react"
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
        embedRef.current.on(EmbedEvent.VizPointClick,(data)=>{
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
            liveboardId={"596c6953-50d2-4d13-bdd9-10025565059b"}
            fullHeight={true}
            frameParams={{width:'100%',height:'100%'}}
            />   
        <SearchPopup></SearchPopup>

        </>
    )
}
function SearchPopup(){

    const embedRef = useEmbedRef<typeof LiveboardEmbed>();
    const [campaignFilter, setCampaignFilter] = useState<RuntimeFilter>({
        columnName:'Campaign Name',
        operator:RuntimeFilterOp.IN,
        values:[]
    })
    const ref = useRef(null);
    window.addEventListener('JoySearch', function(e: any){
        console.log(e)
        let eventData = e.detail.data.data
        ref.current.style.display = 'flex';
        let campaignFilter:RuntimeFilter;
        for (var attribute of eventData.clickedPoint.selectedAttributes){
            if (attribute.column.name=='Campaign Name'){
                campaignFilter = {
                    columnName: 'Campaign Name',
                    operator: RuntimeFilterOp.IN,
                    values: [attribute.value]
                }
            }
        }
        setCampaignFilter(campaignFilter)
        // console.log(campaignFilter,"campaignFilter")
        // embedRef.current.trigger(HostEvent.UpdateRuntimeFilters,[campaignFilter])
        // embedRef.current.render()
    })
    function ClosePopup(){
        ref.current.style.display = 'none';
    }
    return (
        <div ref={ref}
        style={{position:'absolute',top:'10%',left:'10%',width:'75%',height:'75%', display:'none',boxShadow:'0 0 155px #cccccc'}}>
            <div style={{display:'flex',flexDirection:'column',width:'100%',height:'100%'}}>
                <div style={{marginLeft:'5px'}} onClick={ClosePopup}>X</div>
            <LiveboardEmbed 
                runtimeFilters={[
                    campaignFilter
                ]}
                liveboardId="163e263c-a5e0-42ac-a1f4-3cd9e06a5003"
                ref={embedRef}
                visibleActions={[Action.Download]}
                
            />
            </div>
        </div>
    )
}