import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { getTime } from "@/utils/others";
import { APP_CONSTS } from "@/consts";
import { GameSettings } from "@/types/GameStats";

type Props = {
  seconds: number;
  breakGame: () => void;
  setPause: () => void;
  isPause: boolean;
  gameSettings: GameSettings;
  setGameSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
};

export const GameMenu = React?.memo((props: Props): JSX.Element => {
  const {
    seconds,
    isPause,
    breakGame,
    setPause,
    gameSettings,
    setGameSettings,
  } = props;
  const { backgroundMusicVolume, soundVolume } = gameSettings;
  const hasVolume = backgroundMusicVolume && soundVolume;

  useEffect(() => {
    const keydownHandler = (key: KeyboardEvent) => {
      if (APP_CONSTS.keyboardCode.space === key.code) setPause();
    };

    window.addEventListener("keydown", keydownHandler);
    return () => window.removeEventListener("keydown", keydownHandler);
  }, []);

  const pauseWrapper = (
    <Box
      sx={{
        position: "absolute",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        background: "#00000082",
        color: "white",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography sx={{ textAlign: "center" }} variant="h1" component="div">
        Пауза
      </Typography>
      <Typography sx={{ textAlign: "center" }} variant="h6" component="div">
        Для продолжения игры нажмите кнопку в меню
      </Typography>
    </Box>
  );

  const changeVolume = () => {
    setGameSettings({
      backgroundMusicVolume: hasVolume ? 0 : 0.15,
      soundVolume: hasVolume ? 0 : 0.3,
    });
  };

  const btnStyle = {
    ml: "10px",
    lineHeight: "unset",
    padding: 0,
    minWidth: "40px",
  };

  const gameMenu = (
    <Box
      sx={{
        position: "absolute",
        top: "20px",
        right: "20px",
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Box sx={{ fontSize: "24px", color: "white", lineHeight: "24px" }}>
        {getTime(seconds)}
      </Box>
      <Button sx={btnStyle} variant="contained" onClick={changeVolume}>
        {hasVolume ? "🔇" : "🔊"}
      </Button>
      <Button sx={btnStyle} variant="contained" onClick={setPause}>
        {isPause ? "▶" : "||"}
      </Button>
      <Button sx={btnStyle} variant="contained" onClick={breakGame}>
        X
      </Button>
    </Box>
  );

  return (
    <>
      {isPause ? pauseWrapper : <></>}
      {gameMenu}
    </>
  );
});
