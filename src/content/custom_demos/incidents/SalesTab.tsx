import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import React, { useState, useEffect } from "react"
import { currencyFormatter } from "../../../util/Util"
//@ts-ignore
import salesImage from './sales.png'
import { SelectedTab } from "./Tabs"

export default function SalesTab(props){
    const {
        isSelected,
        setSelectedTab,
        tsURL
    } = props
    const [data,setData] = useState('')
    useEffect(() => {
        var url = tsURL+"api/rest/2.0/metadata/answer/data"
        fetch(url,
        {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method:'POST',
            credentials: 'include',
            body: JSON.stringify({
                "metadata_identifier": "34808ec3-1272-4723-8339-fab426c9772a",
                "record_offset": 0,
                "record_size": 10
            })
        })
        .then(response => response.json()).then(
            data => {
                setData(data.contents[0].data_rows)
        })
    },[])
    console.log("sales data",data)

    let variance: number = 0;
    if(data) variance = Math.round(Number(data[0][0]) * 10000)/10;
    return (
        <div style={{display:"flex",flexDirection:"row",padding:15,maxHeight:250,marginBottom:25,background:"#ffffff",borderRadius:"25px",boxShadow:"0 0 15 #efefef"}}>
          <div style={{display:"flex",flexDirection:"column",width:"calc(100% - 175px)",justifyContent:'space-between',height:'100%'}}>
            <div style={{display:"flex",flexDirection:"row",alignItems:"center", padding:5, width:"100%"}}>
                <div style={{fontSize:"20px",fontWeight:600,marginLeft:5,marginRight:5,width:"50%"}}>Sales Insights</div>
            </div>
            <VStack h={100} alignItems="flex-start" justifyContent={"center"} paddingLeft={5} >
                <Text paddingTop={5} fontWeight={600} fontSize={36}>{data ? currencyFormatter.format(Number(data[0][2])) : null}
                </Text>
                <Text>
                This week
                </Text>
            </VStack>
            <div style={{display:"flex",flexDirection:"row"}}>
                <HStack marginRight={7} maxH={40} paddingTop={5} alignItems="center">
                    <Flex alignItems={"center"}>
                    <Box maxW={2} bgColor="green" borderRadius={5}></Box>
                    <Text paddingLeft={4} fontWeight={600} fontSize={18}>{data ? currencyFormatter.format(Number(data[0][1])) : null}</Text>
                    <Text paddingLeft={2} fontSize={14}>Last Week</Text>
                    </Flex>
                </HStack>
                <HStack marginRight={7} paddingTop={5}  maxH={40} alignItems="center">
                    <Flex alignItems={"center"}>
                    <Box maxW={2} bgColor="#dedede" borderRadius={5}></Box>
                    <Text paddingLeft={4} fontWeight={600} color={variance > 0 ? 'green' : 'red'} fontSize={18}>{data ?  variance: null}%</Text>
                    <Text paddingLeft={2} fontSize={14}>Week Over Week</Text>
                    </Flex>
                </HStack>
            </div>

            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',marginBottom:'5px'}}>
                <img style={{height:'150px'}} src={salesImage} >
                </img>
                <Text fontWeight={600} color="blue" fontSize={14} _hover={{cursor:'pointer',color:'blue.200'}} 
                    onClick={()=>isSelected ? setSelectedTab(SelectedTab.ALL) : setSelectedTab(SelectedTab.SALES)}>{isSelected ? 'VIEW ALL' : 'EXPLORE'}</Text>            

                            </div>
        </div>
    )
}