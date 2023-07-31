import { StyleOptionList } from "./PreBuiltStyles"

export interface Settings {
    name: string,
    URL: string,
    links: string[],
    linkTypes: {},
    linkNames: {},
    linkContents: {},
    linkParents: {},
    primaryColor: string,
    secondaryColor: string,
    buttonColor: string,
    backgroundColor: string,
    orientation: string,
    prebuiltStyle: StyleOptionList | undefined,
    logoImage: string
  }
export interface DemoPage {
    id: PageName
    name: string,
    configName: Placeholder,
    configDesc: string
}
enum Placeholder {
    Link = 'Link Name',
    Column = 'Column Name',
    None = 'Placeholder'
}
export enum PageName {
    Search = 'Search',
    SearchBar = 'Search Bar',
    Answer ='Answer',
    Filter = 'Filter',
    Field = 'Field',
    SearchString ='Search String',
    Liveboard='Liveboard',
    URL ='URL',
    Image = 'Image',
    App = 'App',
    Menu = 'Menu',
    None = 'None',
    Rest = 'Rest',
    Advanced ='Advanced',
    DateFilter = 'Date Filter',
    Tabbed = 'Tabbed Widgets',
    Survey = 'Survey Demo',
    ABTest = 'ABTest',
    ProductList = 'ProductList',
    OnImageViz = 'On Image Viz'
}
export const defaultPages: DemoPage[] = [
    {
        id: PageName.None,
        name: 'None',
        configName: Placeholder.Link,
        configDesc: 'No Config'
    },
    {
        id: PageName.Menu,
        name: 'Menu',
        configName: Placeholder.Link,
        configDesc: 'No Config'
    },
    {
        id: PageName.Search,
        name: 'Search',
        configName: Placeholder.Link,
        configDesc: 'WorksheetGUID|hideDataSources=false|disableAction=Action.Share|disableAction=Action.Save',
    },
    {
        id: PageName.SearchBar,
        name: 'Search Bar',
        configName: Placeholder.Link,
        configDesc: 'WorksheetGUID|hideDataSources=false|disableAction=Action.Share|disableAction=Action.Save', 
    },
    {
        id: PageName.Liveboard,
        name: 'Liveboard',
        configName: Placeholder.Link,
        configDesc: 'LiveboardGUID|disableAction=Action.Share|disableAction=Action.Save', 
    },
    {
        id: PageName.Answer,
        name: 'Answer',
        configName: Placeholder.Link,
        configDesc: 'AnswerGUID|hideDataSources=false|disableAction=Action.Share|disableAction=Action.Save', 
    },
    {
        id: PageName.App,
        name: 'Full App',
        configName: Placeholder.Link,
        configDesc: 'No Config', 
    },
    {
        id: PageName.Filter,
        name: 'Filter (Liveboard & Search String)',
        configName: Placeholder.Column,
        configDesc: 'East,West,South,North', 
    },
    {
        id: PageName.Field,
        name: 'Field (Search String)',
        configName: Placeholder.None,
        configDesc: '[Region]:Region,[Timestamp].detailed:Detailed Time', 
    },
    {
        id: PageName.SearchString,
        name: 'Search String',
        configName: Placeholder.Link,
        configDesc: '[tml] [search] [query] |WorksheetGUID|hideDataSources=false', 
    },
    {
        id: PageName.Image,
        name: 'Image',
        configName: Placeholder.Link,
        configDesc: 'No Config', 
    },
    {
        id: PageName.URL,
        name: 'URL',
        configName: Placeholder.Link,
        configDesc: 'URL of website or imagee', 
    },
    {
        id: PageName.Rest,
        name: 'REST Content List',
        configName: Placeholder.Link,
        configDesc: 'tags=Retail Sales|category=my|sort=CREATED|type=liveboard', 
    },
    {
        id: PageName.Advanced,
        name: 'Custom Demo: Search String Builder',
        configName: Placeholder.Link,
        configDesc: 'WorksheetGUID', 
    },
    {
        id: PageName.Tabbed,
        name: 'Custom Demo: Tabbed Widgets',
        configName: Placeholder.Link,
        configDesc: 'No Config - Must use SE Cloud'
    },
    {
        id: PageName.Survey,
        name: 'Custom Demo: Survey Demo',
        configName: Placeholder.Link,
        configDesc:'No Config - Must use SE Cloud' 
    },
    {
        id: PageName.ABTest,
        name: 'Custom Demo: A / B Testing',
        configName: Placeholder.Link,
        configDesc: 'No Config - Must use SE Cloud', 
    },
    {
        id: PageName.ProductList,
        name: 'Custom Demo: Product List',
        configName: Placeholder.Link,
        configDesc: 'No Config - Must use SE Cloud', 
    },
    {
        id: PageName.OnImageViz,
        name: 'OnImageViz',
        configName: Placeholder.Link,
        configDesc: 'Viz Idx', 
    },
]



