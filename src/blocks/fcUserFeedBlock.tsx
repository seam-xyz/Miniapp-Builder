import Block from './Block'
import { BlockModel } from './types'
import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { useEffect, useState } from 'react';
import { Box, Button, Card, Stack, TextField } from '@mui/material';
import { Avatar } from 'antd';

function CastFeed({ fid }: { fid: any }) {
  const [castData, setCastData] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const base = "https://api.neynar.com/";
      const apiKey = process.env.REACT_APP_NEYNAR_API_KEY || '';

      const url = `${base}v2/farcaster/feed/user/${fid}/popular`
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          api_key: apiKey,
        },
      });
      const casts = await response.json();
      console.log(casts)
      setCastData(casts)
      setLoading(false)
    }
    fetchData()
  }, [fid]);

  if (loading) {
    return <h1>Loading...</h1>
  }

  const isValid = castData && castData?.casts?.length > 0

  if (!isValid) {
    return <h2>{castData.message}</h2>
  }

  return (
    <div>
      {castData.casts.map((cast: any) => (
        <Card style={{ margin: 5, padding: 12 }}>
          <Stack direction="row" spacing={2}>
            <img src={cast.author.pfp_url} style={{ height: "36px", width: "36px" }} />
            <Stack direction="column" spacing={2}>
              <h4>{cast.author.username}</h4>
              <p>{cast.text}</p>
              {cast.embeds.length > 0 && <img src={cast.embeds[0].url} style={{ maxWidth: 300 }} />}
              <Stack direction="row" spacing={2}>
                <p>{cast.reactions.likes.length} likes</p>
                <p>{cast.replies.count} replies</p>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      ))}
    </div>
  );
}

export default class fcUserFeedBlock extends Block {
  render(width?: string, height?: string) {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    return (
      <div style={{ position: 'absolute', height: height, width: width, overflow: 'scroll' }}>
        <h1>Top Casts</h1>
        <CastFeed fid={this.model.data["fid"]} />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let fid = data.get('fid') as string
      this.model.data['fid'] = fid
      done(this.model)
    };

    return (
      <Box
        component="form"
        onSubmit={onFinish}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="fid"
          label={"Farcaster User ID"}
          name="fid"
          defaultValue={this.model.data['fid']}
          autoFocus
        />
        <Button
          type="submit"
          variant="contained"
          className="save-modal-button"
          sx={{ mt: 3, mb: 2 }}
        >
          PREVIEW
        </Button>
      </Box>
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}