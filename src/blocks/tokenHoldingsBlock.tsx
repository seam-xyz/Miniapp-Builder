import { useEffect, useState } from 'react';
import { getTokensForOwner } from './utils/AlchemyAPI';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { ComposerComponentProps, FeedComponentProps } from './types'
import TitleComponent from './utils/TitleComponent';
import './BlockStyles.css'

interface TokenGridProps {
  /**
   * Ethereum address (`0x...`) or ENS domain (`vitalik.eth`) for which the gallery should contain associated NFTs.
   * Required.
   */
  ownerAddress: string;
}

function LookupTokens(props: TokenGridProps) {
  const [tokenList, setTokenList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    async function fetchTokenData() {
      try {
        const tokens = await getTokensForOwner(props.ownerAddress); 
        if (tokens.assets.length === 0) {
          setTokenList([<li key="0">Wallet has no tokens :(</li>]);
        } else {
          const tokenAssets = tokens.assets
          .filter(val => val.token.balance && parseFloat(val.token.balance) !== 0.0)
          .map((val, index) => (
            <li key={index}>
              {val.token.name} Token Balance: {val.amount.toString()} {val.token.symbol}
            </li> 
          ));
          setTokenList(tokenAssets);
        }
      } catch (error) {
        console.error("Error fetching token data:", error);
        setTokenList([])  ;
      }
    }
  
    fetchTokenData();
  }, [props.ownerAddress]);

  return (
    <ul>{tokenList}</ul>
  );
}

export const TokenHoldingsFeedComponent = ({ model }: FeedComponentProps) => {
  const ownerAddress = model.data["ownerAddress"];
  const title = model.data['title'];

  return (
    <div style={{ position: 'absolute', overflow: 'scroll' }}>
      {title && TitleComponent(title)}
      <LookupTokens ownerAddress={ownerAddress} />
    </div>
  );
}

export const TokenHoldingsComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const onFinish = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    model.data['ownerAddress'] = (data.get('ownerAddress') as string).toLowerCase();
    model.data['title'] = data.get('title') as string;
    done(model);
  };

  return (
    <Box
      component="form"
      onSubmit={onFinish}
      style={{}}
    >
      <TextField
        margin="normal"
        required
        defaultValue={model.data['ownerAddress']}
        fullWidth
        id="ownerAddress"
        label="Wallet Address or ENS"
        name="ownerAddress"
      />
      <TextField
        margin="normal"
        defaultValue={model.data['title'] ?? "My Tokens"}
        fullWidth
        id="title"
        label="Title"
        name="title"
      />
      <Button
        type="submit"
        variant="contained"
        className="save-modal-button"
        sx={{ mt: 3, mb: 1 }}
      >
        Save
      </Button>
    </Box>
  );
}
