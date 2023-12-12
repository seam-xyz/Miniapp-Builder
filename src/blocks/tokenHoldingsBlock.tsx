import { useEffect, useState } from 'react';
import { getTokensForOwner } from './utils/AlchemyAPI';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import Block from './Block'
import { BlockModel } from './types'
import TitleComponent from './utils/TitleComponent';

import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { ImageList, ImageListItem, Theme, ToggleButton, ToggleButtonGroup } from '@mui/material';



interface TokenGridProps {
  /**
   * Ethereum address (`0x...`) or ENS domain (`vitalik.eth`) for which the gallery should contain associated NFTs.
   * Required.
   */
  ownerAddress: string;


  /**
  * Ethereum address (`0x...`) for an NFT contract to filter to.
  * Optional.
  */
  // Unimplimented for now
  // contract?: string;

  theme: Theme


}


function LookupTokens(props: TokenGridProps) {
  const [tokenList, setTokenList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    async function fetchTokenData() {
      try {
        const tokens = await getTokensForOwner(props.ownerAddress); //, props.contract);
        const tokenAssets = tokens.assets
        .filter(val => val.token.balance && parseFloat(val.token.balance) !== 0.0)
        .map((val, index) => (
          <li key={index}>
            {val.token.name} Token Balance: {val.amount.toString()} {val.token.symbol}
          </li> 
        ));
        console.log(tokens.assets)
        setTokenList(tokenAssets);
      } catch (error) {
        console.error("Error fetching token data:", error);
        setTokenList([]);
      }
    }





    // Helper function to convert hexadecimal to decimal
    function convertHexToDecimal(hexString: string): string {
      return Number(hexString).toString();
    }

    fetchTokenData();
  }, [props.ownerAddress]); //, props.contract]);

  return (
    <div>
      <h1>Token List</h1>
      <ul>{tokenList}</ul>
    </div>
  );
}




export default class tokenHoldingsBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0 || !this.model.data['ownerAddress']) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }
    const ownerAddress = this.model.data["ownerAddress"]
    const contract = this.model.data["contractAddress"]
    const imageViewMode = this.model.data['imageViewMode']
    const title = this.model.data['title']
    return (
      <>
        {title && TitleComponent(this.theme, title)}
        <LookupTokens ownerAddress={ownerAddress}
          //contract={contract}
          theme={this.theme}
           />
      </>
    );

  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      this.model.data['ownerAddress'] = (data.get('ownerAddress') as string).toLowerCase()
      //this.model.data['contractAddress'] = data.get('contractAddress') as string
      this.model.data['title'] = data.get('title') as string
      done(this.model)
    };

    const ImageViewModeToggle = () => {
      const [imageViewMode, setImageViewMode] = useState<string | null>(this.model.data['imageViewMode']);
      const handleToggleChange = (
        event: React.MouseEvent<HTMLElement>,
        value: string,
      ) => {
        const val = value ?? this.model.data['imageViewMode']
        this.model.data['imageViewMode'] = val
        setImageViewMode(val)
      };

      return (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '5px' }}>Image Layout:</div>
          <ToggleButtonGroup
            exclusive
            value={imageViewMode}
            onChange={handleToggleChange}
            id="imageViewMode"
          >
            <ToggleButton value="grid" key="grid" aria-label="grid">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" key="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      );
    }

    return (
      <Box
        component="form"
        onSubmit={onFinish}
        style={{}}
      >
        <TextField
          margin="normal"
          required
          defaultValue={this.model.data['ownerAddress']}
          fullWidth
          id="ownerAddress"
          label="Wallet Address or ENS"
          name="ownerAddress"
        />
        <TextField
          margin="normal"
          defaultValue={this.model.data['title'] ?? "My Tokens"}
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
    )
  }

  renderErrorState() {
    return (
      <h1>Error loading Token Block</h1>
    )
  }
}
