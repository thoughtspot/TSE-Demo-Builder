import React, { useEffect, useState } from 'react';
import { init,  AuthType, Page, EmbedEvent, Action, HostEvent, RuntimeFilterOp} from '@thoughtspot/visual-embed-sdk';
import SurveyLiveboard from "../surveys/SurveyLiveboard"
import {
  ChakraProvider,
  Box,
  VStack,
  extendTheme,
  filter,
  Th,
  Table,
  Tbody,
  Td,
  Tr,
  Thead,
  HStack,
  Heading

} from '@chakra-ui/react';
import { MultiSelect } from 'chakra-multiselect'
import { LiveboardEmbed } from '@thoughtspot/visual-embed-sdk/react';



const instanceURL = "https://my1.thoughtspot.cloud"
const topicColumn = "Wave Text"
const questionColumn = "Question Title"
const worsheetUUID = "2b273100-c684-48ee-8a7a-296804a654ca"


const selectOneLiveboard = "51203ab6-5e41-4ffb-b67f-0e08400a5064"
const selectManyLivebaord = "cc1fc936-70b5-4c99-a6f1-4dad8777f956"


const liveboardTypeMap = {
  "Thinking about the number of bottles you have just indicated, approximately how different are these amounts compared with this time last year?":selectOneLiveboard,
  "You said you would be likely to buy the following beverage categories. From the beverage categories you selected earlier, do you intend to purchase these for yourself, or as a gift, over the next 6 months?":selectOneLiveboard,
  "This question is about your drinking habits when you are at home. For which of the following types of occasions have you drunk alcoholic beverages in the past 4 weeks?":selectOneLiveboard,
  "The next question is about your drinking habits when you are socializing. For which of the following types of occasions have you drunk alcoholic beverages in the past 4 weeks?":selectOneLiveboard,
  "When you purchased your multi-pack, do you remember if it contained just one type of product or was a variety pack / mixed case, or a gift pack?":selectOneLiveboard,
  "Bearing in mind the recent coronavirus pandemic, how do you feel, at the moment, about doing the following activities?":selectManyLivebaord,
  "Thinking about your answers to the previous question, how would your view change – if at all – if the following things happened:":selectManyLivebaord,
  "Based on what you know at the moment, how likely are you to do the following over the next few months?":selectManyLivebaord,
  "Thinking further ahead, what are your priorities for the next 12-18 months for the following?":selectManyLivebaord,
  "Bearing in mind the events of recent months, to what extent are your purchasing decisions influenced by brands or companies which actively support the following?":selectManyLivebaord,
}


export default function SurveyRicky(props) {

  const [questions,setQuestions] = useState([])
  const [filteredQuestions,setFilteredQuestions] = useState([])
  const [topics,setTopics] = useState([])
  const [topic,setTopic] = useState('')

  const [question,setQuestion] = useState('')
  const [questionType,setQuestionType] = useState('')


  function getTopics(filter){
    let queryString = "["+topicColumn+"] [Wave] != '{null}'"

    var url = instanceURL + "/callosum/v1/tspublic/v1/searchdata?query_string="+encodeURIComponent(queryString)+
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
          var possibleTopics = []
          for (var row of data.data){
              possibleTopics.push({
                label: row[0], value: row[0]
              })
          }
          setTopics(possibleTopics)
    })
  }
  useEffect(()=>{
    getTopics("")
  },[])
  useEffect(()=>{
    console.log("new question",question)
  },[question])


  function setTopicVal(newTopics){
    let queryString = "["+questionColumn+"] [Number of Replies] sort by [Number of Replies] descending"
    for (var selectedTopic of newTopics){
      queryString += " ["+topicColumn+"]."+"'"+selectedTopic+"'"
    }
    var url = instanceURL+ "/callosum/v1/tspublic/v1/searchdata?query_string="+encodeURIComponent(queryString)+
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
          setQuestions(data.data)
          setFilteredQuestions(data.data)
    })
    setTopic(newTopics)
  }
  let trows = []
  function toggleQuestionPopup(selectedQuestion){
    console.log(question,selectedQuestion)
    if (question == selectedQuestion){
      setFilteredQuestions(questions)
      setQuestion(null)
    }else{
      setFilteredQuestions(questions.filter((val) => val[0] == selectedQuestion))
      setQuestion(selectedQuestion)
    }

  }
  for (var row of filteredQuestions){
    trows.push(
      <TableRow question={row[0]} count={row[1]} toggleQuestionPopup={toggleQuestionPopup}></TableRow>
    )
  }
  return (
      <Box textAlign="left" fontSize="xl" alignItems="flex-start" p={30} h="100%" overflowY={"auto"}>
        <Heading as='h1' fontSize={32} marginBottom={2}>Beverage Intelligence</Heading>  
        <Heading as='h2' fontSize={18} marginBottom={4}>Analytics Explorer</Heading>  
          <VStack marginBottom={14}>
                <MultiSelect 
                  fontSize={14}
                  value={topic ? topic : []}
                  options={topics ? topics : []}
                  label='Choose a Survey Wave'
                  onChange={setTopicVal}
                />
          </VStack>
        <Table marginBottom={8}>
          <Thead>
            <Tr>
            <Th>Question</Th>
            <Th># of Responses</Th>
            </Tr>
          </Thead>
          <Tbody>
          {trows}
          </Tbody>
        </Table>
        <LiveboardEmbed 
        runtimeFilters={ [{
            columnName: questionColumn,
            operator: RuntimeFilterOp.IN,
            values: [question]
          }]}
        liveboardId={liveboardTypeMap[question]} 
        frameParams={{height:'1200px',width:'100%'}}/>

      </Box>
  );
}
function TableRow(props){
  const {
    question,
    count,
    type,
    toggleQuestionPopup,
  } = props
  function handleQuestionClick(){
    toggleQuestionPopup(question)
  }
  return (
    <Tr>
      <Td  fontSize={14} _hover={{
              background: "white",
              color: "teal.500",
            }}
            onClick={handleQuestionClick} >
        {question}
      </Td>

      <Td  fontSize={14}>
        {count.toLocaleString()}
      </Td>      
    </Tr>
  )
}
