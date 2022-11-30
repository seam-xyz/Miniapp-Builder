
import './App.css';
import "./styles.css";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import Widget from "./Widget"
import BlockFactory from './blocks/BlockFactory';
import { BlockModel } from './blocks/types';

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
  let defaultLayout: ReactGridLayout.Layouts = { lg: generateLayout() }
  const [layouts, setLayouts] = useState(defaultLayout);

  const onLayoutChange = (currentLayout: ReactGridLayout.Layout[], allLayouts: ReactGridLayout.Layouts) => {
    setLayouts(allLayouts);
  };

  /* Add your block here! */
  // _______________________

  let model: BlockModel = {
    uuid: "test",
    type: 'iframe',
    data: {}
  }

  // _______________________
  /* End customization */

  const renderBlock = (model: any) => {
    let block = BlockFactory.getBlock(model)
    //block.onEditCallback = onEditItem
    return block.render()
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
      </ResponsiveReactGridLayout>
    </div>
  );
}

function generateLayout() {
  return _.map(_.range(0, 25), function (_, i: number) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: Math.round(Math.random() * 5) * 2,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05
    };
  });
}

export default App;
