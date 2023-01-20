# Tree View

This repository contains an example PCF component for the Power Platform, both the source code and an example solution are included to get you started quickly.

## What is PCF
PCF is an abbreviation for the Power Apps Component Framework. This framework empowers professional developers to create customized components using typescript and popular frameworks such as React and Fluent UI. These components can be added to Power Apps similar to how out-of-the-box components are available for low-code developers, making PCF a key element of fusion team development. It allows fusion teams to use default Power Apps components and extend with traditional code components where required.

## PCF sample
To demonstrate the power of PCF, this repository contains a sample tree view component. The aim of this component is to provide low-code developers with an easy-to-use component that can render hierarchical relationships between objects, such as an organizational chart. To accomplish this, the component should:
- Hide all the complex logic from low-code developers
- Be easy to configure during regular low-code development, as if it were a default component
- Provide options for customizability without changing the source code

To speed up development of this component and to not reinvent the wheel, the component is built on top of an existing javascript library called d3-org-chart. The main challenge is to fit this library into the Power Apps framework and hook it up to the structure and data that is required by the framework. The section below will highlight some important aspect of this process and can help you in building your own components.

## PCF development

### Prerequisites
There are a few prerequisites that you require to start building your own PCF components, for more information about these, refer to the [microsoft documentation](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/implementing-controls-using-typescript). Furthermore, a basic understanding of react and the structure of the component framework will be necessary and this repo will not go into too much detail.

### Initializing the project
To initialize the project and set-up the basic boilerplate code, the Power Platform CLI has a simple command that will set-up everything for you:

```bash
  pac pcf init --namespace SampleNamespace --name TreeView --template dataset --framework React
```

Note that we are using the React framework, as of the time of writing this, this is still in preview. You can also eliminate the framework and it will default to the GA version. However, the React framework will provide better performance.

This command generates a few files for us, the most important ones are displayed below.
| File | Description                |
| :-------- | :------------------------- |
| ControlManifest.Input.xml |This manifest allows you to specify which fields will be exposed to the end-user during low-code development. This is important when requesting the user to provide a dataset for example, the specification of this field will be made in the manifest before you can use it in your code.  |
| index.ts |This file is the main starting point of your component, it includes a relatively empty class and methods that are required for it to work properly. Microsoft has a lot of good documentation on how these methods work, but the most important one will be the updateView. This method will be called each time something changes.   |
| HelloWorld.tsx |This file contains a sample react component that simply returns a label. Here, you can start creating your own component.  |

### Testing the component
You can easily test your component locally by running the following command from the root directory of your project

```bash
  npm start watch
```

This will start the test harness on port 8181, which will display your component. It supports reloading, so if you leave this on while developing, your saved changes should be reflecting near-real time.

### Points of attention
During the development of this component, I ran into a few things that you might run into as well, so while developing, keep the following in mind:
- Keep in mind the state of your component. An easy way to do is, is by using React hooks, such as React.useState. During development, I ran into some issues where the test harness did keep proper state, but power apps studio didn't.
- Make sure to regularly test your component in power apps studio as well, as I found out that the test harness does not behave exactly the same as power apps studio.

## Using the component
As mentioned before, this repo contains the tree view component source code, which you can use yourself as a basis for your own component. This section explains what the component does and how to start using it.

### Features
The component can render hierarchical relationships between objects in an interactive org/tree chart. The interactive chart allows for zooming, panning, changing orientation and more. To make the component easy-to-use, but also customizable, the following attributes are exposed to the low-code developers:
- Records: this should have a list of objects, for example a dataverse table.
- NodeId: the field name that contains the unique identifier for each node, this is required. The suggestion would be to use the primary key field of a dataverse table with an autonumber value.
- NodeParent: the field that contains the NodeId of the parent object, this is required as well.
- NodeTitle: the field with a name or title, optional, but used for rendering the node in the tree.
- NodeSubtitle: a description or other attribute of the object, used for rendering the node in the tree.
- ShowActionButtons: a boolean value to indicate whether the component should render with action buttons.
- ShowChildCounter: each node contains a child count, this boolean indicates whether it should render or not.
- theme: a theme json that allows for adjusting the styling of the nodes. This one follows the FluentUI theme json (you can design one [here](https://fluentuipr.z22.web.core.windows.net/heads/master/theming-designer/index.html)). For the structure, see the example below:

```json
{
  "palette": {
    "black": "#000000",
    "neutralDark": "#201f1e",
    "neutralLight": "#edebe9",
    "neutralLighter": "#f3f2f1",
    "neutralLighterAlt": "#faf9f8",
    "neutralPrimary": "#323130",
    "neutralPrimaryAlt": "#3b3a39",
    "neutralQuaternary": "#d0d0d0",
    "neutralQuaternaryAlt": "#e1dfdd",
    "neutralSecondary": "#605e5c",
    "neutralTertiary": "#a19f9d",
    "neutralTertiaryAlt": "#c8c6c4",
    "themeDark": "#571e57",
    "themeDarkAlt": "#672367",
    "themeDarker": "#401640",
    "themeLight": "#d5abd5",
    "themeLighter": "#e9d0e9",
    "themeLighterAlt": "#f9f3f9",
    "themePrimary": "#742774",
    "themeSecondary": "#843784",
    "themeTertiary": "#ab67ab",
    "white": "#ffffff"
  }
}
```

### Set-up your environment
To make sure the component can render, you should turn on "allow PCF components" for your target environment. You can do this in the admin section of the Power Platform.

### Running the component locally/for development
To run the component, clone this repository to your local machine and cd into the ./SourceCode directory. From there, run:
```bash
  npm install
```
This will install all the dependencies.

Afterwards, you can run the below command to run the component locally and extend it to your liking.
```bash
  npm start watch
```

