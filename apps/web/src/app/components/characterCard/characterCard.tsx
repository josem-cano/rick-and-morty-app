import { Character } from "@repo/domain";
import React, { useEffect, useState } from "react";
import { getApi } from "../../utils/api.ts";
import { Heart } from "../heart/heart.tsx";
import styles from "./characterCard.module.css";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const [char, setChar] = useState(character);
  const api = getApi();
  const likeCharacter = (e: React.MouseEvent<SVGElement>) => {
    e.preventDefault();
    api
      .patch<Character>(`/characters/${character.id}`, {
        fav: !char.favourite,
      })
      .then((res) => {
        setChar({ ...res.data });
      });
  };

  useEffect(() => {
    setChar({ ...char });
  }, [character]);
  return (
    <div className={styles.root}>
      <img alt={character.name} src={character.image} />
      <div className={styles.content}>
        <div className={styles.header}>
          <h3>{character.name}</h3>
          <Heart fill={char.favourite} onClick={likeCharacter} size={24} />
        </div>
      </div>
    </div>
  );
}
