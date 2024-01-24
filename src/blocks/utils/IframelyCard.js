import { Card, CardContent, CardMedia, Skeleton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function Iframely(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    if (props && props.url) {
      fetch(
        `https://cdn.iframe.ly/api/iframely?url=${encodeURIComponent(
          props.url
        )}&key=${process.env.REACT_APP_IFRAMELY_KEY}&iframe=0&omit_script=1`
      )
        .then((res) => res.json())
        .then(
          (res) => {
            setIsLoaded(true);
            setData({
              title: res.meta.title,
              description: res.meta.description,
              image: res.links.thumbnail[0].href,
              url: res.url,
            });
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    } else {
      setError({ code: 400, message: 'Provide url attribute for the element' });
    }
  }, [props.url]);

  useEffect((props) => {
    window.iframely && window.iframely.load();
  });

  if (error) {
    return (
      <div>
        Error: {error.code} - {error.message}
      </div>
    );
  } else if (!isLoaded) {
    return <Skeleton variant="rectangular" width={"100%"} height={120} />;
  } else {
    return (
      <a href={data.url} target="_blank" style={{ textDecoration: "none", color: "black" }}>
        <Stack direction="column" style={{ width: "100%", height: "100%" }}>
          <img src={data.image} style={{ width: "100%", height: "100%" }} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.description}
            </Typography>
          </CardContent>
        </Stack>
      </a>
    )
  }
}