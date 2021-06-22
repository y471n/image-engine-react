import {
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import React from "react";
import "./App.css";
import { ImageEngineProvider, Image } from "@imageengine/react";

const initialState = {
  width: 400,
  rotate: 0,
  height: 500,
  compression: 10,
  outputFormat: "jpg",
  fitMethod: "box",
  noOptimization: false,
  sharpness: 10,
  scaleToScreenWidth: 0,
  autoWidthWithFallback: 0,
  cropWidth: 0,
  cropHeight: 0,
  cropTop: 0,
  cropLeft: 0,
  crop: [0, 0, 0, 0],
  inline: true,
  keepMeta: true,
  error: {},
};

interface IAction {
  type: string;
  fieldName: string;
  payload: string | number | boolean | number[];
}

const reducer = (state: any, action: IAction) => {
  switch (action.type) {
    case "field": {
      return { ...state, [action.fieldName]: action.payload };
    }
    case "SET_COMPRESSION": {
      if (action.payload < 0 || action.payload > 100) {
        return { ...state, error: { compression: true } };
      }
      return {
        ...state,
        compression: action.payload,
        error: { compression: false },
      };
    }
    case "SET_SHARPNESS": {
      if (action.payload < 0 || action.payload > 100) {
        return { ...state, error: { sharpness: true } };
      }
      return {
        ...state,
        sharpness: action.payload,
        error: { sharpness: false },
      };
    }
    case "SET_ROTATE": {
      if (action.payload < -360 || action.payload > 360) {
        return { ...state, error: { rotate: true } };
      }
      return {
        ...state,
        rotate: Number(action.payload),
        error: { rotate: false },
      };
    }
    case "SET_ScaleToScreenWidth": {
      if (action.payload < -360 || action.payload > 360) {
        return { ...state, error: { scaleToScreenWidth: true } };
      }
      return {
        ...state,
        scaleToScreenWidth: Number(action.payload),
        error: { scaleToScreenWidth: false },
      };
    }
    case "SET_NO_OPTIMIZATION": {
      return { ...state, noOptimization: action.payload === "true" };
    }
    default:
      return state;
  }
};

const fileSize = async (imageSrc: string) => {
  const fileImg = await fetch(imageSrc);
  return fileImg.blob();
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    formContainer: {
      marginTop: "2rem",
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      height: "4rem",
      color: theme.palette.text.secondary,
    },
  })
);

function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {
    width,
    rotate,
    height,
    compression,
    autoWidthWithFallback,
    outputFormat,
    fitMethod,
    noOptimization,
    sharpness,
    scaleToScreenWidth,
    // cropWidth,
    // cropHeight,
    // cropLeft,
    // cropTop,
    // crop,
    error,
  } = state;

  const [imageSize, setImageSize] = React.useState(0);
  const el = document.getElementsByTagName("img");

  React.useEffect(() => {
    const fetchImageSize = async () => {
      console.log(el[0].currentSrc);

      const imageFile = await fileSize(el[0].currentSrc);
      if (imageFile.type.indexOf("image") !== -1) {
        setImageSize(
          (Number(imageFile.size) / 1024).toFixed(2) as unknown as number
        );
      }
    };
    fetchImageSize();
  });

  const classes = useStyles();

  const fieldDispatch = (event: any, fieldName: string) =>
    dispatch({
      type: "field",
      fieldName: fieldName,
      payload: event.target.value,
    });

  // React.useEffect(() => {
  //   dispatch({
  //     type: "field",
  //     fieldName: "crop",
  //     payload: [cropWidth, cropHeight, cropLeft, cropTop],
  //   });
  // }, [cropWidth, cropHeight, cropLeft, cropTop]);

  return (
    <ImageEngineProvider deliveryAddress="https://gecvpk4e.cdn.imgeng.in">
      <div className="App">
        <Container>
          <Box m={3}>
            <Typography variant="h2" component="h1">
              Image Engine Demo
            </Typography>
          </Box>
          <Image
            src={`/images/bike.jpg`}
            alt="Bike"
            directives={{
              width: width,
              fitMethod: fitMethod,
              rotate: rotate,
              autoWidthWithFallback: autoWidthWithFallback || undefined,
              height: height,
              compression: compression,
              outputFormat,
              noOptimization,
              sharpness,
              scaleToScreenWidth,
              // crop,
            }}
          />
          <Typography variant="inherit" component="p">
            Image size: {imageSize} KB
          </Typography>
        </Container>

        <Container className={classes.formContainer}>
          <Box>
            <form className="" noValidate autoComplete="off">
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <TextField
                      id="standard-basic"
                      label="Width"
                      value={width}
                      onChange={(event) => fieldDispatch(event, "width")}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <TextField
                      id="standard-basic"
                      label="Height"
                      value={height}
                      onChange={(event) => fieldDispatch(event, "height")}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <TextField
                      id="standard-basic"
                      label="AutoWidth with Fallback"
                      value={autoWidthWithFallback}
                      onChange={(event) =>
                        fieldDispatch(event, "autoWidthWithFallback")
                      }
                    />
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <TextField
                      error={error?.rotate}
                      label="Rotate"
                      value={rotate}
                      id="standard-number"
                      type="number"
                      onChange={(event) =>
                        dispatch({
                          type: "SET_ROTATE",
                          fieldName: "rotate",
                          payload: event.target.value,
                        })
                      }
                      helperText="(-360) - (+360)"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <TextField
                      error={error?.compression}
                      label="Compression"
                      value={compression}
                      id="standard-number"
                      type="number"
                      onChange={(event) =>
                        dispatch({
                          type: "SET_COMPRESSION",
                          fieldName: "compression",
                          payload: event.target.value,
                        })
                      }
                      helperText="0 - 100"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <TextField
                      error={error?.sharpness}
                      label="Sharpness"
                      value={sharpness}
                      id="standard-number"
                      type="number"
                      onChange={(event) =>
                        dispatch({
                          type: "SET_SHARPNESS",
                          fieldName: "sharpness",
                          payload: event.target.value,
                        })
                      }
                      helperText="0 - 100"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <TextField
                      error={error?.scaleToScreenWidth}
                      label="Scale to Screen Width"
                      value={scaleToScreenWidth}
                      id="standard-number"
                      type="number"
                      onChange={(event) =>
                        dispatch({
                          type: "SET_ScaleToScreenWidth",
                          fieldName: "scaleToScreenWidth",
                          payload: event.target.value,
                        })
                      }
                      helperText="0 - 100"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <FormControl>
                      <InputLabel id="">Output Format</InputLabel>
                      <Select
                        value={outputFormat}
                        onChange={(event) =>
                          fieldDispatch(event, "outputFormat")
                        }
                        displayEmpty
                        label="Format"
                      >
                        <MenuItem value="png">
                          <em>Png</em>
                        </MenuItem>
                        <MenuItem value="gif">
                          <em>Gif</em>
                        </MenuItem>
                        <MenuItem value="jpg">
                          <em>Jpg</em>
                        </MenuItem>
                        <MenuItem value="bmp">
                          <em>Bmp</em>
                        </MenuItem>
                        <MenuItem value="webp">
                          <em>Webp</em>
                        </MenuItem>
                        <MenuItem value="jp2">
                          <em>Jp2</em>
                        </MenuItem>
                        <MenuItem value="svg">
                          <em>Svg</em>
                        </MenuItem>
                        <MenuItem value="jxr">
                          <em>Jxr</em>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <FormControl>
                      <InputLabel id="">No Optimization</InputLabel>
                      <Select
                        value={noOptimization}
                        onChange={(event) =>
                          dispatch({
                            type: "SET_NO_OPTIMIZATION",
                            fieldName: "noOptimization",
                            payload: event.target.value as string,
                          })
                        }
                        displayEmpty
                        label="No Optimization"
                      >
                        <MenuItem value="false">
                          <em>False</em>
                        </MenuItem>
                        <MenuItem value="true">
                          <em>True</em>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Paper>
                </Grid>

                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <Select
                      value={fitMethod}
                      onChange={(event) => fieldDispatch(event, "fitMethod")}
                      displayEmpty
                    >
                      <MenuItem value="stretch">
                        <em>Stretch</em>
                      </MenuItem>
                      <MenuItem value="box">
                        <em>Box</em>
                      </MenuItem>
                      <MenuItem value="letterbox">
                        <em>Letterbox</em>
                      </MenuItem>
                      <MenuItem value="cropbox">
                        <em>Cropbox</em>
                      </MenuItem>
                    </Select>
                  </Paper>
                </Grid>

                {/* <TextField
                id="standard-basic"
                label="Crop width"
                value={cropWidth}
                onChange={(event) => fieldDispatch(event, "cropWidth")}
              />
              <TextField
                id="standard-basic"
                label="Crop height"
                value={cropHeight}
                onChange={(event) => fieldDispatch(event, "cropHeight")}
              />
              <TextField
                id="standard-basic"
                label="Crop left"
                value={cropLeft}
                onChange={(event) => fieldDispatch(event, "cropLeft")}
              />
              <TextField
                id="standard-basic"
                label="Crop top"
                value={cropTop}
                onChange={(event) => fieldDispatch(event, "cropTop")}
              /> */}
              </Grid>
            </form>
          </Box>
        </Container>
      </div>
    </ImageEngineProvider>
  );
}

export default App;
