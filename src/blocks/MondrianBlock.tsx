import Block from './Block';
import { BlockModel } from './types';
import React, { useState } from 'react';
import { Button, Tabs, Tab, Box, Grid, IconButton, Divider } from '@mui/material';
import BlockFactory from './BlockFactory';
import { ArrowUp, ArrowRight, RotateCw, XCircle, X } from 'react-feather';
import SeamSaveButton from '../components/SeamSaveButton';
import { ReactComponent as BorderHoriz } from './blockIcons/border_horizontal.svg';
import { ReactComponent as BorderVert } from './blockIcons/border_vertical.svg';
import { ReactComponent as Undo } from './blockIcons/undo.svg';

const colors = [
  'white', '#D6D6D6', '#999999', '#5C5C5C', '#474747', 'black',
  '#008CB4', '#7A219F', '#D38303', '#F6ED00', '#C3D116', '#679D34',
  '#54D6FC', '#874FFD', '#FFA57D', '#FEDA77', '#EBF28F', '#B1DD8B',
  '#CBF0FF', '#F9D4E0', '#BA4D2A', '#FEF2D5', '#416222', '#DEEFD4'
];

export default class MondrianBlock extends Block {
  render() {
    if (!this.model.data.squares) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!);
    }

    return <MondrianCanvas squares={this.model.data.squares} onSquareClick={() => {}} />;
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const initialSquares = this.model.data.squares || [
      { id: this.model.data.uuid, x: 0, y: 0, width: 100, height: 100, horizontalCuts: 0, verticalCuts: 0 },
    ];

    const handleSave = (squares: any) => {
      this.model.data.squares = squares;
      done(this.model);
    };

    return <MondrianEditor initialSquares={initialSquares} onSave={handleSave} />;
  }

  renderErrorState() {
    return <h1>An unexpected error has occurred</h1>;
  }
}

const MondrianCanvas = ({ squares, onSquareClick }: { squares: any, onSquareClick: (id: string) => void }) => {
  return (
    <div className="flex items-center justify-center h-full" style={{ width: '100%' }}>
      <div className="relative w-full pb-[100%] box-border">
        <div className="absolute top-0 left-0 w-full h-full border-2 border-black">
          {squares.map((square: any) => (
            <div
              key={square.id}
              onClick={() => onSquareClick(square.id)}
              style={{
                position: 'absolute',
                left: `${square.x}%`,
                top: `${square.y}%`,
                width: `${square.width}%`,
                height: `${square.height}%`,
                border: '2px solid black',
                backgroundColor: square.color || 'white',
                cursor: 'pointer'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MondrianEditor = ({
  initialSquares,
  onSave,
}: {
  initialSquares: any;
  onSave: (squares: any) => void;
}) => {
  const [squares, setSquares] = useState<any>(initialSquares);
  const [history, setHistory] = useState<any>([initialSquares]);
  const [mode, setMode] = useState<'cut' | 'color'>('cut');
  const [cutDirection, setCutDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const splitSquare = (id: string) => {
    const square = squares.find((s: any) => s.id === id);
    if (!square) return;

    const newSquares = squares.filter((s: any) => s.id !== id);
    if (cutDirection === 'horizontal' && square.horizontalCuts < 4) {
      newSquares.push(
        { id: `${id}-0`, x: square.x, y: square.y, width: square.width, height: square.height / 2, color: square.color, horizontalCuts: square.horizontalCuts + 1, verticalCuts: square.verticalCuts },
        { id: `${id}-1`, x: square.x, y: square.y + square.height / 2, width: square.width, height: square.height / 2, color: square.color, horizontalCuts: square.horizontalCuts + 1, verticalCuts: square.verticalCuts }
      );
    } else if (cutDirection === 'vertical' && square.verticalCuts < 4) {
      newSquares.push(
        { id: `${id}-0`, x: square.x, y: square.y, width: square.width / 2, height: square.height, color: square.color, horizontalCuts: square.horizontalCuts, verticalCuts: square.verticalCuts + 1 },
        { id: `${id}-1`, x: square.x + square.width / 2, y: square.y, width: square.width / 2, height: square.height, color: square.color, horizontalCuts: square.horizontalCuts, verticalCuts: square.verticalCuts + 1 }
      );
    } else {
      return;  // Do not allow more than 4 cuts in any direction
    }

    setSquares(newSquares);
    setHistory([...history, newSquares]);
  };

  const colorSquare = (id: string) => {
    const newSquares = squares.map((square: any) =>
      square.id === id ? { ...square, color: selectedColor } : square
    );
    setSquares(newSquares);
    setHistory([...history, newSquares]);
  };

  const handleSquareClick = (id: string) => {
    if (mode === 'cut') {
      splitSquare(id);
    } else {
      colorSquare(id);
    }
  };

  const undo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setSquares(newHistory[newHistory.length - 1]);
    }
  };

  const clearCanvas = () => {
    const initial = [{ id: 'initial', x: 0, y: 0, width: 100, height: 100, horizontalCuts: 0, verticalCuts: 0 }];
    setSquares(initial);
    setHistory([initial]);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(squares);
  };

  return (
    <Box component="form" onSubmit={handleSave} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <MondrianCanvas
        squares={squares}
        onSquareClick={handleSquareClick}
      />
      <Box className="space-between" sx={{ width: '100%', height: 'auto' }}>
        <Tabs
          className="mb-4"
          value={mode}
          onChange={(e, newValue) => setMode(newValue)}
          centered
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#EE39FB' },
            '& .Mui-selected': { color: '#EE39FB' }
          }}
        >
          <Tab label="Cut" className="grow" value="cut" />
          <Tab label="Color" className="grow" value="color" />
        </Tabs>
        {mode === 'cut' ? (
          <div className="flex flex-row space-x-4 items-center justify-center w-full h-full">
            <div className="p-4 gap-2 flex items-center justify-center rounded-full border border-seam-black/5">
              <div
                className={`p-1 cursor-pointer rounded-full ${cutDirection === 'horizontal' ? 'bg-seam-pink fill-white stroke-white text-white' : 'bg-[#EFEFEF] fill-seam-black stroke-black text-seam-black'}`}
                onClick={() => setCutDirection('horizontal')}
              >
                <BorderHoriz className={`${cutDirection === 'horizontal' ? 'fill-white text-white' : 'fill-black text-black'}`}/>
              </div>
              <div
                className={`p-1 cursor-pointer rounded-full ${cutDirection === 'vertical' ? 'bg-seam-pink fill-white text-white' : 'bg-[#EFEFEF] fill-seam-black text-seam-black'}`}
                onClick={() => setCutDirection('vertical')}
              >
                <BorderVert className={`${cutDirection === 'vertical' ? 'fill-white text-white' : 'fill-black text-black'}`} />
              </div>
              <Divider orientation="vertical" flexItem={true} />
              <div
                className="p-1 cursor-pointer rounded-full bg-[#EFEFEF] text-seam-black"
                onClick={undo}
              >
                <Undo />
              </div>
              <div
                className="p-1 rounded-full cursor-pointer bg-[#EFEFEF] text-seam-black"
                onClick={clearCanvas}
              >
                <X size={24} />
              </div>
            </div>
          </div>
        ) : (
          <Grid container className="flex items-center justify-center">
            {colors.map((color, index) => (
              <Grid item xs={2} key={color} className="flex items-center justify-center p-0 mb-2">
                <div className="flex items-center justify-center p-1 bg-[#D6D6D6] rounded-full">
                  <IconButton
                    onClick={() => setSelectedColor(color)}
                    style={{
                      backgroundColor: color,
                      border: selectedColor === color ? '2px solid #EE39FB' : '2px solid #fff',
                      width: 32,
                      height: 32,
                    }}
                  />
                </div>
              </Grid>
            ))}
          </Grid>
        )}
      <SeamSaveButton onClick={handleSave} />
      </Box>
    </Box>
  );
};