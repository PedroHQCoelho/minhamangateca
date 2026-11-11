import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { initialMangas } from "../data/initialMangas";
import { deleteCover } from "../utils/imageStorage";

const MangaContext = createContext(null);

export function MangaProvider({ children }) {

  // Minha Coleção
  const [mangas, setMangas] = useState(() => {
    try {
      const savedMangas = localStorage.getItem("mangateca-mangas");

      return savedMangas
        ? JSON.parse(savedMangas).map((manga) => ({
            ...manga,
            publicationStatus:
              manga.publicationStatus ?? "ongoing",
          }))
        : initialMangas;
    } catch {
      return initialMangas;
    }
  });

  // Lista de Desejos
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem(
        "mangateca-wishlist"
      );

      return savedWishlist
        ? JSON.parse(savedWishlist)
        : [];
    } catch {
      return [];
    }
  });

  // Persistência da coleção
  useEffect(() => {
    localStorage.setItem(
      "mangateca-mangas",
      JSON.stringify(mangas)
    );
  }, [mangas]);

  // Persistência dos desejos
  useEffect(() => {
    localStorage.setItem(
      "mangateca-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  // Cadastrar mangá
  function addManga(mangaData) {
  const newManga = {
    ...mangaData,
    id: mangaData.id || crypto.randomUUID(),
    ownedVolumes: mangaData.ownedVolumes || [],
  };

  setMangas((currentMangas) => [
    ...currentMangas,
    newManga,
  ]);

  return newManga.id;
}

  // Editar mangá
  function updateManga(id, updatedData) {
    setMangas((currentMangas) =>
      currentMangas.map((manga) =>
        manga.id === id
          ? { ...manga, ...updatedData }
          : manga
      )
    );
  }

  // Excluir mangá
  function deleteManga(id) {
  setMangas((currentMangas) =>
    currentMangas.filter((manga) => manga.id !== id)
  );

  deleteCover(id).catch((error) => {
    console.error("Erro ao excluir a capa:", error);
  });
}

  // Adicionar desejo
  function addWishlistItem(itemData) {
    const newItem = {
      id: crypto.randomUUID(),
      ...itemData,
    };

    setWishlist((currentWishlist) => [
      ...currentWishlist,
      newItem,
    ]);
  }

  // Editar desejo
  function updateWishlistItem(id, updatedData) {
    setWishlist((currentWishlist) =>
      currentWishlist.map((item) =>
        item.id === id
          ? { ...item, ...updatedData }
          : item
      )
    );
  }

  // Excluir desejo
  function deleteWishlistItem(id) {
    setWishlist((currentWishlist) =>
      currentWishlist.filter((item) => item.id !== id)
    );
  }

  // Transferir desejo para Minha Coleção
  function moveWishlistToCollection(id, mangaData) {
    addManga(mangaData);
    deleteWishlistItem(id);
  }

  // Restaurar backup
  function restoreBackup(backup) {
    if (
      !backup ||
      backup.version !== 1 ||
      !Array.isArray(backup.mangas) ||
      !Array.isArray(backup.wishlist)
    ) {
      throw new Error("Arquivo de backup inválido.");
    }

    setMangas(
      backup.mangas.map((manga) => ({
        ...manga,
        publicationStatus: manga.publicationStatus ?? "ongoing",
      }))
    );

    setWishlist(backup.wishlist);
  }

  return (
    <MangaContext.Provider
      value={{
        mangas,
        wishlist,

        addManga,
        updateManga,
        deleteManga,

        addWishlistItem,
        updateWishlistItem,
        deleteWishlistItem,
        moveWishlistToCollection,
        restoreBackup,
      }}
    >
      {children}
    </MangaContext.Provider>
  );
}

export function useMangas() {
  const context = useContext(MangaContext);

  if (!context) {
    throw new Error(
      "useMangas deve ser utilizado dentro de MangaProvider"
    );
  }

  return context;
}
