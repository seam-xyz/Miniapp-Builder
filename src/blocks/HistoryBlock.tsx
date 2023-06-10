import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import React, { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';


interface EventData {
  year: string;
  text: string;
}

interface TodayHistoryProps {
  bgColor: string;
  buttonColor: string
}

function TodayHistory(props: TodayHistoryProps) {
  const { bgColor, buttonColor } = props
  const [localData, setLocalData] = useState<EventData[]>([]);
  const [todayDate, setTodayDate] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [historyData, setHistoryData] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://history.muffinlabs.com/date');
        const data = await response.json();
        setLocalData(data.data.Events);
        setTodayDate(data.date);
      } catch (error) {
        setHistoryData('Failed to load');
        console.error('Error fetching history data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (localData.length > 0) {
      const randomIndex = Math.floor(Math.random() * localData.length);
      const { year, text } = localData[randomIndex];
      setYear(year);
      setHistoryData(text);
    }
  }, [localData]);

  const divStyles: React.CSSProperties = {
    backgroundColor: bgColor,
    height: '100%',
    padding: '20px 20px',
    borderRadius: '4px',
    fontFamily: 'Helvetica',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  };

  const refreshRandomEvent = () => {
    const randomIndex = Math.floor(Math.random() * localData.length);
    const { year, text } = localData[randomIndex];
    setYear(year);
    setHistoryData(text);
  };

  return (
    <div className="history-content" style={divStyles}>
      <h1 style={{ fontWeight: '500' }}>
        {todayDate} <b>{year}</b>
      </h1>
      <p>{historyData}</p>
      <Button variant="contained" sx={{ 
        marginTop: '4px', 
        backgroundColor: buttonColor,
        boxShadow: '3px 3px 0px rgba(0, 0, 0, 0.5)',
        '&:hover': { backgroundColor: buttonColor },
        }} onClick={refreshRandomEvent}>
        New Year!
      </Button>
    </div>
  );
}

export default class HistoryBlock extends Block {

  render() {
    return (<TodayHistory bgColor={this.model.data['bgColor'] || "#749AF0"} buttonColor={this.model.data['buttonColor']} />)
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const colors = [
      { name: 'red', backgroundColor: '#EF8B7C', buttonColor: '#E05A32' },
      { name: 'blue', backgroundColor: '#749AF0', buttonColor: '#5451F6' },
      { name: 'green', backgroundColor: '#69AF78', buttonColor: '#4DA660' },
      { name: 'yellow', backgroundColor: '#F6C944', buttonColor: '#FFC107' },
      { name: 'purple', backgroundColor: '#C4B9FA', buttonColor: '#985DF6' },
    ];

    return (
      <div className='palette' style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        padding: '20px'
      }}>
        {colors.map((color, index) => (
          <div
            key={color.name}
            className="color-circle"
            style={{
              backgroundColor: color.backgroundColor,
              width: '50px',
              height: '50px',
              borderRadius: '25px',
            }}
            onClick={() => {
              this.model.data['bgColor'] = colors[index].backgroundColor;
              this.model.data['buttonColor'] = colors[index].buttonColor;
              done(this.model)
            }}
          ></div>
        ))}
      </div>
    );
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}