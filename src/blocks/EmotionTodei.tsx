import React, { useRef, useState, useCallback } from 'react';
import Webcam from "react-webcam";
import axios from 'axios';
import './EmotionTodei.css';
import { ComposerComponentProps } from './types';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

type ApiResponse = {
  faces: {
    dominant_emotion: string;
    emotion: Record<string, number>;
    region: { x: number; y: number; w: number; h: number };
  }[];
};


function EmotionTodei({ model, done }: ComposerComponentProps) {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user",
    };
  
    const [responseData, setResponseData] = useState<ApiResponse | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const webcamRef = useRef<Webcam>(null);
  
    const capture = useCallback(() => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log(imageSrc);
        setImage(imageSrc || null);
      }
    }, [webcamRef]);
  
    const sendImage = async () => {
      if (!image) {
        alert('No image captured!');
        return;
      }
  
      const response = await fetch(image);
      const blob = await response.blob();
  
      const formData = new FormData();
      formData.append('photo', blob, 'photo.jpg');
      formData.append('collections', '');
  
      const url = 'https://api.luxand.cloud/photo/emotions';
      const headers = {
        'token': process.env.REACT_APP_FACE_TOKEN as string,
      };
  
      try {
        const response = await axios.post(url, formData, {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
        setResponseData(response.data);
        
        done({ ...model, responseData: response.data });
        
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    };
  
    return (
      <div className="App">
        <Header />
        {responseData && <ResponseDisplay responseData={responseData} />}
        <div className="EmotionVideo" style={{ padding: '10%' }}>
          <VideoContent capture={capture} sendImage={sendImage} />
          <CameraDisplay webcamRef={webcamRef} videoConstraints={videoConstraints} />
        </div>
      </div>
    );
  }
  

const Header: React.FC = () => (
  <header className="App-header">
    <div className="Header">
      <a
        className="menu"
        style={{
          fontFamily: 'Courier New, monospace',
          fontSize: '3rem',
          color: '#282c34',
          textAlign: 'center',
          textShadow:
            '0 0 5px #00F9FF, 0 0 10px #00F9FF, 0 0 20px #00F9FF, 0 0 40px #00F9FF',
        }}
      >
        SEAMS
      </a>
    </div>
  </header>
);

const VideoContent: React.FC<{ capture: () => void; sendImage: () => void }> = ({ capture, sendImage }) => (
  <div style={{ flexDirection: 'row' }}>
    <p
      className="text"
      style={{
        fontFamily: 'Courier New, monospace',
        fontSize: '3rem',
        color: '#282c34',
        textAlign: 'center',
        textShadow:
          '0 0 5px #00F9FF, 0 0 10px #00F9FF, 0 0 20px #00F9FF, 0 0 40px #00F9FF',
      }}
    >
      Emotion Camera Recording
    </p>
    <div style={{ flexDirection: 'row' }}>
      <button
        className="button-primary"
        onClick={sendImage}
        style={{ marginRight: 10 }}
      >
        Emotion for Todei
      </button>
      <button className="button-capture" onClick={capture}>
        Capture photo
      </button>
    </div>
  </div>
);

const CameraDisplay: React.FC<{ webcamRef: React.RefObject<Webcam>, videoConstraints: any }> = ({ webcamRef, videoConstraints }) => (
  <div style={{ marginTop: 10 }}>
    <Webcam
      audio={false}
      height={720}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      width={1280}
      videoConstraints={videoConstraints}
    />
  </div>
);

const ResponseDisplay: React.FC<{ responseData: ApiResponse }> = ({ responseData }) => (
    <Container className="mt-4">
      <Row>
        {responseData.faces.map((face, index) => (
          <Col md={6} lg={4} key={index} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="mb-2 text-primary">
                  Dominant Emotion: <span className="font-weight-bold">{face.dominant_emotion}</span>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Emotion Breakdown:</Card.Subtitle>
                <ListGroup variant="flush">
                  {Object.entries(face.emotion).map(([emotion, value]) => (
                    <ListGroup.Item key={emotion} className="d-flex justify-content-between align-items-center">
                      <span className="font-weight-bold">{emotion}:</span>
                      <span>{value.toFixed(2)}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Card.Text className="mt-2">
                  <strong>Region:</strong> X: {face.region.x}, Y: {face.region.y}, Width: {face.region.w}, Height: {face.region.h}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
);
  

export default EmotionTodei;
