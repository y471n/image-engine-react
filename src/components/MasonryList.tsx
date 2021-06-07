import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 500,
      // height: 450,
    },
  })
);

enum TileColumn {
  One = 1,
  Two = 2,
}

interface ITile {
  img: string;
  title: string;
  author: string;
  cols: TileColumn;
}

interface IMasonryListProps {
  tiles: ITile[];
}

const MasonryList = (props: IMasonryListProps) => {
  const { tiles } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={3}>
        {tiles.map((tile) => (
          <GridListTile key={tile.img} cols={tile.cols || 1}>
            <img src={`/images/${tile.img}`} alt={tile.title} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

export default MasonryList;
