import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { TextField, Box, Button, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface CountdownBlockProps {
  title: string;
  date: string;
  finishMessage: string;
}
interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function Countdown({ title, date, finishMessage } : CountdownBlockProps) {
    const calculateTimeLeft = () => {
        const difference = +new Date(date) - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
        if (difference > 0) {
          timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        }
    
        return timeLeft;
    };
    
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
        }, 1000);
    
        return () => clearTimeout(timer);
    }, [timeLeft]); // Depend only on timeLeft
    


    const countdownDisplay = (timeLeft as TimeLeft).days !== undefined ? (
        <Typography variant="h5" sx={{ color: 'black' }}>
          {Object.entries(timeLeft as TimeLeft).map(([interval, value]) => (
            value > 0 ? <span key={interval}>{value} {interval} </span> : null
          ))}
        </Typography>
    ) : (
        <Typography variant="h5" sx={{ color: 'black' }}>{finishMessage ? finishMessage : "Timer Complete"}</Typography>
    );
    
    return (

        <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: 'black' }}>{title}</Typography>
                {countdownDisplay}
        </Box>
    );       
}


interface CountdownEditModalProps {
    onFinish: (title: string, date: string, finishMessage: string) => void; // Assuming 'model' can be of any type, adjust as per your actual data type
  }
  
function CountdownEditModal({ onFinish }: CountdownEditModalProps){
    const [title, setTitle] = useState<string>('');
    const [finishMessage, setFinishMessage] = useState<string>('');

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [timeLeft, setTimeLeft] = useState<string>('');
    
    useEffect(() => {
        const timer = setInterval(() => {
          const now = new Date();
          const difference = selectedDate ? selectedDate.getTime() - now.getTime() : 0;
          const timeLeft = difference > 0 ? formatTimeLeft(difference) : 'Time is up!';
          setTimeLeft(timeLeft);
        }, 1000);
    
        return () => clearInterval(timer);
      }, [selectedDate]);
    
  
      const formatTimeLeft = (difference: number): string => {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
    
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    
  
      const handleDateChange = (newValue: Date | null) => {
        setSelectedDate(newValue);
      };
      
      const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formattedDate = selectedDate ? selectedDate.toISOString() : new Date().toISOString();
        onFinish(title, formattedDate, finishMessage);
      };


    return (
        <Box
        component="form"
        onSubmit={onFormSubmit}
        style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}
      >
        <Typography variant="h5" style={{ marginBottom: '20px', textAlign: 'center' }}>
          Countdown Timer
        </Typography>
        <TextField 
          fullWidth 
          label="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: '20px' }} 
        />
        <TextField 
          fullWidth 
          label="Finish Message" 
          value={finishMessage} 
          onChange={(e) => setFinishMessage(e.target.value)}
          style={{ marginBottom: '20px' }} 
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="End Time"
            value={selectedDate}
            slotProps={{ textField: { fullWidth: true } }}
            onChange={handleDateChange}
          />
        </LocalizationProvider>
        <Button 
          type='submit' 
          variant="contained" 
          color="primary" 
            style={{marginTop:20}}
          fullWidth
        >
          Add Countdown Timer
        </Button>
      </Box>
    );
}

export default class CountdownBlock extends Block {

  render() {
    
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!);
    }

    let title = this.model.data['title'];
    let date = this.model.data['date'];
    let finishMessage = this.model.data['finishMessage'];

    return (
        <Countdown
        title={title}
        date={date}
        finishMessage={finishMessage}
        />
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const handleUpdateAndFinish = (title: string, date: string, finishMessage: string) => {
      this.model.data['title'] = title;
      this.model.data['date'] = date;
      this.model.data['finishMessage'] = finishMessage;
      // Then call the done function with the updated model
      done(this.model);
    };

    return <CountdownEditModal onFinish={handleUpdateAndFinish} />;
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    );
  }
}
