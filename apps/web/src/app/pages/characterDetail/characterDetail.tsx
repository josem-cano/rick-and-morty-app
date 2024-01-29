import React, { useState } from "react";
import { useLoaderData, useNavigation, useParams } from "react-router-dom";
import { Character } from "@repo/domain";
import { getApi } from "../../utils/api.ts";
import { Heart } from "../../components/heart/heart.tsx";
import { BigSkeleton } from "../../components/skeleton/skeleton.tsx";
import styles from "./characterDetail.module.css";

function DisplayInfo({
  label,
  children,
}: {
  label: string;
  children: React.JSX.Element;
}) {
  return (
    <div className={styles.display}>
      <label>{label}</label>
      {children}
    </div>
  );
}

export function CharacterDetail() {
  const { id } = useParams();
  const api = getApi();
  const data = useLoaderData() as { character: Character };
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return <BigSkeleton />;
  }

  const [character, setCharacter] = useState<Character>(data.character);

  const likeCharacter = () => {
    api
      .patch<Character>(`/characters/${id}`, { fav: !character.favourite })
      .then((res) => {
        setCharacter({ ...res.data });
      });
  };

  return (
    <main className={styles.root}>
      <section className={styles.container}>
        <img
          alt={character.name}
          className={styles.image}
          src={character.image}
        />
        <div className={styles.body}>
          <h1 style={{ fontSize: 48, margin: 0 }}>{character.name}</h1>
          <div className={styles.infoRow}>
            <DisplayInfo label="Status">
              <span>
                <span
                  className={
                    character.status === "Alive"
                      ? styles.alive
                      : styles.deceased
                  }
                />
                {character.status}
              </span>
            </DisplayInfo>
            <DisplayInfo label="Species">
              <div>{character.species}</div>
            </DisplayInfo>
          </div>
          <div className={styles.infoRow}>
            <DisplayInfo label="Type">
              <div>{character.type ? character.type : "No subtype"}</div>
            </DisplayInfo>
            <DisplayInfo label="Gender">
              <div>{character.gender}</div>
            </DisplayInfo>
          </div>
          <div className={styles.infoRow}>
            <DisplayInfo label="Origin">
              <div>{character.origin.name}</div>
            </DisplayInfo>
            <DisplayInfo label="Location">
              <div>{character.location.name}</div>
            </DisplayInfo>
          </div>
          <div className={styles.infoRow}>
            <DisplayInfo label="Episodes">
              <div>{character.episode.length}</div>
            </DisplayInfo>
            <DisplayInfo label="Favourite">
              <Heart
                fill={character.favourite}
                onClick={likeCharacter}
                size={24}
              />
            </DisplayInfo>
          </div>
        </div>
      </section>
    </main>
  );
}
