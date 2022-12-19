import { flexbox, HStack, VStack } from "@chakra-ui/react"
import { type } from "@testing-library/user-event/dist/type"
import React, { useEffect, useState } from "react"
import DropdownLink from "./DropdownLink"
import NavigationLink from './NavigationLink'

export default function NavigationLinks(props){
    const {
        url,
        isHorizontal,
        links,
        linkNames,
        linkContents,
        linkParents,
        linkTypes,
        renderLink
    } = props

    const [restAnswers, setRestAnswers] = useState({})
    const [restLiveboards, setRestLiveboards] = useState({})
    
    useEffect(()=>{
      window.addEventListener('save', function(e){
        console.log('itsaved again')
        loadRestContent()
      })
      loadRestContent()
    },[])
    async function getLiveboards(restURLParams){
      var baseURL = url.replace("#/","").replace("#","")
      return await fetch(baseURL+"callosum/v1/tspublic/v1/metadata/list?type=PINBOARD_ANSWER_BOOK"+restURLParams,
      {
        credentials: 'include',
      })
      .then(response => response.json()).then(
        data => data.headers)
    }
    async function getAnswers(restURLParams){
      var baseURL = url.replace("#/","").replace("#","")
      return await fetch(baseURL+"callosum/v1/tspublic/v1/metadata/list?type=QUESTION_ANSWER_BOOK"+restURLParams,
      {
        credentials: 'include',
      })
      .then(response => response.json()).then(
        data => data.headers)
    }
  
    async function loadRestContent(){
      var restConfigs = []
      for (var link of links){
        if (linkTypes[link]=='Rest'){
          var type = "all"
          var restURLParams = "" 
          var catType = "ALL"
          var batchsize = 5
          if (linkContents[link]){
            var params = linkContents[link].split("|")
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


    var linkContainers = []
    var topLevel = []
    for (var link of links){
      if (!linkParents[link] || linkParents[link]=='None'){
        topLevel.push(link)
      }
    }
    for (var link of topLevel){
      var childrenLinks = []
      if (linkTypes[link]=='Rest' && restAnswers && restAnswers[link]){
        for (var contentItem of restAnswers[link]){
          childrenLinks.push(
            <DropdownLink 
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
      if (linkTypes[link]=='Rest' && restLiveboards && restLiveboards[link]){
        for (var contentItem of restLiveboards[link]){
          childrenLinks.push(
            <DropdownLink
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
      for (var child of links){
        if (linkParents[child]==linkNames[link]){
          childrenLinks.push(
            <DropdownLink
            key={child}
            id={child}
            name={linkNames[child]}
            content={linkContents[child]}
            type={linkTypes[child]}
            renderLink={renderLink}
            isHorizontal={isHorizontal}
          />
          )
        }
      }
      linkContainers.push(<NavigationLink
        key={link}
        id={link}
        name={linkNames[link]}
        content={linkContents[link]}
        type={linkTypes[link]}
        renderLink={renderLink}
        children={childrenLinks}
        isHorizontal={isHorizontal}
      />)
    }
      
    return (
      <div style={{display:'flex',alignItems:isHorizontal?"flex-end":'inherit'}}>
      {isHorizontal ? 
      <HStack alignItems={"flex-end"}>
        {linkContainers}
      </HStack>
      : 
      <VStack w={"100%"} alignItems={"flex-start"}>
      {linkContainers}
      </VStack>
      }
      </div>

    )
}