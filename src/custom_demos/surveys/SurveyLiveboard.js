import { LiveboardEmbed, useEmbedRef } from '@thoughtspot/visual-embed-sdk/react';


export default function SurveyLiveboard(props){
    const {
        question,
        questionColumn,
        liveboardId
    } = props 
    return (
        <LiveboardEmbed 
        runtimeFilters={ [{
            columnName: [questionColumn],
            operator: 'IN',
            values: [question]
          }]}
        liveboardId={liveboardId} 
        frameParams={{height:'1200px',width:'100%'}}>
        </LiveboardEmbed>
    )
}