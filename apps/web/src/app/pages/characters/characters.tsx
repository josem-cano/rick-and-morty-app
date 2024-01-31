import React, { useEffect, useState } from "react";
import { CharactersPage } from "@repo/domain";
import { Link, useSearchParams } from "react-router-dom";
import { getApi } from "../../utils/api.ts";
import { CharacterCard } from "../../components/characterCard/characterCard.tsx";
import { Paginate } from "../../components/Paginate/paginate.tsx";
import { SkeletonList } from "../../components/skeleton/skeleton.tsx";
import { Input } from "../../components/input/input.tsx";
import { useDebounce } from "../../hooks/use-debounce.ts";
import styles from "./characters.module.css";

export function Characters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [charactersPage, setCharactersPage] = useState<CharactersPage>();
  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams((prev) => {
        // Add the new query param value to the queryString
        prev.set("page", "1");
        return prev;
      });
    }
  }, [searchParams]);

  const name = searchParams.get("name");
  const page = searchParams.get("page");

  const [search, setSearch] = useState<string>(name!);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (debouncedSearch) {
      setSearchParams((prev) => {
        // Add the new query param value to the queryString
        prev.set("name", debouncedSearch);
        return prev;
      });
    } else {
      setSearchParams((prev) => {
        // Add the new query param value to the queryString
        prev.delete("name");
        return prev;
      });
    }
  }, [debouncedSearch, setSearchParams]);

  useEffect(() => {
    const api = getApi();
    setCharactersPage(undefined);
    let url = `/characters?page=${page}`;
    if (debouncedSearch) {
      url = `${url}&name=${debouncedSearch}`;
    }
    api.get<CharactersPage>(url).then((res) => {
      setCharactersPage({ ...res.data });
    });
  }, [page, name, getApi]);
  return (
    <main className={styles.root}>
      <div className={styles.filters}>
        <Input
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Serach by name..."
          value={search}
        />
      </div>
      {charactersPage ? (
        <div>
          <section className={styles.list}>
            {charactersPage.characters.map((character) => (
              <div
                className={styles.listItem}
                key={`character-${character.id}`}
              >
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
