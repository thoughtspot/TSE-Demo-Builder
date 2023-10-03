import React, { useState, useEffect } from 'react';
import { init,  AuthType, Page, EmbedEvent, Action, HostEvent, RuntimeFilterOp} from '@thoughtspot/visual-embed-sdk';
import { SimpleGrid, Box, Text, HStack, Flex, VStack, Image, Drawer, DrawerContent, useColorModeValue, Icon, Input } from '@chakra-ui/react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
  } from 'react-icons/fi';
  import { useEmbedRef } from'@thoughtspot/visual-embed-sdk/react';

import { LiveboardEmbed } from '@thoughtspot/visual-embed-sdk/react';
//import demographicImage from './demographics.png'

//@ts-ignore
import demographicImage from './demographics.png'
import SalesTab from './SalesTab';
import CategoryTab from './CategoryTab';
import CustomerTab from './CustomerTab';
import StoreTab from './StoreTab';
import { MultiSelect } from 'react-multi-select-component';
import './Tabs.css'


export enum SelectedTab {
    NONE = 'None',
    ALL = 'Performance Hub',
    SALES = 'Sales Insights',
    CUSTOMER = 'Customer Insights',
    STORE = 'Store Insights',
    CATEGORY = 'Category Insights'
}
const liveboardId = "5fc750d7-dd94-4638-995c-31f0434ce2a0"

function Tabs(props){
    const{
        tsURL,
        worksheet
    } = props
    const embedRef = useEmbedRef();
    const [selectedTab, setSelectedTab] = useState(SelectedTab.ALL)
    const [categoryFilterValue, setCategoryFilterValue] = useState([])
    const [categoryTSFilter, setCategoryTSFilter] = useState({})
    const [categoryFilterOptions, setCategoryFilterOptions] = useState([])
    const [brandFilterValue, setBrandFilterValue] = useState([])
    const [brandTSFilter, setBrandTSFilter] = useState({})
    const [brandFilterOptions, setBrandFilterOptions] = useState([])
    useEffect(()=>{
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
                "metadata_identifier": "03f027d7-12a0-47b5-9ae4-7529a116f1a3",
                "record_offset": 0,
                "record_size": 80
            })
        })
        .then(response => response.json()).then(
            data => {
                let filterData = data.contents[0].data_rows;
                var categories = []
                var brands = []
                var categoryOptions = []
                var brandOptions = []
                for (var dataRow of filterData){
                    let category = {'value':dataRow[0],'label':dataRow[0]}
                    if (!categories.includes(dataRow[0])){
                        categoryOptions.push(category);
                        categories.push(dataRow[0])
                    }
                    let brand = {'value':dataRow[1],'label':dataRow[1]}
                    if (!brands.includes(dataRow[1])){
                        brandOptions.push(brand);
                        brands.push(dataRow[1]);
                    }
                }
                setCategoryFilterOptions(categoryOptions);
                setBrandFilterOptions(brandOptions);
        })

    },[])



    function onClose(e){
        console.log("onclose",e)
    }
    function isOpen(e){
        console.log("isOpen",e)
    }
    function TestFilter(){
        let filter = [{
            columnName: 'Store Region',
            operator: 'IN',
            values: ['east']
          }]
          embedRef.current.trigger(HostEvent.Filter,)
    }
    function ToggleCategoryFilter(e){
        console.log("category", e)
        var filterVals = []
        for (var i=0;i<e.length;i++){
          filterVals.push(e[i].label)
        }
        var filtersObj  = {
          columnName: 'Department',
          operator: RuntimeFilterOp.IN,
          values: filterVals
        }
        setCategoryFilterValue(e)
        setCategoryTSFilter(filtersObj)
    }
    function ToggleBrandFilter(e){
        var filterVals = []
        for (var i=0;i<e.length;i++){
          filterVals.push(e[i].label)
        }
        var filtersObj  = {
          columnName: 'Brand',
          operator: RuntimeFilterOp.IN,
          values: filterVals
        }
        setBrandFilterValue(e)
        setBrandTSFilter(filtersObj)
    }
    const LinkItems = [
        { name: SelectedTab.ALL, icon: FiHome, onClick:()=>setSelectedTab(SelectedTab.ALL),isSelected:selectedTab==SelectedTab.ALL ,subMenu:false},
        { name: SelectedTab.SALES, icon: FiTrendingUp, onClick:()=>setSelectedTab(SelectedTab.SALES),isSelected:selectedTab==SelectedTab.SALES, subMenu:true},
        { name: SelectedTab.CUSTOMER, icon: FiCompass, onClick:()=>setSelectedTab(SelectedTab.CUSTOMER),isSelected:selectedTab==SelectedTab.CUSTOMER, subMenu:true},
        { name: SelectedTab.STORE, icon: FiStar, onClick:()=>setSelectedTab(SelectedTab.STORE),isSelected:selectedTab==SelectedTab.STORE, subMenu:true},
        { name: SelectedTab.CATEGORY, icon: FiSettings, onClick:()=>setSelectedTab(SelectedTab.CATEGORY),isSelected:selectedTab==SelectedTab.CATEGORY, subMenu:true },
      ];
      var overrideStrings = {
        "allItemsAreSelected": "All Categories",
        "search": "Search Categories",
        "selectAll": "All Categories",
        "selectAllFiltered": "Select All (Filtered)",
        "selectSomeItems": "Select A Category",
        "create": "Create",
    }   
    var brandOverrideStrings = {
        "allItemsAreSelected": "All Brands",
        "search": "Search Brands",
        "selectAll": "All Brands",
        "selectAllFiltered": "Select All (Filtered)",
        "selectSomeItems": "Select A Brand",
        "create": "Create",
    } 
    let liveboardId = "5fc750d7-dd94-4638-995c-31f0434ce2a0"  
    switch (selectedTab){
        case (SelectedTab.SALES):
            liveboardId = "a34a8b8e-6dd9-492b-94cc-fbfd017f9987";
            break;
        case (SelectedTab.CATEGORY):
            liveboardId = "5fc750d7-dd94-4638-995c-31f0434ce2a0";
            break;
        case (SelectedTab.CUSTOMER):
            liveboardId = "5fc750d7-dd94-4638-995c-31f0434ce2a0";
            break;
        case (SelectedTab.STORE):
            liveboardId = "c01821a6-f730-4ac3-8742-ab3e84b635fd";
            break;
    }
    return(
        <div style={{display:'flex',flexDirection:'row',background:'#f6f8fa',width:'100%',height:'100%',padding:'10px'}}>
            <div style={{display:'flex',flexDirection:'column',maxWidth:"220px", background:'#ffffff',paddingTop:'25px'}}>
                
                {LinkItems.map((link) => (
                    <NavItem color={link.isSelected ? "blue" : "#232323"} marginBottom={2} subMenu={link.subMenu} borderRadius={10}  onClick={link.onClick} maxH={10} key={link.name} icon={link.icon}>
                    {link.name}
                    </NavItem>
                ))}
            </div>
            <div style={{display:'flex',flexDirection:'column',width:"calc(100% - 220px)",overflow:'auto',scrollbarWidth:'thin'}}>
            <Box padding={5} maxH={150} marginBottom={selectedTab ==SelectedTab.ALL ? 35 : 15}>
                <Text fontSize={18} fontWeight={600} marginBottom={5}>{selectedTab}</Text>
                <div style={{display:'flex',flexDirection:'row',height:'50px'}}>
                    <div style={{display:'flex',flexDirection:'column',height:'80px',width:'300px'}}>
                        <MultiSelect 
                            labelledBy={null}
                            hasSelectAll={true} 
                            value={categoryFilterValue} 
                            options={categoryFilterOptions} 
                            onChange={ToggleCategoryFilter}
                            overrideStrings={overrideStrings}/>
                    </div>
                    <div style={{marginLeft:10,display:'flex',flexDirection:'column',height:'80px',width:'200px'}}>
                        <MultiSelect 
                            labelledBy={null}
                            hasSelectAll={true} 
                            value={brandFilterValue} 
                            options={brandFilterOptions} 
                            onChange={ToggleBrandFilter}
                            overrideStrings={brandOverrideStrings}/>
                    </div>
                </div>

                {/* <Input borderRadius={20} width={350} borderColor="blue" backgroundColor={'#ffffff'}></Input> */}
            </Box>

            
            <div style={{display:'flex',flexDirection:'column',padding:'15px',paddingLeft:'15px',paddingRight:'15px',paddingBottom:'0px',marginBottom:'-15px'}}>
                {(selectedTab == SelectedTab.SALES || selectedTab == SelectedTab.ALL) && 
                    <SalesTab tsURL={tsURL} isSelected={selectedTab==SelectedTab.SALES} setSelectedTab={setSelectedTab} ></SalesTab>
                }
                {(selectedTab == SelectedTab.CUSTOMER || selectedTab == SelectedTab.ALL)  && 
                    <CustomerTab tsURL={tsURL} isSelected={selectedTab==SelectedTab.CUSTOMER} setSelectedTab={setSelectedTab }></CustomerTab>
                }
                {(selectedTab == SelectedTab.STORE || selectedTab == SelectedTab.ALL)  && 
                    <StoreTab tsURL={tsURL} isSelected={selectedTab==SelectedTab.STORE} setSelectedTab={setSelectedTab} ></StoreTab>
                }
                {(selectedTab == SelectedTab.CATEGORY || selectedTab == SelectedTab.ALL)  && 
                    <CategoryTab tsURL={tsURL} isSelected={selectedTab==SelectedTab.CATEGORY} setSelectedTab={setSelectedTab} ></CategoryTab>
                }
            </div>
            {selectedTab != SelectedTab.ALL &&
            <LiveboardEmbed 
                ref={embedRef} 
                customizations= {
                    {
                    style: {
                    customCSS: {
                        variables: {
                        "--ts-var-root-background": "#f6f8fa",
                        "--ts-var-viz-border-radius": "25px",
                        "--ts-var-viz-box-shadow":"0px"
                        },
                        rules_UNSTABLE: {
                            '[data-testid="pinboard-header"]': {
                                'display': 'none !important'
                            }
                        }
                        
                    }
                    }
                }
                }
                fullHeight={true}
                liveboardId={liveboardId} 
                frameParams={{width:'100%',height:'100%'}}
                />

            }
               
            </div>

        </div>
    )
}
export default Tabs;




const NavItem = ({ icon,subMenu, children, ...rest }) => {
    return (
        <Flex
          align="center"
          p="4"
          mx={subMenu ? "4" : "1"}
          role="group"
          cursor="pointer"
          background={subMenu?"#f2f2f2" :"#ffffff"}
          _hover={{
            borderLeft: subMenu ? '4px solid 0000ef66' : '0px solid #fff',
            background: '#0000ef11'
          }}
          border="4px solid white"
          fontSize={12}
          {...rest}>
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              as={icon}
            />
          )}
          {children}
        </Flex>
    );
  };