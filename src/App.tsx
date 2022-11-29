
import './App.css';
import "./styles.css";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import Widget from "./Widget"

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column"
  },
}));

function App() {
  const classes = useStyles();
  let defaultLayout: ReactGridLayout.Layouts = { lg: [{ w: 4, h: 15, x: 0, y: 0, i: "0" }] }
  const [layouts, setLayouts] = useState(defaultLayout);

  const onLayoutChange = (currentLayout: ReactGridLayout.Layout[], allLayouts: ReactGridLayout.Layouts) => {
    setLayouts(allLayouts);
  };

  /* Add your block here! */
  // _______________________

  let model = {uuid: "test"}

  // _______________________
  /* End customization */

  const renderBlock = (model: any) => {
    //let block = BlockFactory.getBlock(model)
    //block.onEditCallback = onEditItem
    //return block.render()
  }

  const onRemoveItem = (itemId: any) => {

  };
  const onEditItem = (itemId: any) => {

  };

  return (
    <div className={classes.root}>
      <h1>Seam Block SDK</h1>
      <ResponsiveReactGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, xxs: 0 }}
        cols={{ lg: 12, xxs: 2 }}
        rowHeight={5}
        onLayoutChange={onLayoutChange}
        resizeHandles={['se']}
        measureBeforeMount={true}
      >
        <Widget id={model.uuid}
          onRemoveItem={onRemoveItem}
          onEditItem={onEditItem}>
          {renderBlock(model)}
        </Widget>
        <h1>Block 1</h1>
      </ResponsiveReactGridLayout>
    </div>
  );
}

export default App;
