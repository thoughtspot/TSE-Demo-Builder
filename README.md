

## TSE Demo Builder

This application is designed to enable quick TSE demos that mimic a client environment. This is created and maintained by the Thoughspot Sales Engineering team.


# VERSION 1.0.1

### Step 1: Installation

Install Node JS [https://nodejs.org/en/download/]. This app uses version 16.

In a terminal window:

`git clone https://github.com/thoughtspot/TSE-Demo-Builder.git` 
Clones the repository. Alternatively, download and extract the zip file.

`cd TSE-Demo-Builder` 
Navigates the terminal to the application's primary folder

`npm install`
Installs Node Modules. This will only need to be done once on installation. If you happen to rebase while pulling the latest version you will also need to run this again.

`npm start` 
Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### Updating to the latest version

Option 1. `git pull --no-rebase` To pull the latest version. If you run into problems with this use the next option.

Option 2. `git pull` and then `npm install`


### Step 2: Click the Gear Icon

This will open the configuration menu. 

### Step 3: Customize your Demo

Adjust Colors, add a logo, add navigation links. See configuration details below. Note you will need to enable CORS allowed origins on your thoughtspot instance for localhost:3000

### Step 4: Save for re-use

The settings supplied here can be saved and reloaded. Clicking save will download a text file containing the configuration JSON. This can then be re-loaded with "open"


### Configuration options

| Setting | Description |
| ------------- | ------------- |
| Settings Name | This is the name of your configuration settings. When you click save, the file will be saved with this name, allowing for re-use. |
| Thoughtspot URL | The URL of your thoughtspot instance. Note that you will need to sign into thoughtspot using your own credentials. This application is not configured for SSO. |
| Logo Image | Logo of the company your are demoing to. PNG images work best for transparency reasons.
| Primary Color | This the main color of the nav menu. This will also be the primary text color when an link is hovered over. |
| Secondary Color | Complimentary color used for text, and on-hover menus. |
| Orientation | Whether the navigation menu will be displayed on the left or top of the page |
| Links | This is the content that will show up in the nav menu. See Link Configuration for more info. |

### Link Configuration
##### Link Name
This is what will be displayed in the nav menu
##### Link Type
| Link Type | Description | Configuration |
| ------------- | ------------- | ------------- |
| None | Empty link that does nothing on click | None |
| Search | TS Search embed. | List of datasources GUIDs comma delimited |
| Answer | TS Search embed, with a default answer. | Answer GUID |
| Liveboard | TS Liveboard embed. | Liveboard GUID. |
| Menu | This link will expose a sub-menu on hover. Contents of this menu will be determined by the parent dropdown. | None |
| URL | This will embed a webpage within an Iframe. Note that not all webpages allow this. As an alternative, you can link to dropbox, or place an image inside the "public" folder of this application. | Full URL |
| Full App | This will embed the thoughtspot application, landing on the page specified in the configuration panel. | Home, Liveboards, Answers, SpotIQ,  Data |
| Filter| This attaches a custom filter to a Liveboard or Search String embed, that can be used to supply runtime filter values.  | The Name of the filter should be your column name. The configuration section contains a comma seperated list of possible values for that filter |
| Search String | This will render a search embed with a specific search string. | The first part contains the TML searech - eg: [sales] [state]. The second part contains the GUUID of a datasource. These need to be seperated by a vertical bar "|". |
| Field| This creates a filter dropdown on a Search String embed, similar to a filter, but can be used with any TML object | The syntax for filter objects is `value:label,value:label` for example `[Region]:Region Field,[Region].east:East Filter,'top 10':Top 10 Keyword` |
 | Search String | This will render a search embed with a specific search string. | The first part contains the TML searech - eg: [sales] [state]. The second part contains the GUUID of a datasource. These need to be seperated by a &#124;|
| REST Content List | This will create a dropdown menu, prepopulated with liveboards/answers obtained from the Thoughtspot Instance via a REST API metadata call. The content of these dropdowns can be  controlled with configuration variables such as Tags and Category. | See  REST content configuration documentation below |

### Custom Actions
Any Custom Action that has been created as a "Callback" can be leveraged on an Answer Embed. When the action is triggered, an alert will be generated showing the name of the action that was triggered, and current dataset of the Answer.

### REST Content Configuration
Configuration options correlate directly with the V1 Metadata List API call.
tags=Retail Sales,Retail Apparel|category=MY|sort=CREATED

 - tags - tag names as seen in the UI (eg. Retail Sales), comma seperated list
 - type - liveboard, answer, all
 - category - ALL, MY, FAVORITE, REQUESTED
 - sort - DEFAULT, NAME, DISPLAY_NAME, AUTHOR, CREATED, MODIFIED


### Disabling UI Components
UI actions can be disabled on Answers, Liveboards, and Search Embeds. To do this, add 'disableAction' and 'enableAction' parameters to the end of the configuration. In the example below, we are disabling "Share" and "Save" on the given answer.

ANSWER_GUID|disableAction=Action.Share|disableAction=Action.Save

##### Link Conifugration Space 
This is used to provide additional details needed to render the link. See Link Type descriptions above for more information on each option.
##### Link Parent
This is used to embed links within menus. First create a Menu Type link and provide a name. Any link that you want to show up within that menu, you will want to set that link's parent attribute to be the menu's name.


