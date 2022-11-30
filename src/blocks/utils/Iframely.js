import React, { useEffect, useState } from 'react';

export default function Iframely(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [html, setHtml] = useState({
    __html: '<div />',
  });

  useEffect(() => {
    if (props && props.url) {
      fetch(
        `https://cdn.iframe.ly/api/iframely?url=${encodeURIComponent(
          props.url
        )}&key=${process.env.REACT_APP_IFRAMELY_KEY}&iframe=1&omit_script=1`
      )
        .then((res) => res.json())
        .then(
          (res) => {
            setIsLoaded(true);
            if (res.html) {
              setHtml({ __html: res.html });
            } else if (res.error) {
              setError({ code: res.error, message: res.message });
            }
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
    return <div>Loading…</div>;
  } else {
    return <div dangerouslySetInnerHTML={html} />;
  }
}