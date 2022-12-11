import React, { useState, useEffect } from 'react';
import { init,  AuthType, Page, EmbedEvent, Action, HostEvent, LiveboardEmbed} from '@thoughtspot/visual-embed-sdk';
import { SimpleGrid, Box, Text, HStack, Flex, VStack, Image, Drawer, DrawerContent, useColorModeValue, Icon, Input } from '@chakra-ui/react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
  } from 'react-icons/fi';
import TabbedLiveboard from './TabbedLiveboard'
function Tabs(props){
    const{
        tsURL,
        worksheet
    } = props
    const [data,setData] = useState('')
    const [selectedTab, setSelectedTab] = useState('Identities Overview')
    useEffect(() => {
        let query = "[Number of Employees] [Status]"       
        let worksheet = "fec33004-d42b-44aa-b74c-b33aa47132f0"   
        let liveboard = ""  
        var url = tsURL+"callosum/v1/tspublic/v1/searchdata?query_string="+encodeURIComponent(query)+
        "&data_source_guid="+worksheet+"&batchsize=-1&pagenumber=-1&offset=-1&formattype=COMPACT"
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
                setData(data.data)
        })
    },[])
    function onClose(e){
        console.log("onclose",e)
    }
    function isOpen(e){
        console.log("isOpen",e)
    }
    const LinkItems = [
        { name: 'Identities Overview', icon: FiHome, onClick:()=>setSelectedTab('Identities Overview'),isSelected:selectedTab=='Identities Overview'},
        { name: 'All Identities', icon: FiTrendingUp, onClick:()=>setSelectedTab('All Identities'),isSelected:selectedTab=='All Identities' },
        { name: 'Explore', icon: FiCompass, onClick:()=>setSelectedTab('Explore'),isSelected:selectedTab=='Explore' },
        { name: 'Favourites', icon: FiStar, onClick:()=>setSelectedTab('Favourites'),isSelected:selectedTab=='Favourites' },
        { name: 'Settings', icon: FiSettings, onClick:()=>setSelectedTab('Settings'),isSelected:selectedTab=='Settings' },
      ];
    return(
        <div style={{display:'flex',flexDirection:'row',background:'#f6f8fa'}}>
            <Box maxW={250} backgroundColor="#ffffff">
                <VStack padding={5}>
                
                {LinkItems.map((link) => (
                    <NavItem color={link.isSelected ? "blue" : "#232323"} borderLeft={link.isSelected ? "4px solid blue" : "4px solid white"} onClick={link.onClick} maxH={10} key={link.name} icon={link.icon}>
                    {link.name}
                    </NavItem>
                ))}
                </VStack>
            </Box>
            
            <VStack padding={5}>
            <Box padding={5} maxH={100} marginBottom={selectedTab =='All Identities' ? 10 : 0}>
                <Text fontSize={18} fontWeight={600} marginBottom={5}>{selectedTab}</Text>
                <Input borderRadius={20} borderColor="blue" backgroundColor={'#ffffff'}></Input>
            </Box>
            {selectedTab =='All Identities' ? 
            <TabbedLiveboard></TabbedLiveboard>
            :
            <SimpleGrid padding={5} paddingTop={10} columns={2} spacing={10}>
                <Tab data={data} setSelectedTab={setSelectedTab}></Tab>
                <Tab data={data} setSelectedTab={setSelectedTab}></Tab>
                <Tab data={data} setSelectedTab={setSelectedTab}></Tab>

            </SimpleGrid>
            }    
            </VStack>

        </div>
    )
}
export default Tabs;

function Tab(props){
    const {
        data,
        setSelectedTab
    } = props
    console.log("this is dta",data)
    return (
        <Box padding={5} maxH={350} background='#ffffff' borderRadius={5} boxShadow="0 0 10px #dddddd">
            <VStack>
            <HStack maxH={30}>
                <Flex>
                    <Text fontWeight={600} fontSize={18}>Identities Managed</Text>
                </Flex>
                <Flex justifyContent={"flex-end"}>
                    <Text fontWeight={600} color="blue" fontSize={14} _hover={{cursor:'pointer',color:'blue.200'}}  paddingRight={5}>RUN CERTIFICATION</Text>
                    <Text fontWeight={600} color="blue" fontSize={14} _hover={{cursor:'pointer',color:'blue.200'}} onClick={()=>setSelectedTab('All Identities')}>VIEW ALL</Text>
                </Flex>
            </HStack>
            <HStack maxH={60} alignItems="center">
                <Text paddingLeft={5} fontWeight={600} fontSize={45}>{data ? data[0][1].toLocaleString() : null}</Text>
                <Image w="50" h="50" src='/icons/user.png'></Image>
            </HStack>
            <HStack maxH={40} paddingTop={5} alignItems="center">
                <Flex alignItems={"center"}>
                <Box maxW={2} bgColor="green" borderRadius={5}></Box>
                <Text paddingLeft={4} fontWeight={600} fontSize={18}>{data ? data[1][1].toLocaleString() : null}</Text>
                <Text paddingLeft={2} fontSize={18}>Added Recently</Text>
                </Flex>
                <Flex justifyContent="flex-end">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -5 24 24" width="24" fill="currentColor"><path d="M5.314 7.071l-4.95-4.95A1 1 0 0 1 1.778.707l5.657 5.657a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-1.414-1.414l4.95-4.95z"></path></svg>
                </Flex>
            </HStack>
            <HStack paddingTop={5}  maxH={40} alignItems="center">
                <Flex alignItems={"center"}>
                <Box maxW={2} bgColor="#dedede" borderRadius={5}></Box>
                <Text paddingLeft={4} fontWeight={600} fontSize={18}>{data ? data[2][1].toLocaleString() : null}</Text>
                <Text paddingLeft={2} fontSize={18}>With Pending Approvals</Text>
                </Flex>
                <Flex justifyContent="flex-end" alignItems={"center"}>
                    <Flex background="#ff2a1266" color="#ff2a12" maxW={8} maxH={8} justifyContent="center" alignItems={"center"}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -3 24 24" width="24" fill="currentColor"><path d="M12.8 1.613l6.701 11.161c.963 1.603.49 3.712-1.057 4.71a3.213 3.213 0 0 1-1.743.516H3.298C1.477 18 0 16.47 0 14.581c0-.639.173-1.264.498-1.807L7.2 1.613C8.162.01 10.196-.481 11.743.517c.428.276.79.651 1.057 1.096zm-2.22.839a1.077 1.077 0 0 0-1.514.365L2.365 13.98a1.17 1.17 0 0 0-.166.602c0 .63.492 1.14 1.1 1.14H16.7c.206 0 .407-.06.581-.172a1.164 1.164 0 0 0 .353-1.57L10.933 2.817a1.12 1.12 0 0 0-.352-.365zM10 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-9a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1z"></path></svg>
                    </Flex>
                    <Text paddingLeft={2} paddingRight={2} fontSize={16}>Overdue 7 Days</Text>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -5 24 24" width="24" fill="currentColor"><path d="M5.314 7.071l-4.95-4.95A1 1 0 0 1 1.778.707l5.657 5.657a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-1.414-1.414l4.95-4.95z"></path></svg>
                </Flex>
            </HStack>
            <HStack paddingTop={5} maxH={40} alignItems="center">
                <Flex alignItems={"center"}>
                <Box maxW={2} bgColor="#dedede" borderRadius={5}></Box>
                <Text paddingLeft={4} fontWeight={600} fontSize={18}>{data ? data[3][1].toLocaleString() : null}</Text>
                <Text paddingLeft={2} fontSize={18}>Need Certification</Text>
                </Flex>
                <Flex justifyContent="flex-end" alignItems={"center"}>
                    <Flex background="#ff2a1266" color="#ff2a12" maxW={8} maxH={8} justifyContent="center" alignItems={"center"}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -3 24 24" width="24" fill="currentColor"><path d="M12.8 1.613l6.701 11.161c.963 1.603.49 3.712-1.057 4.71a3.213 3.213 0 0 1-1.743.516H3.298C1.477 18 0 16.47 0 14.581c0-.639.173-1.264.498-1.807L7.2 1.613C8.162.01 10.196-.481 11.743.517c.428.276.79.651 1.057 1.096zm-2.22.839a1.077 1.077 0 0 0-1.514.365L2.365 13.98a1.17 1.17 0 0 0-.166.602c0 .63.492 1.14 1.1 1.14H16.7c.206 0 .407-.06.581-.172a1.164 1.164 0 0 0 .353-1.57L10.933 2.817a1.12 1.12 0 0 0-.352-.365zM10 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-9a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1z"></path></svg>
                    </Flex>
                    <Text paddingLeft={2} paddingRight={2} fontSize={16}>Due in 2 Days</Text>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -5 24 24" width="24" fill="currentColor"><path d="M5.314 7.071l-4.95-4.95A1 1 0 0 1 1.778.707l5.657 5.657a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-1.414-1.414l4.95-4.95z"></path></svg>
                </Flex>
            </HStack>
            </VStack>
        </Box>
    )
}



const NavItem = ({ icon, children, ...rest }) => {
    return (
        <Flex
          align="center"
          p="4"
          mx="4"
          role="group"
          cursor="pointer"
          _hover={{
            borderLeft: '4px solid blue',
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