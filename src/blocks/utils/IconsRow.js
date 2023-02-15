import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from "@mui/styles";
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import ErrorIcon from '@mui/icons-material/Error';
import EmailIcon from '@mui/icons-material/Email';
import YoutubeIcon from '@mui/icons-material/YouTube';
import LinkedIn from "@mui/icons-material/LinkedIn";
import Discord from "../blockIcons/discordLogo.png";
import Tiktok from "../blockIcons/tiktokIcon.png";
import LinkIcon from "@mui/icons-material/Link";
import mediumIcon from "../blockIcons/mediumIcon.svg"
import Stack from '@mui/material/Stack';

const { Option } = Select;

const useStyles = makeStyles((theme) => ({
  iconImage: {
    height: "20px",
    color: "black"
  }
}));

export function IconsSelector() {
  return (
    <Select style={{ width: "75px" }} variant="standard" size="small" id="icon">
      <MenuItem value="twitter"><TwitterIcon /></MenuItem>
      <MenuItem value="instagram"><InstagramIcon /></MenuItem>
      <MenuItem value="linkedin"><LinkedIn /></MenuItem>
      <MenuItem value="discord"><img src={Discord} style={{ height: 20 }} /></MenuItem>
      <MenuItem value="tiktok"><img src={Tiktok} style={{ height: 20 }} /></MenuItem>
      <MenuItem value="medium"><img src={mediumIcon} style={{ height: 20 }} /></MenuItem>
      <MenuItem value="link"><LinkIcon /></MenuItem>
      <MenuItem value="email"><EmailIcon /></MenuItem>
      <MenuItem value="youtube"><YoutubeIcon /></MenuItem>
      <MenuItem value="facebook"><FacebookIcon /></MenuItem>
    </Select>
  )
}

export default function IconsRow({ icons, color }) {
  const classes = useStyles();

  function getIconForName(name) {
    switch (name) {
      case "twitter":
        return <TwitterIcon key={name} sx={{ color: color }}/>
      case "discord":
        return <img src={Discord} className={classes.iconImage} sx={{ color: color }} />
      case "tiktok":
        return <img src={Tiktok} className={classes.iconImage} sx={{ color: color }}/>
      case "medium":
        return <img src={mediumIcon} className={classes.iconImage} sx={{ color: color }}/>
      case "facebook":
        return <FacebookIcon key={name} sx={{ color: color }}/>
      case "linkedin":
        return <LinkedIn key={name} sx={{ color: color }}/>
      case "link":
        return <LinkIcon key={name} sx={{ color: color }}/>
      case "instagram":
        return <InstagramIcon key={name} sx={{ color: color }}/>
      case "email":
        return <EmailIcon key={name} sx={{ color: color }}/>
      case "youtube":
        return <YoutubeIcon key={name} sx={{ color: color }}/>
      default:
        return <ErrorIcon key={name} sx={{ color: color }}/>
    }
  }

  if (icons == undefined || icons.length === 0) {
    return null
  }

  return (
    <Stack spacing={4} direction={"row"}>
      {icons.map((icon) => (
        // react router keeps sending the link internally if it doesnt have the https
        <a href={(icon.url.indexOf(':') === -1) ? 'http://' + icon.url : icon.url} rel="noopener" target="_blank" key={icon['icon']} className={classes.iconImage}>
          {getIconForName(icon['icon'])}
        </a>
      ))}
    </Stack>
  );
}