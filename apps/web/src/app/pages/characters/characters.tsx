import React, { useEffect, useState } from "react";
import { CharactersPage } from "@repo/domain";
import { Link, useSearchParams } from "react-router-dom";
import { getApi } from "../../utils/api.ts";
import { CharacterCard } from "../../components/characterCard/characterCard.tsx";
import { Paginate } from "../../components/Paginate/paginate.tsx";
import { SkeletonList } from "../../components/skeleton/skeleton.tsx";
import styles from "./characters.module.css";

export function Characters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [charactersPage, setCharactersPage] = useState<CharactersPage>();
  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: "1" });
    }
  }, [searchParams]);

  const page = searchParams.get("page");

  useEffect(() => {
    const api = getApi();
    setCharactersPage(undefined);
    api.get<CharactersPage>(`/characters?page=${page}`).then((res) => {
      setCharactersPage({ ...res.data });
    });
  }, [page, getApi]);
  return (
    <main className={styles.root}>
      {charactersPage ? (
        <div>
          <section className={styles.list}>
            {charactersPage?.characters.map((character) => (
              <div className={styles.listItem}>
                <Link to={`/characters/${character.id}`}>
                  <CharacterCard character={character} />
                </Link>
              </div>
            ))}
          </section>
          <Paginate
            handleClick={(selectedPage) => {
              setSearchParams({ page: String(selectedPage) });
            }}
            page={Number(page)}
            totalPages={charactersPage.totalPages}
          />
        </div>
      ) : (
        <SkeletonList />
      )}
    </main>
  );
}
