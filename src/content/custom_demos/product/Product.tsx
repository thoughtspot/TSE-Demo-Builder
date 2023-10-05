import { HostEvent } from "@thoughtspot/visual-embed-sdk";
import { SearchEmbed, useEmbedRef } from "@thoughtspot/visual-embed-sdk/react";
import React, { useEffect, useRef, useState } from "react";


const baseSearch = '[Sales] [Product] [Brand] [Transaction Date] [Category] [Age Group] [Store Name]'
const worsheetUUID = "782b50d1-fe89-4fee-812f-b5f9eb0a552d";

export default function ProductDemo(props){
    const {
        tsURL
    } = props
    const [searchString, setSearchString] = useState(baseSearch)
    const [data, setData] = useState([])
    const embedRef = useEmbedRef<typeof SearchEmbed>();

    useEffect(()=>{
        let queryString = '[Category] [Department] [Product] sort by [Category] sort by [Department]'
        var url = tsURL + "callosum/v1/tspublic/v1/searchdata?query_string="+encodeURIComponent(queryString)+
        "&data_source_guid="+worsheetUUID+"&batchsize=-1&pagenumber=-1&offset=-1&formattype=COMPACT"
        fetch(url,
        {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method:'POST',
            credentials: 'include',
        })
        .then(response => response.json()).then(
            data => {
            setData(convertData(data.data))
        })
    },[])
    function setFilter(value){
        setSearchString(`${baseSearch} [Product].'${value}'`)
        // embedRef.current.trigger(HostEvent.Search,{
        //     searchQuery:`${baseSearch} [Product].'${value}'`,
        //     dataSourceIds:[worsheetUUID],
        //     execute: true
        // })
    }
    return (
        <div style={{display:'flex',flexDirection:'row',width:'100%', height:'100%'}}>
            <div style={{display:'flex',width:'300px',padding:'15px'}}>
            <CollapsibleTreeList setFilter={setFilter} data={data}
            ></CollapsibleTreeList>
            </div>

            <SearchEmbed 
                forceTable={true}
                ref={embedRef} 
                searchOptions={{
                    searchTokenString: searchString,
                    executeSearch: true,
                }}
                dataSources={[worsheetUUID]} 
                hideDataSources={true} 
                frameParams={{width:'100%',height:'100%'}}></SearchEmbed>
        </div>
    )
}

const CollapsibleTreeList = ({ data, setFilter }) => {
    const [expandedItems, setExpandedItems] = useState([]);
  
    const handleItemClick = (item) => {
        if (Array.isArray(item)){
            if (expandedItems.includes(item)) {
                setExpandedItems(expandedItems.filter((i) => i !== item));
            } else {
                setExpandedItems([...expandedItems, item]);
            }
        }
        else{
            setFilter(item)
        }
    };
  
    const renderTree = (items) => {
      return items.map((item, index) => (
        <div key={index}>
          <span onClick={() => handleItemClick(item)}>
            {Array.isArray(item) ? item[0] : item} {/* Category */}
          </span>
          {expandedItems.includes(item) && item[1] && item[1].length > 0 && (
            <div style={{ marginLeft: 10 }}>{renderTree(item[1])}</div>
          )}
          {expandedItems.includes(item) && item[2] && item[2].length > 0 && (
            <div style={{ marginLeft: 20 }}>
              {item[2].map((product, index) => (
                <div key={index}>{product}</div>
              ))}
            </div>
          )}
        </div>
      ));
    };
  
    return <ul>{renderTree(data)}</ul>;
  };
  
  const convertData = (inputData) => {
    const data = [];
  
    inputData.forEach((row) => {
      const category = row[0];
      const department = row[1];
      const product = row[2];
  
      let categoryIndex = -1;
      let departmentIndex = -1;
  
      // Find the index of the category in the data array
      for (let i = 0; i < data.length; i++) {
        if (data[i][0] === category) {
          categoryIndex = i;
          break;
        }
      }
  
      // If the category doesn't exist, add it to the data array
      if (categoryIndex === -1) {
        data.push([category, []]);
        categoryIndex = data.length - 1;
      }
  
      // Find the index of the department in the category
      for (let i = 0; i < data[categoryIndex][1].length; i++) {
        if (data[categoryIndex][1][i][0] === department) {
          departmentIndex = i;
          break;
        }
      }
  
      // If the department doesn't exist, add it to the category
      if (departmentIndex === -1) {
        data[categoryIndex][1].push([department, []]);
        departmentIndex = data[categoryIndex][1].length - 1;
      }
  
      // Add the product to the department
      data[categoryIndex][1][departmentIndex][1].push(product);
    });
    console.log(data)
    return data;
  };
  
  