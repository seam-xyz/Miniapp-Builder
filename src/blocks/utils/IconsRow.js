import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from "@mui/styles";
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import ErrorIcon from '@mui/icons-material/Error';
import EmailIcon from '@mui/icons-material/Email';
import YoutubeIcon from '@mui/icons-material/YouTube';
import LinkedIn from '@mui/icons-material/LinkedIn';
import LinkIcon from '@mui/icons-material/Link';
import Stack from '@mui/material/Stack';

import Discord from "../blockIcons/discordLogo.png";
import Tiktok from "../blockIcons/tiktokIcon.png";
import mediumIcon from "../blockIcons/mediumIcon.svg"
import openseaIcon from "../blockIcons/openseaIcon.png"
import farcasterIcon from "../blockIcons/farcasterIcon.svg"

const useStyles = makeStyles(() => ({
  iconImage: {
    height: "20px",
    width: "20px",
    maxHeight: "20px",
    color: "black"
  }
}));

export const IconsSelector = (props) => {
  const { value, onChange } = props;
  return (
    <Select style={{ width: "75px" }} variant="standard" size="small" id="icon" value={value} onChange={(e) => onChange(e.target.value)}>
      <MenuItem value="twitter"><TwitterIcon /></MenuItem>
      <MenuItem value="instagram"><InstagramIcon /></MenuItem>
      <MenuItem value="linkedin"><LinkedIn /></MenuItem>
      <MenuItem value="discord"><img src={Discord} alt={""} style={{ height: 20 }} /></MenuItem>
      <MenuItem value="tiktok"><img src={Tiktok} alt={""} style={{ height: 20 }} /></MenuItem>
      <MenuItem value="medium"><img src={mediumIcon} alt={""} style={{ height: 20 }} /></MenuItem>
      <MenuItem value="link"><LinkIcon /></MenuItem>
      <MenuItem value="email"><EmailIcon /></MenuItem>
      <MenuItem value="youtube"><YoutubeIcon /></MenuItem>
      <MenuItem value="facebook"><FacebookIcon /></MenuItem>
      <MenuItem value="opensea"><img src={openseaIcon} alt={""} style={{ height: 20 }} /></MenuItem>
      <MenuItem value="farcaster"><img src={farcasterIcon} alt={""} style={{ height: 20 }} /></MenuItem>
    </Select>
  );
}

const IconsRow = ({ icons, color }) => {
  const classes = useStyles();

  const getIconForName = (name) => {
    switch (name) {
      case "twitter":
        return <TwitterIcon key={name} sx={{ color: color }} />
      case "discord":
        return <img src={Discord} alt={""} className={classes.iconImage} sx={{ color: color }} />
      case "opensea":
        return <img src={openseaIcon} alt={""} className={classes.iconImage} style={{ marginTop: "-3px" }} />
      case "tiktok":
        return <img src={Tiktok} alt={""} className={classes.iconImage} sx={{ color: color }} />
      case "farcaster":
        return <img src={farcasterIcon} alt={""} className={classes.iconImage} sx={{ color: color }} />
      case "medium":
        return <img src={mediumIcon} alt={""} className={classes.iconImage} sx={{ color: color }} />
      case "facebook":
        return <FacebookIcon key={name} sx={{ color: color }} />
      case "linkedin":
        return <LinkedIn key={name} sx={{ color: color }} />
      case "link":
        return <LinkIcon key={name} sx={{ color: color }} />
      case "instagram":
        return <InstagramIcon key={name} sx={{ color: color }} />
      case "email":
        return <EmailIcon key={name} sx={{ color: color }} />
      case "youtube":
        return <YoutubeIcon key={name} sx={{ color: color }} />
      default:
        return <ErrorIcon key={name} sx={{ color: color }} />
    }
  }

  if (!icons || icons.length === 0) {
    return null;
  }

  return (
    <Stack spacing={4} direction={"row"}>
      {icons.map((icon) => (
        <a style={{ height: '24px' }} href={(icon.url.indexOf(':') === -1) ? 'http://' + icon.url : icon.url} rel="noreferrer" target="_blank" key={icon.icon}>
          {getIconForName(icon.icon)}
        </a>
      ))}
    </Stack>
  );
}

export default IconsRow;