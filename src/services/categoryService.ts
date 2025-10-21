import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

export interface Category {
  id?: string;
  nombre: string;
  createdAt?: Date;
}

const COLLECTION_NAME = "categories";

export const categoryService = {
  // Obtener todas las categorías
  async getAll(): Promise<Category[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("nombre", "asc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      throw error;
    }
  },

  // Crear una nueva categoría
  async create(nombre: string): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        nombre,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error al crear categoría:", error);
      throw error;
    }
  },

  // Eliminar una categoría
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      throw error;
    }
  },
};




