import { SearchEmbed, LiveboardEmbed, AppEmbed, SearchBarEmbed, useEmbedRef } from '@thoughtspot/visual-embed-sdk/react';


export default function TabbedLiveboard(props){
    const liveboardId = "5fc750d7-dd94-4638-995c-31f0434ce2a0"
    return(
        <LiveboardEmbed 
            liveboardId={liveboardId} 
            frameParams={{width:'100%',height:'100%'}}
        />
    )
}