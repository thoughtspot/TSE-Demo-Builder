import { HStack } from "@chakra-ui/react";
import React from "react";
import Filter from "./Filter"
export default function Filters(props){
    const {
        links,
        linkTypes,
        linkNames,
        linkParents,
        linkContents,
        setField,
        setFilter,
        selectedFilters,
        renderName
    }= props

    var filters = []
    for (var link of links){
        if ((linkTypes[link]=='Filter' || linkTypes[link]=='Field' || linkTypes[link]=='Date Filter') && linkParents[link]==renderName){
        var filterContent = linkContents[link].split("|")
        var  hasSelectAll = true;
        var filterValues = filterContent[0].split(',')
        var filterLabels = []
        
        if (linkTypes[link]=='Field'){
            var filterOptions = []
            for (var val of filterValues){
            filterOptions.push(val.split(":")[0])
            filterLabels.push(val.split(":")[1])
            }
            filterValues = filterOptions
        }else{
            filterLabels = filterValues
        }
        var filterName = linkNames[link]
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
        if (linkTypes[link]){
            filterType= linkTypes[link]
        }
        var options = []
        for (var filerValKey in filterValues){
            options.push({'value':filterValues[filerValKey],'label':filterLabels[filerValKey]})
        }
        
        if (selectedFilters[filterName]){
            filters.push(
                <Filter 
                    type={filterType} 
                    setField={setField} 
                    hasSelectAll={hasSelectAll} 
                    filterName={filterName} 
                    options={options} 
                    setFilter={setFilter} 
                    defaultValues={selectedFilters[filterName]}
                ></Filter>)
        }else{
            filters.push(
                <Filter 
                    type={filterType} 
                    setField={setField}  
                    hasSelectAll={hasSelectAll} 
                    filterName={filterName} 
                    options={options} 
                    setFilter={setFilter}
                ></Filter>)
        }
        
        }
    }
    return (
        <HStack>
            {filters}
        </HStack>
    )
}