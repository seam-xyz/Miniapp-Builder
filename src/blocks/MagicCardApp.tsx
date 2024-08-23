import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ComposerComponentProps, FeedComponentProps } from "./types";
import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Stack,
  TextField,
} from "@mui/material";
import { nanoid } from "nanoid";
import { FirebaseStorage } from "@capacitor-firebase/storage";
import { Filesystem, Directory } from '@capacitor/filesystem';
import EditIcon from "@mui/icons-material/Edit";
import WandIcon from "@mui/icons-material/AutoFixHigh";
import SendIcon from "@mui/icons-material/Send";

import "../blocks/assets/MagicCard/magicCard.css";
import { Capacitor } from "@capacitor/core";

const cardColors = ["land", "artifact", "white", "blue", "black", "red", "green"] as const;
type CardColor = (typeof cardColors)[number];
const borderColors = ["black", "white"] as const;
type BorderColor = (typeof borderColors)[number];

type MagicCardProps = {
  cardName: string;
  manaCost: { colorless: number; white: number; blue: number; black: number; red: number; green: number };
  cardColor: CardColor;
  borderColor: BorderColor;
  illustration: string;
  type: string;
  subType: string;
  power: string;
  toughness: string;
  rules: string;
  flavorText: string;
};

type MagicCardSetterProps = {
  setCardName: (cardName: string) => void;
  setManaCost: (manaCost: {
    colorless: number;
    white: number;
    blue: number;
    black: number;
    red: number;
    green: number;
  }) => void;
  setCardColor: (color: CardColor) => void;
  setBorderColor: (borderColor: BorderColor) => void;
  setIllustration: (illustration: string) => void;
  setType: (type: string) => void;
  setSubType: (subType: string) => void;
  setPower: (power: string) => void;
  setToughness: (toughness: string) => void;
  setRules: React.Dispatch<React.SetStateAction<string>>;
  setFlavorText: (flavorText: string) => void;
};

type Resources = {
  borders: {
    black: string;
    white: string;
  };
  icons: Record<string, string>;
  frames: Record<CardColor, string>;
  ptBoxes: Record<CardColor, string>;
};

const resources: Resources = {
  borders: {
    black: "https://storage.googleapis.com/miniapp-resources/magicCard/borders/black-border.png",
    white: "https://storage.googleapis.com/miniapp-resources/magicCard/borders/white-border.png",
  },
  icons: {
    "{p}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/plains.png",
    "{i}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/island.png",
    "{s}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/swamp.png",
    "{m}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/mountain.png",
    "{f}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/forest.png",
    "{t}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/tap.png",
    "{u}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/untap.png",
    "{1}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/1.png",
    "{2}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/2.png",
    "{3}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/3.png",
    "{4}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/4.png",
    "{5}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/5.png",
    "{6}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/6.png",
    "{7}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/7.png",
    "{8}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/8.png",
    "{9}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/9.png",
    "{x}": "https://storage.googleapis.com/miniapp-resources/magicCard/icons/x.png",
  },
  frames: {
    land: "https://storage.googleapis.com/miniapp-resources/magicCard/frames/land-frame.png",
    artifact: "https://storage.googleapis.com/miniapp-resources/magicCard/frames/artifact-frame.png",
    white: "https://storage.googleapis.com/miniapp-resources/magicCard/frames/white-frame.png",
    black: "https://storage.googleapis.com/miniapp-resources/magicCard/frames/black-frame.png",
    blue: "https://storage.googleapis.com/miniapp-resources/magicCard/frames/blue-frame.png",
    green: "https://storage.googleapis.com/miniapp-resources/magicCard/frames/green-frame.png",
    red: "https://storage.googleapis.com/miniapp-resources/magicCard/frames/red-frame.png",
  },
  ptBoxes: {
    land: "https://storage.googleapis.com/miniapp-resources/magicCard/ptBoxes/land-pt-box.png",
    artifact: "https://storage.googleapis.com/miniapp-resources/magicCard/ptBoxes/artifact-pt-box.png",
    white: "https://storage.googleapis.com/miniapp-resources/magicCard/ptBoxes/white-pt-box.png",
    black: "https://storage.googleapis.com/miniapp-resources/magicCard/ptBoxes/black-pt-box.png",
    blue: "https://storage.googleapis.com/miniapp-resources/magicCard/ptBoxes/blue-pt-box.png",
    green: "https://storage.googleapis.com/miniapp-resources/magicCard/ptBoxes/green-pt-box.png",
    red: "https://storage.googleapis.com/miniapp-resources/magicCard/ptBoxes/red-pt-box.png",
  },
} as const;

const ILLUSTRATION_WIDTH = 618;
const ILLUSTRATION_HEIGHT = 455;

// /{p}|{w}|{1}|{2}|.../g
const placeholderRegex = new RegExp(
  Object.keys(resources.icons)
    .map((placeholder) => placeholder.replace(/([{}])/g, "\\$1"))
    .join("|"),
  "g"
);

function mergeRefs<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

function randomEl<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rescaleCanvas(canvas: HTMLCanvasElement, scale: number) {
  const scaledWidth = canvas.width * scale;
  const scaledHeight = canvas.height * scale;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = scaledWidth;
  tempCanvas.height = scaledHeight;

  // Draw the original canvas onto the temporary canvas
  const ctx = tempCanvas.getContext("2d");
  if (ctx == null) {
    throw new Error("Could not get 2d context");
  }
  ctx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight);
  return tempCanvas;
}

export const MagicCardFeedComponent = ({ model }: FeedComponentProps) => {
  return (
    <img
      style={{ width: "100%", height: "auto", objectFit: "contain", maxHeight: "500px", alignSelf: "center" }}
      src={model.data["dataURL"]}
      alt="Magic Card"
    />
  );
};

const RulesHelper = memo(({ addIcon }: { addIcon: (icon: string) => void }) => {
  const imgStyle = { cursor: "pointer", width: 20, height: 20 };

  const makeAddIcon = (icon: string) => (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    event.stopPropagation();
    event.preventDefault();
    addIcon(icon);
  };

  // prevent mousedown from taking away focus
  const handleMouseDown = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    event.preventDefault();
  };

  return (
    <>
      {Object.keys(resources.icons).map((iconPlaceholder) => (
        <ButtonBase tabIndex={-1} key={iconPlaceholder}>
          <img
            style={imgStyle}
            src={resources.icons[iconPlaceholder]}
            alt={iconPlaceholder}
            onMouseDown={handleMouseDown}
            onClick={makeAddIcon(iconPlaceholder)}
          />
        </ButtonBase>
      ))}
    </>
  );
});

type ImageCropperProps = {
  image: HTMLImageElement;
  saveImage: (dataURL: string) => void;
};

type Pos = [number, number];

const ImageCropper = ({ image, saveImage }: ImageCropperProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [dragPosition, setDragStart] = useState<Pos | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePos, setImagePos] = useState<Pos>([0, 0]);
  const [imageDragStart, setImageDragStart] = useState<Pos | null>(null);

  const dragging = dragPosition !== null && imageDragStart !== null;

  const zoom = useMemo(
    () => Math.min(ILLUSTRATION_WIDTH / image.width, ILLUSTRATION_HEIGHT / image.height) * zoomLevel,
    [zoomLevel, image.width, image.height]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!dragging) {
        return;
      }

      setImagePos([
        imageDragStart[0] + (dragPosition[0] - event.clientX) / zoom,
        imageDragStart[1] + (dragPosition[1] - event.clientY) / zoom,
      ]);
    },
    [dragPosition, dragging, imageDragStart, zoom]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!dragging) {
        return;
      }

      const pos = [event.touches[0].clientX, event.touches[0].clientY];

      setImagePos([
        imageDragStart[0] + (dragPosition[0] - pos[0]) / zoom,
        imageDragStart[1] + (dragPosition[1] - pos[1]) / zoom,
      ]);
    },
    [dragPosition, dragging, imageDragStart, zoom]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (dragging) {
        return;
      }

      setImageDragStart(imagePos);
      setDragStart([event.clientX, event.clientY]);
    },
    [dragging, imagePos]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      if (dragging) {
        return;
      }

      setImageDragStart(imagePos);
      setDragStart([event.touches[0].clientX, event.touches[0].clientY]);
    },
    [dragging, imagePos]
  );

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      setDragStart(null);
    }
  }, [dragging]);

  const redraw = useCallback(() => {
    if (ref.current == null) {
      return;
    }

    const ctx = ref.current.getContext("2d");
    if (ctx == null) {
      return;
    }

    const imageDims = [image.width, image.height];

    const [sx, sy, sw, sh] = [
      imagePos[0] + imageDims[0] / 2 - ILLUSTRATION_WIDTH / 2 / zoom,
      imagePos[1] + imageDims[1] / 2 - ILLUSTRATION_HEIGHT / 2 / zoom,
      ILLUSTRATION_WIDTH / zoom,
      ILLUSTRATION_HEIGHT / zoom,
    ];
    const [dx, dy, dw, dh] = [0, 0, ILLUSTRATION_WIDTH, ILLUSTRATION_HEIGHT];
    ctx.clearRect(0, 0, ILLUSTRATION_WIDTH, ILLUSTRATION_HEIGHT);
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }, [image, imagePos, zoom]);

  const cropAndSave = useCallback(() => {
    if (ref.current == null) {
      return;
    }

    const ctx = ref.current.getContext("2d");
    if (ctx == null) {
      return;
    }
    const dataURL = ref.current.toDataURL("image/png");
    saveImage(dataURL);
  }, [saveImage]);

  const resetImage = useCallback(() => {
    setImagePos([0, 0]);
    setZoomLevel(1);
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener("resize", redraw);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", redraw);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, redraw]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  return (
    <Box
      width={"100%"}
      paddingRight={3}
      paddingLeft={3}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent="space-evenly"
    >
      <canvas
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseUp}
        style={{
          userSelect: "none",
          cursor: dragPosition ? "grabbing" : "grab",
          height: "auto",
          maxHeight: "calc(100% - 74px)",
          maxWidth: "100%",
          objectFit: "contain",
          border: "2px solid black",
        }}
        width={ILLUSTRATION_WIDTH}
        height={ILLUSTRATION_HEIGHT}
        ref={ref}
      />
      <Box>
        <Slider value={zoomLevel} onChange={(_, value) => setZoomLevel(value as number)} min={1} max={8} step={0.1} />
        <Stack direction={"row"} spacing={2} justifyContent="space-between">
          <Button variant="outlined" onClick={() => saveImage("")}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={resetImage}>
            Reset Crop
          </Button>
          <Button variant="contained" onClick={cropAndSave}>
            OK
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

const MagicCardEditor = forwardRef(
  (props: MagicCardProps & MagicCardSetterProps, formRef: React.ForwardedRef<HTMLFormElement>) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const rulesInputRef = useRef<HTMLInputElement>(null);
    const [cropImage, setCropImage] = useState<HTMLImageElement | null>(null);
    const { setRules } = props;

    const addToRules = useCallback(
      (icon: string) => {
        setRules((state) => {
          if (rulesInputRef.current == null) {
            return state + icon;
          }

          if (rulesInputRef.current.selectionEnd == null) {
            return state + icon;
          }

          const newSelection = rulesInputRef.current.selectionStart ?? 0;

          setTimeout(() => {
            if (rulesInputRef.current == null) {
              return;
            }
            rulesInputRef.current.setSelectionRange(newSelection + 3, newSelection + 3, "forward");
          }, 1);

          return (
            state.slice(0, rulesInputRef.current.selectionStart ?? 0) +
            icon +
            state.slice(rulesInputRef.current.selectionEnd)
          );
        });
        rulesInputRef.current?.focus();
      },
      [setRules]
    );

    return (
      <Box
        style={{
          overflowY: "auto",
          height: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {cropImage !== null ? (
          <ImageCropper
            image={cropImage}
            saveImage={(dataURL) => {
              setCropImage(null);
              props.setIllustration(dataURL);
            }}
          />
        ) : (
          <Stack component="form" ref={formRef} style={{ height: "auto", padding: 8 }} spacing={2}>
            <Stack gap={2} direction={"row"} flexWrap="wrap">
              <TextField
                tabIndex={1}
                error={props.cardName === ""}
                required
                style={{ flexGrow: 1 }}
                label="Card Name"
                placeholder=""
                value={props.cardName}
                onChange={(e) => props.setCardName(e.target.value)}
              />
              <FormControl style={{ flexGrow: 1 }}>
                <InputLabel id="magic-color-label">Color</InputLabel>
                <Select
                  tabIndex={2}
                  native
                  labelId="magic-color-label"
                  id="magic-color-select"
                  label="Color"
                  value={props.cardColor}
                  onChange={(e) => props.setCardColor(e.target.value as CardColor)}
                >
                  <option value="land">Land</option>
                  <option value="artifact">Artifact</option>
                  <option value="white">White</option>
                  <option value="blue">Blue</option>
                  <option value="black">Black</option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                </Select>
              </FormControl>
              <FormControl style={{ flexGrow: 1 }}>
                <InputLabel id="magic-border-label">Border</InputLabel>
                <Select
                  tabIndex={3}
                  native
                  labelId="magic-border-label"
                  id="magic-border-select"
                  label="Border"
                  value={props.borderColor}
                  onChange={(e) => props.setBorderColor(e.target.value as BorderColor)}
                >
                  <option value="white">White</option>
                  <option value="black">Black</option>
                </Select>
              </FormControl>
            </Stack>
            <Stack gap={1} direction={"row"} flexWrap="wrap">
              <TextField
                tabIndex={4}
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: 9,
                  },
                }}
                style={{ minWidth: 80 }}
                size="small"
                label="Colorless"
                type="number"
                value={Number(props.manaCost.colorless).toString()}
                onChange={(e) => {
                  const num = Math.max(Math.min(Number(e.target.value) ?? 0, 9), 0);
                  props.setManaCost({ ...props.manaCost, colorless: num });
                }}
              />
              {["white", "blue", "black", "red", "green"].map((color, index) => (
                <TextField
                  tabIndex={5 + index}
                  key={color}
                  InputProps={{
                    inputProps: {
                      min: 0,
                      max: 5,
                    },
                  }}
                  size="small"
                  label={color}
                  type="number"
                  value={Number(props.manaCost[color as keyof typeof props.manaCost]).toString()}
                  onChange={(e) => {
                    const num = Math.max(Math.min(Number(e.target.value) ?? 0, 5), 0);
                    props.setManaCost({ ...props.manaCost, [color]: num });
                  }}
                />
              ))}
            </Stack>
            <ButtonBase
              tabIndex={10}
              onClick={() => {
                props.setIllustration("");
                fileInputRef.current?.click();
              }}
            >
              <TextField
                InputLabelProps={{ shrink: true }}
                error={props.illustration === ""}
                fullWidth
                required
                label="Illustration"
                placeholder="Upload an image"
                style={{
                  pointerEvents: "none",
                }}
                value={props.illustration}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const { files } = event.target;
                  if (files && files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const dataURL = e.target?.result;
                      if (typeof dataURL === "string") {
                        const image = new Image();
                        image.crossOrigin = "anonymous";
                        image.src = dataURL;
                        image.onload = () => setCropImage(image);
                      }
                    };
                    reader.readAsDataURL(files[0]);
                  } else {
                    props.setIllustration("");
                  }
                }}
              />
            </ButtonBase>
            <Stack spacing={2} direction={"row"}>
              <TextField
                tabIndex={10}
                style={{ flexGrow: 1 }}
                label="Type"
                placeholder="Creature"
                value={props.type}
                onChange={(e) => props.setType(e.target.value)}
              />
              <TextField
                style={{ flexGrow: 1 }}
                label="Subtype"
                placeholder="Dragon"
                value={props.subType}
                onChange={(e) => props.setSubType(e.target.value)}
              />
            </Stack>
            <TextField
              tabIndex={12}
              fullWidth
              inputRef={rulesInputRef}
              label="Rules"
              placeholder={"Flying, haste\n{t}: Add {m} to your mana pool"}
              multiline
              minRows={2}
              value={props.rules}
              onChange={(e) => props.setRules(e.target.value)}
              FormHelperTextProps={{
                classes: {
                  root: "flex flex-row flex-wrap gap-1",
                },
                component: "div",
              }}
              helperText={<RulesHelper addIcon={addToRules} />}
            />
            <TextField
              tabIndex={13}
              fullWidth
              label="Flavor Text"
              placeholder="Fus Ro Dah!"
              value={props.flavorText}
              onChange={(e) => props.setFlavorText(e.target.value)}
            />
            <Stack spacing={2} direction={"row"}>
              <TextField
                tabIndex={14}
                style={{ flexGrow: 1 }}
                label="Power"
                placeholder="2"
                value={props.power}
                onChange={(e) => props.setPower(e.target.value)}
              />
              <TextField
                tabIndex={15}
                style={{ flexGrow: 1 }}
                placeholder="2"
                label="Toughness"
                value={props.toughness}
                onChange={(e) => props.setToughness(e.target.value)}
              />
            </Stack>
          </Stack>
        )}
      </Box>
    );
  }
);

// Function to wrap text into lines in a canvas
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, font: string) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  const saveFont = ctx.font;
  ctx.font = font;

  if (text === "") {
    return [];
  }

  for (const word of words) {
    const line = currentLine + word + " ";
    const width = ctx.measureText(line).width;

    if (width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = word + " ";
    } else {
      currentLine = line;
    }
  }

  lines.push(currentLine); // Add the last line
  ctx.font = saveFont;
  return lines;
}

const MagicCard = forwardRef((props: MagicCardProps, ref: React.ForwardedRef<HTMLCanvasElement>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [borderImg, setBorderImg] = useState<HTMLImageElement | null>(null);
  const [frameImg, setFrameImg] = useState<HTMLImageElement | null>(null);
  const [ptBoxImg, setPtBoxImg] = useState<HTMLImageElement | null>(null);
  const [illustrationImg, setIllustrationImg] = useState<HTMLImageElement | null>(null);

  const [placeholderImages, setPlaceholderImages] = useState<Record<
    keyof typeof resources.icons,
    HTMLImageElement
  > | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  const mergedRef = mergeRefs<HTMLCanvasElement>([canvasRef, ref]);

  // load resources
  useEffect(() => {
    const illustration = new Image();
    illustration.crossOrigin = "anonymous";
    illustration.src = props.illustration;
    illustration.onload = () => setIllustrationImg(illustration);

    const border = new Image();
    border.crossOrigin = "anonymous";
    border.src = resources.borders[props.borderColor];
    border.onload = () => setBorderImg(border);

    const frame = new Image();
    frame.crossOrigin = "anonymous";
    frame.src = resources.frames[props.cardColor];
    frame.onload = () => setFrameImg(frame);

    const ptBox = new Image();
    ptBox.crossOrigin = "anonymous";
    ptBox.src = resources.ptBoxes[props.cardColor];
    ptBox.onload = () => setPtBoxImg(ptBox);

    document.fonts.load("bold 48px MagicCard").then(() => {
      setFontLoaded(true);
    });

    // load icons
    const images: Record<string, HTMLImageElement> = {};
    const imagePromises = Object.keys(resources.icons).map((iconPlaceholder) => {
      return new Promise<void>((resolve) => {
        const iconUrl = resources.icons[iconPlaceholder];
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = iconUrl;
        img.onload = () => {
          images[iconPlaceholder] = img;
          resolve();
        };
      });
    });
    Promise.all(imagePromises).then(() => {
      setPlaceholderImages(images);
    });
  }, [props.borderColor, props.cardColor, props.illustration]);

  const loading =
    placeholderImages == null ||
    illustrationImg == null ||
    borderImg == null ||
    frameImg == null ||
    ptBoxImg == null ||
    canvasRef.current == null ||
    !fontLoaded;

  // draw card
  useEffect(() => {
    if (loading) {
      return;
    }

    const ctx = canvasRef.current.getContext("2d");
    if (ctx == null) {
      return;
    }

    ctx.fillStyle = "black";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    ctx.drawImage(illustrationImg, 63, 122, ILLUSTRATION_WIDTH, ILLUSTRATION_HEIGHT);
    ctx.drawImage(borderImg, 0, 0);
    ctx.drawImage(frameImg, 40, 40);

    ctx.font = "bold 48px MagicCard";
    ctx.fillText(props.cardName, 68, 62, 610);

    ctx.font = "bold 40px MagicCard";
    const textWidth = ctx.measureText(props.type).width;
    ctx.fillText(props.type, 68, 592, 610);

    // draw mana cost
    const manaCostPlaceholders: Array<keyof typeof resources.icons> = [];
    if (props.manaCost.colorless > 0 && props.manaCost.colorless < 10) {
      manaCostPlaceholders.push(`{${props.manaCost.colorless}}`);
    }
    if (props.manaCost["white"] > 0) {
      manaCostPlaceholders.push(`{p}`.repeat(props.manaCost["white"]));
    }
    if (props.manaCost["blue"] > 0) {
      manaCostPlaceholders.push(`{i}`.repeat(props.manaCost["blue"]));
    }
    if (props.manaCost["black"] > 0) {
      manaCostPlaceholders.push(`{s}`.repeat(props.manaCost["black"]));
    }
    if (props.manaCost["red"] > 0) {
      manaCostPlaceholders.push(`{m}`.repeat(props.manaCost["red"]));
    }
    if (props.manaCost["green"] > 0) {
      manaCostPlaceholders.push(`{f}`.repeat(props.manaCost["green"]));
    }

    let x = 681;
    const manaImageSize = 30;
    placeholderRegex.lastIndex = 0;
    for (const [icon] of Array.from(manaCostPlaceholders.reverse().join("").matchAll(placeholderRegex))) {
      ctx.drawImage(placeholderImages[icon], x - manaImageSize, 70, manaImageSize, manaImageSize);
      x -= manaImageSize + 1.5;
    }

    ctx.font = "bold 40px MagicCard";

    // draw subtype
    if (props.subType !== "") {
      // line separating type and subtype
      const spacing = 8;
      const barWidth = 25;
      ctx.fillRect(68 + textWidth + spacing, 614, barWidth, 2);
      // draw subtype
      ctx.fillText(
        props.subType,
        68 + textWidth + spacing * 2 + barWidth,
        592,
        610 - textWidth - spacing * 2 - barWidth
      );
    }

    // draw power and toughness
    if (props.power !== "" && props.toughness !== "") {
      // draw the pt box
      ctx.drawImage(ptBoxImg, 538, 911);

      ctx.font = "bold 40px MagicCard";
      ctx.textAlign = "center";
      const ptText = `${props.power}/${props.toughness}`;
      ctx.fillText(ptText, 542 + ptBoxImg.width / 2, 930, ptBoxImg.width - 50);
      ctx.textAlign = "left";
    }

    // draw rules and flavor text
    // the rules are centered vertically in the box
    let lineHeight = 35;
    const startX = 68; // starting x
    const startY = 654; // starting y
    let y = startY;
    const maxWidth = 610;
    const maxHeight = 270;
    const maxY = y + maxHeight;
    const rulesLines = [];
    const flavorTextLines = wrapText(ctx, props.flavorText, maxWidth, "italic 30px MagicCard");
    const paragraphs = props.rules.split("\n");

    for (const paragraph of paragraphs) {
      rulesLines.push(...wrapText(ctx, paragraph, maxWidth, "normal 30px MagicCard"));
    }

    // get an estimate of the total height
    const totalLines = rulesLines.length + flavorTextLines.length + Math.sign(flavorTextLines.length);
    let totalHeight = totalLines * lineHeight;

    lineHeight =
      totalHeight < maxHeight
        ? lineHeight
        : Math.max(lineHeight + ((16 - lineHeight) * totalHeight) / (maxY - maxHeight), 22);
    totalHeight = totalLines * lineHeight;
    // center vertically -> set the new starting y
    y = Math.max(y, y + (maxY - totalHeight - y) / 2);
    // fill rules
    ctx.font = "normal 30px MagicCard";
    const spaceWidth = ctx.measureText(" ").width;
    for (let line of rulesLines) {
      let x = startX;
      const words = line.split(" ");
      for (const word of words) {
        placeholderRegex.lastIndex = 0;
        if (placeholderRegex.test(word)) {
          placeholderRegex.lastIndex = 0;
          const matches = Array.from(word.matchAll(placeholderRegex));

          let lastPartIndex = 0;
          for (const match of matches) {
            const icon = match[0];
            const index = match.index;

            if (index === undefined) {
              continue;
            }

            const part = word.slice(lastPartIndex, index);
            const partLength = ctx.measureText(part).width;
            ctx.fillText(part, x, y);
            x += partLength;
            lastPartIndex = index + 3; // {x} -> 3 characters

            ctx.drawImage(placeholderImages[icon], x, y + 2, 25, 25);
            x += 25; // icon width
          }

          if (lastPartIndex < word.length) {
            const part = word.slice(lastPartIndex);
            const partLength = ctx.measureText(part).width;
            ctx.fillText(part, x, y);
            x += partLength;
          }
          x += spaceWidth;
        } else {
          ctx.fillText(word, x, y);
          x += ctx.measureText(word).width + spaceWidth;
        }
      }

      y += lineHeight;
    }

    // add a line between the rules and flavor text
    y += lineHeight;

    // fill flavor text
    ctx.font = "italic 30px MagicCard";
    for (const line of flavorTextLines) {
      ctx.fillText(line, startX, y, maxWidth);
      y += lineHeight;
    }
  }, [
    borderImg,
    frameImg,
    illustrationImg,
    loading,
    props.rules,
    props.cardName,
    props.subType,
    props.type,
    ptBoxImg,
    props.flavorText,
    placeholderImages,
    props.power,
    props.toughness,
    props.manaCost,
  ]);

  return (
    <Stack justifyContent="center" alignItems="center" padding={2} style={{ width: "auto", height: "100vh" }}>
      <canvas
        ref={mergedRef}
        style={{ height: "100%", objectFit: "contain", width: "100%" }}
        width={744}
        height={1039}
      />
      <div
        style={{
          display: loading ? "block" : "none",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <CircularProgress size={48} />
      </div>
    </Stack>
  );
});

export const MagicCardComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [cardName, setCardName] = useState("");
  const [manaCost, setManaCost] = useState<MagicCardProps["manaCost"]>({
    colorless: 0,
    white: 0,
    blue: 0,
    black: 0,
    red: 0,
    green: 0,
  });
  const [cardColor, setCardColor] = useState<CardColor>(() => randomEl(cardColors));
  const [borderColor, setBorderColor] = useState<BorderColor>(() => randomEl(borderColors));
  const [illustration, setIllustration] = useState("");
  const [type, setType] = useState(""); // creature
  const [subType, setSubType] = useState(""); // human warrior
  const [power, setPower] = useState<MagicCardProps["power"]>("");
  const [toughness, setToughness] = useState<MagicCardProps["toughness"]>("");
  const [rules, setRules] = useState<string>("");
  const [flavorText, setFlavorText] = useState("");
  const [editing, setEditing] = useState(true);
  const [uploading, setUploading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const generateCardButtonDisabled = cardName === "" || illustration === "";

  const generateCard = useCallback(() => {
    setEditing(false);
  }, []);

  const handleUpload = async (uploadOptions: any, fileName?: string) => {
    console.log("Handle upload started!");
    try {
      await FirebaseStorage.uploadFile(uploadOptions, async (event, error) => {
        if (error) {
          console.error("Error during upload: ", error);
          setUploading(false);
          return;
        }
        console.log("no errors yet, waiting for event completion");
        if (event && event.completed) {
          console.log("event completed! starting fetch download url");
          const result = await FirebaseStorage.getDownloadUrl({ path: uploadOptions.path }).catch(hadError);
          if (result) {
            // Only delete the file after successful upload
            if (fileName) {
              await Filesystem.deleteFile({
                path: fileName,
                directory: Directory.Cache,
              }).catch((err) => console.error("Failed to delete file: ", err));
            }
  
            setUploading(false);
            console.log("download URL : ", result.downloadUrl)
            model.data["dataURL"] = result.downloadUrl;
            done(model);
          }
          else { 
            console.log("no result? ");
          }
        } else {
          console.log("never finished event?");
        }
      });
    } catch (err) {
      console.error("Error during upload process: ", err);
      setUploading(false);
    }
  };  

  const preview = useCallback(async () => {
    if (canvasRef.current == null) {
      return;
    }
    setUploading(true);
  
    const hadError = (err: unknown) => {
      console.error("Upload failed:", err);
      setUploading(false);
    };
  
    const rescaledCanvas = rescaleCanvas(canvasRef.current, 0.5); // Rescale width and height by 0.5
    const dataURL = rescaledCanvas.toDataURL("image/png");
    const blob = await (await fetch(dataURL)).blob();
    const name = nanoid();
    const path = `files/${name}`;
    let uri = path

    // Save the base64 string as a file in the temporary directory
    if (Capacitor.getPlatform() !== "web") {
      const savedFile = await Filesystem.writeFile({
        path: name,
        data: dataURL,
        directory: Directory.Cache,
      });
      uri = savedFile.uri;
    }

    await FirebaseStorage.uploadFile(
      {
        path,
        blob,
        uri: uri,
      },
      async (event, error) => {
        if (error) {
          hadError(error);
          return;
        }

        if (event && event.completed) {
          const result = await FirebaseStorage.getDownloadUrl({ path }).catch(hadError);
          if (result) {
            setUploading(false);
            model.data["dataURL"] = result.downloadUrl;
            done(model);
          }
        }
      }
    ).catch(hadError);
  }, [done, model]);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full">
      {editing ? (
        <MagicCardEditor
          ref={formRef}
          cardName={cardName}
          manaCost={manaCost}
          cardColor={cardColor}
          borderColor={borderColor}
          illustration={illustration}
          type={type}
          subType={subType}
          power={power}
          toughness={toughness}
          rules={rules}
          flavorText={flavorText}
          setCardName={setCardName}
          setManaCost={setManaCost}
          setCardColor={setCardColor}
          setBorderColor={setBorderColor}
          setIllustration={setIllustration}
          setType={setType}
          setSubType={setSubType}
          setPower={setPower}
          setToughness={setToughness}
          setRules={setRules}
          setFlavorText={setFlavorText}
        />
      ) : (
        <MagicCard
          ref={canvasRef}
          cardName={cardName}
          manaCost={manaCost}
          cardColor={cardColor}
          borderColor={borderColor}
          illustration={illustration}
          type={type}
          subType={subType}
          power={power}
          toughness={toughness}
          rules={rules}
          flavorText={flavorText}
        />
      )}
      <Box style={{ paddingBottom: `calc(env(safe-area-inset-bottom, 24px) + 24px)` }} sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', zIndex: 1301 }}>
        {editing ? (
          <Button
            disabled={generateCardButtonDisabled}
            variant="contained"
            startIcon={<WandIcon />}
            onClick={generateCard}
          >
            View
          </Button>
        ) : (
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
        <Button
          disabled={editing || uploading}
          variant="contained"
          endIcon={uploading ? <CircularProgress size={20} /> : <SendIcon />}
          onClick={preview}
        >
          Preview
        </Button>
        {/* </Stack> */}
      </Box>
    </div>
  );
};
function hadError(reason: any): PromiseLike<never> {
  throw new Error("Function not implemented.");
}

