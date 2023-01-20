import * as React from 'react';
import { IData } from './IData';
// @ts-ignore
import { OrgChart } from './OrgChart';
import { IPartialTheme, createTheme} from "@fluentui/react/lib/Styling";
import { Label } from '@fluentui/react/lib/Label';
import "./style.css"
import { DefaultButton } from '@fluentui/react';


export interface ITreeViewProps {
  records: Record<string, ComponentFramework.PropertyHelper.DataSetApi.EntityRecord>;
  sortedRecordIds: string[];
  containerWidth: number;
  containerHeight: number;
  columns: ComponentFramework.PropertyHelper.DataSetApi.Column[];
  showButtons: boolean;
  showChildCounter: boolean;
  selectNode: (inp: IData["id"]) => void;
  themeJSON?: string;
}

export const TreeView: React.FunctionComponent<ITreeViewProps> = (props) => {

  const [items, setItems] = React.useState<IData[]>([]);
  const d3Container = React.useRef(null);
  const [orientation, setOrientation] = React.useState<string>("top");
  const [chart, setChart] = React.useState<OrgChart>(new OrgChart());

  const theme = React.useMemo(() => {
    try {
      return props.themeJSON ? createTheme(JSON.parse(props.themeJSON) as IPartialTheme) : undefined;
    } catch (ex) {
      console.error('Cannot parse theme', ex);
    }
  }, [props.themeJSON]);


  function resetView() {
    chart.fit();
  }

  function zoomIn() {
    console.log(chart);
    console.log(d3Container)
    chart.zoomIn();
  }

  function zoomOut() {
    chart.zoomOut();
  }

  function collapseAll() {
    chart.collapseAll();
    resetView();
  }
  function changeOrientation() {
    if (orientation === "top") {
      setOrientation("left");
      chart.layout("left").render().fit();
    } else {
      setOrientation("top");
      chart.layout("top").render().fit();
    }
    
  }

  //Set items
  React.useEffect(() => {
    let itemschanged = false;
    const parentSet = props.columns.filter((column) => column.alias === "NodeParent")[0].name != null;
    const mainIdSet = props.columns.filter((column) => column.alias === "NodeId")[0].name != null;
    if (!parentSet || !mainIdSet) console.log("parent or id not set.")
    else {
      if(props.sortedRecordIds.length !== items.length)itemschanged = true;
      const sortedRecords: (IData)[] = props.sortedRecordIds.map((id) => {
        const record: IData = {
          id: props.records[id].getFormattedValue("NodeId"),
          title: props.records[id].getFormattedValue("NodeTitle") === null ? "": props.records[id].getFormattedValue("NodeTitle"),
          subtitle: props.records[id].getFormattedValue("NodeSubtitle") === null ? "": props.records[id].getFormattedValue("NodeSubtitle"),
          parentId: props.records[id].getFormattedValue("NodeParent") === "null" ? "" : props.records[id].getFormattedValue("NodeParent"),
          image: props.records[id].getFormattedValue("NodeImage")
        }
        if(!itemschanged){
          if(!items.find((item) => (item.id === record.id && item.title === record.title && item.subtitle === record.subtitle))) itemschanged = true;
        }
        return record;
      });
      if(itemschanged){
        console.log(sortedRecords);
        setItems(sortedRecords);
      }
    }
  }, [props.records, props.columns]);

  const themeStyle = {
    backgroundColor: theme?.palette.themePrimary || "#0078d4",
    leftsideWith: "5px",
    secondaryBackgroundColor: theme?.palette.white || "#ffffff",
    secondaryBorder: theme?.palette.neutralSecondary || "#8a8886"
  }
  // Set chart
  React.useEffect(() => {
    console.log("set chart triggered")
    try {
      if (d3Container.current) {
        chart
          .container(d3Container.current)
          .svgWidth(props.containerWidth)
          .svgHeight(props.containerHeight)
          .compact(false)
          .defaultFont("Segoe UI")
          .data(items)
          .onNodeClick((d: any) => {
            props.selectNode(d);
          })
          .nodeContent(function (d: any) {
            if(props.showChildCounter){
              return `<div class ="tree-item">
              <div class="left-side" style="width:${themeStyle.leftsideWith};background-color:${themeStyle.backgroundColor}">
              </div>
              <div class="right-side">          
                <Label class="title">${d.data.title}</Label>
                <Label class="subtitle">${d.data.subtitle}</Label>
                <div class="counter" style="background-color:${themeStyle.backgroundColor}">${d.data._directSubordinates}</div>
              </div>
            </div>`;
            }else{
              return `<div class ="tree-item">
              <div class="left-side" style="width:${themeStyle.leftsideWith};background-color:${themeStyle.backgroundColor}">
              </div>
              <div class="right-side">          
                <Label class="title">${d.data.title}</Label>
                <Label class="subtitle">${d.data.subtitle}</Label>
              </div>
            </div>`;
            }
          })
          // @ts-ignore
          .buttonContent(({ node, state }) => {
            const icons: any = {
              "left": (d: any) => d ? `<div style="margin-top:-6px;line-height:1.2;font-size:16px;height:15px">‹</div>` : `<div style="margin-top:-6px;font-size:16px;height:15px">›</div>`,
              "top": (d: any) => d ? `<div style="margin-top:-3px;height:8px;font-size:20px">ˆ</div>` : `<div style="margin-top:-18px;font-size:20px">ˬ</div>`,
            }
            return `<div style="
              border-radius:3px;
              padding:3px;
              font-size:10px;
              margin:auto auto;
              background-color:${themeStyle.secondaryBackgroundColor};
              border: 1px solid ${themeStyle.secondaryBorder}">
              ${icons[state.layout](node.children)}
            </div>`
          })
          .render();
        chart.fit();
      }
    } catch (error) {
      console.log(error);
    }
  }, [items,theme,props.showChildCounter, props.containerHeight, props.containerWidth]);

  return (
    <div >
      
      <div className="chart-styling" style={{ width: props.containerWidth + "px" }} ref={d3Container}>
      
        {props.showButtons && (<div className="actions">
          <Label>Actions</Label>
          <DefaultButton className="btn" text="Reset View" onClick={resetView} />
          <DefaultButton className="btn" text="Collapse All" onClick={collapseAll} />
          <DefaultButton className="btn" text="Change Orientation" onClick={changeOrientation} />
          <DefaultButton className="btn" text="Zoom In" onClick={zoomIn} />
          <DefaultButton className="btn" text="Zoom Out" onClick={zoomOut} />
          </div>
        )}
      </div>
    </div>
  );

};