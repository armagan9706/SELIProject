import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  root: {
    height: 380,
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}));

export default function FileDial(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [hidden, setHidden] = React.useState(false);

  const handleVisibility = () => {
    setOpen(false);
    setHidden(prevHidden => !prevHidden);
  };

  const handleClick = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleOpen = () => {
    if (!hidden) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="file-dial-container">
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        className="file-dial-container"
        hidden={hidden}
        icon={props.icon}
        //onBlur={handleClose}
        onClick={handleClick}
        //onClose={handleClose}
        //onFocus={handleOpen}
        //onMouseEnter={handleOpen}
        //onMouseLeave={handleClose}
        open={open}
        direction="right"
        ButtonProps={{
          color: props.color
        }}
      >
        {props.actions.map(action => (
          <Link
            className="MuiButtonBase-root MuiFab-root MuiSpeedDial-fab MuiFab-primary"
            key={action.name}
            tooltipTitle={action.name}
            onClick={action.action}
            tooltipPlacement="bottom"
          >
            {action.icon}
          </Link>
        ))}
      </SpeedDial>
    </div>
  );
}
