import React, { useEffect, useState } from 'react';
import { init,  AuthType, Page, EmbedEvent, Action, HostEvent} from '@thoughtspot/visual-embed-sdk';
import SurveyLiveboard from "./SurveyLiveboard"
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



const instanceURL = "https://se-thoughtspot-cloud.thoughtspot.cloud"
const topicColumn = "Survey"
const questionColumn = "Question"
const worsheetUUID = "01127cd0-7762-4104-bb40-ea57d3ec5207"


const selectOneLiveboard = "89f7e70b-417c-4d18-ba5f-01087d9fdc26"
const selectManyLivebaord = "457d7c67-cdb4-46d2-a1cd-bad81e571d8f"
export default function Survey(props) {

  const [questions,setQuestions] = useState([])
  const [filteredQuestions,setFilteredQuestions] = useState([])
  const [topics,setTopics] = useState([])
  const [topic,setTopic] = useState('')

  const [question,setQuestion] = useState('')
  const [questionType,setQuestionType] = useState('')


  function getTopics(filter){
    let queryString = "["+topicColumn+"] [Survey] != '{null}'"

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
    let queryString = "["+questionColumn+"] [Number of Responses] [Type] sort by [Number of Responses] descending"
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
  function toggleQuestionPopup(selectedQuestion, type){
    if (question == selectedQuestion){
      setFilteredQuestions(questions)
      setQuestion(null)
      setQuestionType(null)
    }else{
      setFilteredQuestions(questions.filter((val) => val[0] == selectedQuestion))
      setQuestion(selectedQuestion)
      setQuestionType(type)
    }

  }
  for (var row of filteredQuestions){
    trows.push(
      <TableRow question={row[0]} count={row[2]} type={row[1]} toggleQuestionPopup={toggleQuestionPopup}></TableRow>
    )
  }
  console.log(trows)
  return (
      <Box textAlign="left" fontSize="xl" alignItems="flex-start" p={30} h="100%" overflowY={"auto"}>
        <Heading as='h1' fontSize={32} marginBottom={2}>Pew Research Center</Heading>  
        <Heading as='h2' fontSize={18} marginBottom={4}>American Trends Survey</Heading>  
        <VStack alignItems={"flex-start"}>
          <HStack marginBottom={4}>
                <MultiSelect 
                fontSize={14}
                value={topic ? topic : []}
                options={topics ? topics : []}
                label='Choose a Survey'
                onChange={setTopicVal}
                />
          </HStack>
        </VStack>
        <Table>
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
        {question && questionType=='categorical_one' ? 
          <SurveyLiveboard 
            question={question}
            questionColumn={questionColumn}
            liveboardId={selectOneLiveboard} 
            >
            </SurveyLiveboard>
            :null} 
            {question && questionType=='categorical_many'? 
          <SurveyLiveboard 
            question={question}
            questionColumn={questionColumn}
            liveboardId={selectManyLivebaord} 
                >
            </SurveyLiveboard>
            :null} 

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
    toggleQuestionPopup(question,type)
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
