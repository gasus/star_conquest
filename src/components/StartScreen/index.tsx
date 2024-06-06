import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import { GameDifficulty, Player, PlayerSettings } from "@/types/GameStats";
import { APP_CONSTS } from "@/consts";
import { useState } from "react";

type Props = {
  runGame: () => void;
  isLoaded: boolean;
  playersSettings: PlayerSettings[];
  setPlayersSettings: React.Dispatch<React.SetStateAction<PlayerSettings[]>>;
  areasCount: number;
  setAreasCount: React.Dispatch<React.SetStateAction<number>>;
};

export const StartScreen = (props: Props): JSX.Element => {
  const {
    isLoaded,
    playersSettings,
    setPlayersSettings,
    areasCount,
    setAreasCount,
    runGame,
  } = props;
  const [tab, setTab] = useState(3);

  const title = (
    <>
      <Typography
        variant="h1"
        sx={{ textAlign: "center", mb: "20px", fontSize: "30px" }}
        gutterBottom
      >
        {APP_CONSTS.gameName}
      </Typography>
    </>
  );

  const difficultyConf = [
    { value: GameDifficulty.easy, label: "Легкая" },
    { value: GameDifficulty.medium, label: "Средняя" },
    { value: GameDifficulty.hard, label: "Сложная" },
    { value: GameDifficulty.insane, label: "Безумная" },
  ];

  const playerConf = [
    { value: Player.user, label: "Игрок" },
    { value: Player.computer, label: "Компьютер" },
    { value: Player.none, label: "Отсутствует" },
  ];

  const renderSelectPlayer = (conf: PlayerSettings) => {
    return (
      <Select
        sx={{ width: "150px" }}
        value={conf.player}
        onChange={(e) =>
          setPlayersSettings((v) =>
            v.map((i) => {
              const newPlayerValue = e.target.value as Player;
              const changeDefaultDifficult = {
                [Player.user]: undefined,
                [Player.computer]: GameDifficulty.easy,
                [Player.none]: undefined,
              };
              return i.color === conf.color
                ? {
                    ...i,
                    player: newPlayerValue,
                    difficulty: changeDefaultDifficult[newPlayerValue],
                  }
                : newPlayerValue === Player.user && i.player === Player.user
                ? {
                    ...i,
                    player: Player.none,
                    difficulty: changeDefaultDifficult[Player.none],
                  }
                : i;
            })
          )
        }
      >
        {playerConf.map((i) => (
          <MenuItem key={i.value} value={i.value}>
            {i.label}
          </MenuItem>
        ))}
      </Select>
    );
  };

  const renderSelectDifficulty = (conf: PlayerSettings) => {
    return conf.player === Player.computer ? (
      <Select
        sx={{ width: "150px" }}
        value={conf.difficulty}
        onChange={(e) => {
          setPlayersSettings((v) =>
            v.map((i) => {
              return i.color === conf.color
                ? { ...i, difficulty: e.target.value as GameDifficulty }
                : i;
            })
          );
        }}
      >
        {difficultyConf.map((i) => (
          <MenuItem key={i.value} value={i.value}>
            {i.label}
          </MenuItem>
        ))}
      </Select>
    ) : (
      <></>
    );
  };

  const configTable = (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Цвет</TableCell>
            <TableCell>Управление</TableCell>
            <TableCell>Сложность</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playersSettings?.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <img
                  src={
                    APP_CONSTS.gameResourcesConfig.armies.find(
                      (i) => i.name === row.color
                    )?.src
                  }
                  alt={row.color}
                />
              </TableCell>
              <TableCell>{renderSelectPlayer(row)}</TableCell>
              <TableCell>{renderSelectDifficulty(row)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const areasConf = [
    { value: 12 },
    { value: 16 },
    { value: 20 },
    { value: 24 },
  ];

  const selectAreas = (
    <FormControl>
      <RadioGroup
        row
        sx={{ display: "inline-block" }}
        value={areasCount}
        onChange={(_, v) => setAreasCount(Number(v))}
      >
        {areasConf.map((i) => (
          <FormControlLabel
            key={i.value}
            value={i.value}
            control={<Radio />}
            label={i.value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );

  const settingsBlock = (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Настройки сторон конфликта:
      </Typography>
      {configTable}
      <Typography
        sx={{ mt: "10px", mr: "20px", display: "inline-block" }}
        variant="subtitle1"
        gutterBottom
      >
        Количество планет:
      </Typography>
      {selectAreas}
    </>
  );

  const withoutMinPlayers =
    playersSettings.filter((i) => i.player !== Player.none).length < 2;

  const button = (
    <Box
      sx={{ mt: "30px", flex: 1, display: "flex", justifyContent: "center" }}
    >
      <Button
        variant="contained"
        onClick={runGame}
        disabled={!isLoaded || withoutMinPlayers}
      >
        Начать игру
      </Button>
    </Box>
  );

  const gameRules = [
    "Вы являетесь участником галактического сражения, условием победы является полное уничтожение оппонентов.",
    "- Подконтрольные игроку или боту планеты каждую секунду генерируют новых юнитов, но не более 50. Если на планете находится более 50 юнитов, то с каждой секундой их количество будет уменьшаться.",
    "- На старте игры каждому участнику конфликта подконтрольна одна планета, остальные планеты нейтральны, количество юнитов на нейтральных планетах не растёт.",
    "- Для захвата новой планеты направьте на неё армию с планеты подконтрольной вам. Если количество захватчиков превышает количество защитников планеты, то она будет захвачена.",
    "- Сразу же после захвата на планете начнинают генерироваться юниты в армию для нового владельца.",
    "- Чем больше планет под вашим контролем, тем быстрее пополняется ваша армия, что является ключевой механикой для победы.",
    "- Вы можете перенаправлять армии между своими планетами, для того чтобы собрать для сокрушительных ударов по противнику.",
    "Удачных завоеваний!",
  ];

  const gameSettings = [
    "- Перед стартом необходимо определить количество учаcтников, количество планет и выставить ботам сложность.",
    "- Можно не выбирать кем будет управлять игрок, боты могут играть между собой.",
    "- Планеты каждый раз размещаются случайным образом, фиксированы только стартовые позиции (2 оппонента - слева и справа по центру, 3 - треугольник, 4 - квадрат).",
    "- У ботов есть 4 сложности, чем выше сложность, тем быстрее боты совершают действия, тем больше действий они могут производить одновременно и тем коварнее они выбирают цели для атаки.",
    "- В игре есть фоновая музыка и звуки для действий (отправка армии, удачное сражение, неудачное сражение). Озвучиваются только действия игрока. Фоновую музыку и звуки можно отключить в правом меню во время игры.",
    '- Есть возможность ставить паузу - кнопка в правом верхнем углу во время игры, либо клавишей "пробел".',
    '- В случае победы определяется кол-во баллов (оценивается как долго длилась игра, сколько юнитов и планет было подконтрольно игроку на момент завершения игры). Результаты доступны на странице "Таблица лидеров".',
  ];

  const tabs = (
    <Tabs
      value={tab}
      centered
      sx={{ mb: "20px" }}
      onChange={(_: React.SyntheticEvent, newValue: number) => setTab(newValue)}
    >
      <Tab label="Правила" value={1} />
      <Tab label="Описание" value={2} />
      <Tab label="Игра" value={3} />
    </Tabs>
  );

  return (
    <Box
      sx={{
        width: "600px",
        height: "100%",
        ml: "auto",
        mr: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 1200,
          padding: "20px",
          borderRadius: "10px",
          zIndex: 2,
        }}
      >
        {title}
        {tabs}
        <div
          style={{
            display: tab === 1 ? "flex" : "none",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {gameRules.map((i, index) => (
            <div key={index}>{i}</div>
          ))}
        </div>
        <div
          style={{
            display: tab === 2 ? "flex" : "none",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {gameSettings.map((i, index) => (
            <div key={index}>{i}</div>
          ))}
        </div>
        <div hidden={tab !== 3}>
          {settingsBlock}
          {button}
        </div>
      </Paper>
    </Box>
  );
};
