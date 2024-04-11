import { GameResources } from "@/types/GameData";
import { APP_CONSTS } from "@/consts";
import { useEffect, useState } from "react";

const AREAS = APP_CONSTS.gameResourcesConfig.areas;
const ARMIES = APP_CONSTS.gameResourcesConfig.armies;
const AUDIO = APP_CONSTS.gameResourcesConfig.audio;

type Props = {
  resources: GameResources;
  setResources: React.Dispatch<React.SetStateAction<GameResources>>;
};

export const ResourcesLoader = ({
  resources,
  setResources,
}: Props): JSX.Element => {
  const [tempResources, setTempResources] = useState<GameResources>(resources);

  useEffect(() => {
    AUDIO?.forEach((i) => {
      const audio = new Audio(i.src);
      audio.oncanplaythrough = () => {
        setTempResources((d) => ({
          ...d,
          audio: { ...d.audio, [i.name]: audio },
        }));
      };
    });

    AREAS?.forEach((i) => {
      const img = new Image();
      img.src = i.src;
      img.onload = () => {
        setTempResources((d) => ({
          ...d,
          areas: { ...d.areas, [i.name]: img },
        }));
      };
    });

    ARMIES?.forEach((i) => {
      const img = new Image();
      img.src = i.src;
      img.onload = () => {
        setTempResources((d) => ({
          ...d,
          armies: { ...d.armies, [i.name]: img },
        }));
      };
    });
  }, []);

  useEffect(() => {
    if (
      Object.values(tempResources.areas).filter(Boolean).length ===
        AREAS.length &&
      Object.values(tempResources.armies).filter(Boolean).length ===
        ARMIES.length &&
      Object.values(tempResources.audio).filter(Boolean).length === AUDIO.length
    ) {
      setResources(tempResources);
    }
  }, [tempResources]);

  return <></>;
};
