import { ComposerComponentProps, FeedComponentProps } from './types'
import './BlockStyles.css'
import { Box, Button, Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { NFTE } from '@nfte/react';
import { getNFTMetadata } from './utils/AlchemyAPI';
import { useEffect, useState } from 'react';
import { Nft } from 'alchemy-sdk'
import './BlockStyles.css'

interface NftCardProps {
  tokenAddress: string;
  tokenId: string;
}

function NFTCard(props: NftCardProps) {
  const [asset, setAsset] = useState<Nft>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadNFT = async (
      tokenAddress: NftCardProps['tokenAddress'],
    ) => {
      setIsLoading(true);
      setLoadingError(undefined);

      const nft = await getNFTMetadata(tokenAddress, props.tokenId);
      setIsLoading(false);
      setAsset(nft);
    }

    loadNFT(props.tokenAddress);
  }, [props.tokenAddress, props.tokenId]);

  const getImageUrl = (asset: Nft) => {
    let imageUrl = '';
    if (asset.media && asset.media[0] && asset.media[0].gateway) {
      imageUrl = asset.media[0].gateway; // Use 'gateway' property
    } else if (asset.rawMetadata && asset.rawMetadata.image) {
      imageUrl = asset.rawMetadata.image;
    } else if (asset.contract.openSea && asset.contract.openSea.imageUrl) {
      // when the original project site has shut down, sometimes opensea has a cached copy of the nft image
      imageUrl = asset.contract.openSea.imageUrl
    } else {
      console.log("unable to find")
      console.log(asset)
    }

    // Convert IPFS URL to a usable format
    if (imageUrl?.startsWith('ipfs://')) {
      imageUrl = `https://ipfs.io/ipfs/${imageUrl.slice(7)}`;
    }

    return imageUrl;
  }

  if (loadingError) {
    return (
      <div style={{ position: "relative", height: '100%', width: "100%", alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
        <div>
          {loadingError}
        </div>
        <br />
        <div>Please try again ♡</div>
      </div>
    )
  }

  const imageURL = asset ? getImageUrl(asset) : ""
  const title = asset?.title

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  return (
    <div style={containerStyle}>
      <img style={{ width: '100%', height: 'auto', marginBottom: '20px', }} src={imageURL} alt={title} />
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>{title}</div>
    </div>
  )
}

export const NFTFeedComponent = ({ model }: FeedComponentProps) => {
  if (model.data['error'] !== undefined) {
    return renderErrorState();
  }

  const tokenAddress = model.data["tokenAddress"];
  const tokenId = model.data["tokenId"];
  const includeOwner = model.data["includeOwner"] === 'on';

  if (includeOwner) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <NFTE contract={tokenAddress} tokenId={tokenId} />
      </div>
    );
  }

  return (
    <NFTCard tokenAddress={tokenAddress} tokenId={tokenId} />
  );
}

export const NFTComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const onFinish = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let url = data.get('url') as string;
    const { tokenAddress, tokenId, error } = parseOpenSeaURL(url);
    model.data['url'] = url;
    model.data['tokenId'] = tokenId ?? "";
    model.data['tokenAddress'] = tokenAddress ?? "";
    if (error !== undefined) { model.data['error'] = error; }
    done(model);
  };

  const [includeOwner, setIncludeOwner] = useState<string>(model.data['includeOwner']);
  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.checked ? 'on' : 'off';
    model.data['includeOwner'] = val;
    setIncludeOwner(val);
  };

  return (
    <Box component="form" onSubmit={onFinish}>
      <TextField
        autoFocus
        margin="dense"
        id="nft-link"
        label="Paste an OpenSea link:"
        type="url"
        fullWidth
        variant="outlined"
        required
        defaultValue={model.data['url']}
        name="url"
      />
      <FormGroup>
        <FormControlLabel control={<Checkbox
          title='includeOwner'
          value={includeOwner}
          onChange={handleToggleChange}
        />} label="Include owner information" />
      </FormGroup>
      <Button
        type="submit"
        variant="contained"
        className="save-modal-button"
        sx={{ mt: 3, mb: 2 }}
      >
        Save
      </Button>
    </Box>
  );
}

function parseOpenSeaURL(url: string) {
  const parts = url.split('/');
  if (parts.length < 7 || !parts[5].startsWith('0x')) {
    return { error: "Malformed URL" };
  }

  const tokenAddress = parts[5];
  const tokenId = parts[6];

  return { tokenAddress, tokenId };
}

function renderErrorState() {
  return (
    <h1>Invalid Opensea URL.</h1>
  );
}