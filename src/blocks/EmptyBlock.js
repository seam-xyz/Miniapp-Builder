import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    alignItems: "center",
    paddingTop: "40px", // below the edit bar
    marginLeft: "10px",
    marginRight: "10px",
    paddingBottom: "10px",
    height: "100%",
  },
  empty: {
    backgroundColor: "#EEEEEE",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: "8px",
    height: "50%",
    cursor: "pointer"
  }
});

export default function EmptyBlock({ title, onClick }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h2>{title}</h2>
      <div className={classes.empty} onClick={onClick}>
        <h4 style={{color: "#818181"}}>{"Tap to customize the " + title}</h4>
      </div>
    </div>
  );
}