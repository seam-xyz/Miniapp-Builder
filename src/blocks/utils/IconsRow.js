import { Select } from 'antd';
import { makeStyles } from "@material-ui/core/styles";
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import ErrorIcon from '@material-ui/icons/Error';
import EmailIcon from '@material-ui/icons/Email';
import YoutubeIcon from '@material-ui/icons/YouTube';
import LinkedIn from "@material-ui/icons/LinkedIn";
import Discord from "./blockIcons/discordLogo.png";
import Tiktok from "./blockIcons/tiktokIcon.png";
import LinkIcon from "@material-ui/icons/Link";
import mediumIcon from "./blockIcons/mediumIcon.svg"
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
    <Select style={{ width: "75px" }} id="icon">
      <Option value="twitter"><TwitterIcon /></Option>
      <Option value="instagram"><InstagramIcon /></Option>
      <Option value="linkedin"><LinkedIn /></Option>
      <Option value="discord"><img src={Discord} style={{ height: 20, color: "red" }} /></Option>
      <Option value="tiktok"><img src={Tiktok} style={{ height: 20 }} /></Option>
      <Option value="medium"><img src={mediumIcon} style={{ height: 20 }} /></Option>
      <Option value="link"><LinkIcon /></Option>
      <Option value="email"><EmailIcon /></Option>
      <Option value="youtube"><YoutubeIcon /></Option>
      <Option value="facebook"><FacebookIcon /></Option>
    </Select>
  )
}

export default function IconsRow({ icons }) {
  const classes = useStyles();

  function getIconForName(name) {
    switch (name) {
      case "twitter":
        return <TwitterIcon key={name} />
      case "discord":
        return <img src={Discord} className={classes.iconImage} />
      case "tiktok":
        return <img src={Tiktok} className={classes.iconImage} />
      case "medium":
        return <img src={mediumIcon} className={classes.iconImage} />
      case "facebook":
        return <FacebookIcon key={name} />
      case "linkedin":
        return <LinkedIn key={name} />
      case "link":
        return <LinkIcon key={name} />
      case "instagram":
        return <InstagramIcon key={name} />
      case "email":
        return <EmailIcon key={name} />
      case "youtube":
        return <YoutubeIcon key={name} />
      default:
        return <ErrorIcon key={name} />
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