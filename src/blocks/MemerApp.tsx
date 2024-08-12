import React, { useState, useEffect } from 'react';
import { BlockModel, ComposerComponentProps, FeedComponentProps } from './types';
import FileUploadComponent from './utils/FileUploadComponent';

export const MemerFeedComponent = ({ model }: FeedComponentProps) => {
  const theme: string = model.data.theme || '';
  const answer: string = model.data.answer || '';
  const imageUrls: string[] = model.data.imageUrls ? JSON.parse(model.data.imageUrls) : [];
  const savedResponses: Array<{ text: string; image: string[] }> = model.data.responses ? JSON.parse(model.data.responses) : [];
  const [votes, setVotes] = useState<number[]>(new Array(savedResponses.length).fill(0));
  const [userVotes, setUserVotes] = useState<boolean[]>(new Array(savedResponses.length).fill(false));
  const [showResponses, setShowResponses] = useState(false);
  const [showAddResponse, setShowAddResponse] = useState(false);
  const [newResponseText, setNewResponseText] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCheckResponses = () => {
    setShowResponses(true);
  };

  const handleBack = () => {
    setShowResponses(false);
    setShowAddResponse(false);
  };

  const handleAddResponse = () => {
    setShowAddResponse(true);
  };


  const handleSubmitResponse = () => {
    // Create a new response object
    const newResponse = { text: newResponseText, image: previewUrls };
    
    // Update responses in model.data
    const updatedResponses = [...savedResponses, newResponse];
    model.data.responses = JSON.stringify(updatedResponses);
  
    // Add a zero vote for the new response
    const updatedVotes = [...votes, 0];
    model.data.votes = JSON.stringify(updatedVotes); // Ensure model data is also updated
    setVotes(updatedVotes);
  
    // Add a false entry for userVotes to track if the user has voted for this new response
    const updatedUserVotes = [...userVotes, false];
    setUserVotes(updatedUserVotes);
  
    // Clear new response fields
    setNewResponseText('');
    setPreviewUrls([]);
    
    // Show the updated responses and hide the add response form
    setShowResponses(true);
    setShowAddResponse(false);
    };
  
  

  const handleImageUpload = (uploadedUrls: string[]) => {
    setPreviewUrls(uploadedUrls);
  };

  const handleDeleteImage = (index: number) => {
    const updatedUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(updatedUrls);
    model.data.imageUrls = JSON.stringify(updatedUrls);
  };

  useEffect(() => {
    // Initialize votes based on model.data.votes if it exists
    if (model.data.votes) {
      const initialVotes = model.data.votes.split(',').map(vote => parseInt(vote, 10) || 0);
      setVotes(initialVotes);
    } else {
      setVotes(new Array(savedResponses.length).fill(0));
    }
  }, []);
  
  const handleVoteChange = (index: number) => {
    if (loading) return; // Prevent further action if currently processing
  
    setLoading(true);
  
    // Ensure model.data.votes is initialized
    if (!model.data.votes || typeof model.data.votes !== 'string') {
      model.data.votes = new Array(savedResponses.length).fill(0).join(',');
    }
    console.log(model.data.votes)
  
    // Convert model.data.votes to an array of numbers
    const votesArray = model.data.votes.split(',').map(vote => parseInt(vote, 10) || 0);
    console.log(votesArray)
  
    if (userVotes[index]) {
      // User has voted, so we need to remove the vote
      votesArray[index] = Math.max(votesArray[index] - 1, 0); // Ensure votes don't go below 0
      setUserVotes(userVotes.map((voted, i) => i === index ? false : voted));
    } else {
      // User hasn't voted yet, so we need to add a vote
      if (votesArray[index] < 1000000000000000000) { // Limit votes to a maximum of 10
        votesArray[index] += 1;
        setUserVotes(userVotes.map((voted, i) => i === index ? true : voted));
      }
    }
  
    // Update the model with the new total votes
    model.data.votes = votesArray.join(',');
  
    // Update state with the new vote counts
    setVotes(votesArray);
  
    // Reset loading state
    setLoading(false);
  };
  
  
  



  if (showAddResponse) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '10px' }}>{theme}</div>
        <hr style={{ marginBottom: '20px' }} />
        <div style={{ marginBottom: '20px' }}>
          <textarea
            placeholder="Add your response..."
            value={newResponseText}
            onChange={(e) => setNewResponseText(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '20px',  }}>
          <FileUploadComponent
            fileTypes="image/*"
            label={previewUrls.length > 0 ? "Upload A Different Image (Optional)" : "Upload Image (Optional)"}
            onUpdate={handleImageUpload}
            multiple={true}
            maxFiles={1}
          />
          {/* Preview section */}
          {previewUrls.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <h4>Preview:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {previewUrls.map((url: string, index: number) => (
                  <div key={index} style={{ position: 'relative', marginRight: '10px', marginBottom: '10px' }}>
                    <img  
                    src={url}
                    alt={`preview-${index}`} 
                    style={{ width: '100px', borderRadius: '5px' }}
                  />
                    <button
                      onClick={() => handleDeleteImage(index)}
                      style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleSubmitResponse}
          style={{
            padding: '10px 20px',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Submit Response
        </button>
        <button
          onClick={handleBack}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Cancel
        </button>
      </div>
    );
  }


  if (showResponses) {
    const pairedResponses: Array<[typeof savedResponses[0] | undefined, typeof savedResponses[1] | undefined]> = [];
    for (let i = 0; i < savedResponses.length; i += 2) {
      pairedResponses.push([savedResponses[i], savedResponses[i + 1]]);
    }

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '10px' }}>{theme}</div>
        <div style={{ fontWeight: 500, fontSize: '20px', marginBottom: '10px' }}>Vote For The Better Answer </div>
        <hr style={{ marginBottom: '20px' }} />
        {(savedResponses.length===0)?(
          <div style={{       // Width of the scrollable section
            height: '300px',
            textAlign:'center',
            alignItems:'center',
            display:'flex',
            justifyContent:'center'      // Height of the scrollable section
          }}> <div style={{fontSize:'25px', width:'50%', height:'70px', backgroundColor:'#D3D3D3', textAlign:'center', alignItems:'center',display:'flex',justifyContent:'center', borderRadius:'15px' }}>No Responses Yet!</div></div>
        ):(
          <div style={{       // Width of the scrollable section
              height: '300px',      // Height of the scrollable section
              overflowY: 'scroll',  // Enables vertical scrolling
            }}>
            {pairedResponses.map((pair, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                }}
              >
                <div style={{
                  flex: 1, marginRight: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', height:"204px", 
                  backgroundColor: votes[index * 2] > votes[index * 2 + 1] ? '#d4edda' : 'white',
                }}>
                  <div style={{display: 'flex', flexDirection: 'column', width:'200px'}}>
                    <div style={{ textAlign: 'center' }}>{pair[0]?.text}</div>
                    {pair[0]?.image && pair[0].image.map((url: string, imgIndex: number) => (
                      <img
                        key={imgIndex}
                        src={url}
                        alt={`response-${index}-img-${imgIndex}`}
                        style={{ width: '150px', height:'150px', marginLeft: '10px', borderRadius: '5px' }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        padding: '10px',
                        textAlign: 'center',
                        alignItems:'center',
                        justifyContent:'center',
                        display:'flex',
                        flexDirection:'row',
                        marginRight: "10px",
                    }}
                >
                    <div style={{textAlign:'center',alignItems:'center', justifyContent:'center'}}>{votes[index * 2]}</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <button
                            onClick={() => handleVoteChange(index * 2)}
                            style={{
                                padding: '5px 10px',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {userVotes[index*2] ? '❤️' : '🩶'}
                        </button>
                    </div>
                </div>

                </div>
                <div style={{display: 'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                <div style={{ backgroundColor: 'black', width: '2px', height: '90px' }}></div>
                <p style={{textAlign:'center'}}>OR</p>
                <div style={{ backgroundColor: 'black', width: '2px', height: '90px' }}></div>
                </div>
                <div style={{
                  flex: 1, marginRight: '0px', marginLeft: '10px',  borderRadius: '5px',
                  display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height:'204px', 
                  backgroundColor: votes[index * 2 + 1] > votes[index * 2 ] ? '#d4edda': 'white',
                }}>
                  <div style={{display: 'flex', flexDirection: 'column', width:'200px', }}>
                    <div style={{ textAlign: 'center', width:'100%' }}>{pair[1]?.text}</div>
                    {pair[1]?.image && pair[1].image.map((url: string, imgIndex: number) => (
                      <img
                        key={imgIndex}
                        src={url}
                        alt={`response-${index}-img-${imgIndex}`}
                        style={{ width: '150px', height:'150px', marginLeft: '10px', borderRadius: '5px' }}
                      />
                    ))}
                  </div>
                  {pair[1] && (
    <div
        style={{
            backgroundColor: 'white',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            padding: '10px',
            textAlign: 'center',
            marginRight:"10px",
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            flexDirection:'row'
        }}
    >
        <div style={{justifyContent:'center',alignItems:'center',}}>{votes[index * 2 + 1]}</div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <button
                onClick={() => handleVoteChange(index * 2 + 1)}
                style={{
                    padding: '5px 10px',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '5px',
                    marginRight: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {userVotes[index*2+1] ? '❤️' : '🩶'}
            </button>
        </div>
    </div>
)}

                </div>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleAddResponse}
          style={{
            padding: '10px 20px',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Add Your Response
        </button>
        <button
          onClick={handleBack}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px',
            marginLeft: '10px',
          }}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '10px' }}>{theme}</div>
      <div style={{ fontWeight: 500, fontSize: '15px', marginBottom: '10px' }}>My Response:</div>
      <hr style={{ marginBottom: '10px' }} />
      <div style={{ display: 'flex',  marginBottom: '5px' }}>
        <div style={{}}>
          <p style={{ marginBottom: '10px' }}>{answer}</p>
          {imageUrls.length > 0 &&
            imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`answer-img-${index}`}
                style={{ width: '300px', borderRadius: '5px', margin: '5px' }}
              />
            ))}
        </div>
      </div>
      <button
        onClick={handleCheckResponses}
        style={{
          padding: '10px 20px',
          backgroundColor: 'black',
          color: 'white',
          border: 'none',
          marginTop:"30px",
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Check Responses
      </button>
    </div>
  );
};



export const MemerComposerComponent = ({ model, done }: ComposerComponentProps) => {
  // Initialize state from model.data or set default values
  const [theme, setTheme] = useState<string>(model.data.theme || '');
  const [answer, setAnswer] = useState<string>(model.data.answer || '');
  const [previewUrls, setPreviewUrls] = useState<string[]>(model.data.imageUrls ? JSON.parse(model.data.imageUrls) : []);

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value);
    model.data.theme = e.target.value;  // Store the theme in model.data as a string
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
    model.data.answer = e.target.value;  // Store the text answer as a string in model.data
  };

  const handleImageUpload = (uploadedUrls: string[]) => {
    setPreviewUrls(uploadedUrls);
    model.data.imageUrls = JSON.stringify(uploadedUrls);  // Store the image URLs as a JSON string in model.data
  };

  const handleDeleteImage = (index: number) => {
    const updatedUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(updatedUrls);
    model.data.imageUrls = JSON.stringify(updatedUrls);  // Update model.data with the new image URLs
  };

  const handlePost = () => {
    model.data.votes=''
    done(model);  // Pass the model with stored data back to the parent component
  };

  return (
    <div style={{ padding: '20px', borderRadius: '8px', backgroundColor: '#f8f8f8' }}>
      <h1>Create Your Post</h1>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="themeInput">Enter your theme or question:</label>
        <input
          id="themeInput"
          type="text"
          value={theme}
          onChange={handleThemeChange}
          style={{ width: '100%', padding: '8px', marginTop: '8px' }}
          placeholder="e.g., What's the best comeback you've ever heard?"
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="answerInput">Your answer (optional):</label>
        <input
          id="answerInput"
          type="text"
          value={answer}
          onChange={handleAnswerChange}
          style={{ width: '100%', padding: '8px', marginTop: '8px' }}
          placeholder="Type your answer here..."
        />
      </div>
      <div style={{ marginBottom: '20px', }}>
        <FileUploadComponent
          fileTypes="image/*"
          label={previewUrls.length > 0 ? "Upload A Different Image (Optional)" : "Upload Image (Optional)"}
          onUpdate={handleImageUpload}
          multiple={true}
          maxFiles={1}
        />
        {previewUrls.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <h4>Preview:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {previewUrls.map((url, index) => (
                <div key={index} style={{ position: 'relative', marginRight: '10px', marginBottom: '10px' }}>
                  <img src={url} alt={`preview-${index}`} style={{ width: '100px', borderRadius: '5px' }} />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <button onClick={handlePost} style={{ padding: '10px 20px', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '5px' }}>
        Post
      </button>
    </div>
  );
};
