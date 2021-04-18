import React from "react";
import Accessibility from "@material-ui/icons/Accessibility";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";

const TopBar = (props) => {
  const onIconClicked = () => props.viewDialog(); // notify parent
  return (
    <AppBar position="static" style={{ borderRadius: 10 }}>
      <Toolbar color="primary" title="Chat it Up!">
        <Typography variant="h6" color="inherit">
          Chat it up! - Info3139
        </Typography>
        <section style={{ height: 90, width: 90, marginLeft: "auto" }}>
          {props.isJoin && (
            <IconButton onClick={onIconClicked}>
              <Accessibility
                style={{ color: "white", height: 70, width: 70 }}
              />
            </IconButton>
          )}
        </section>
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
