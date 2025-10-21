import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

export interface Product {
  id?: string;
  producto: string;
  categoria: string;
  descripcion: string;
  peso: number;
  unidad_peso: string;
  dimensiones: {
    largo: number;
    ancho: number;
    alto: number;
    unidad: string;
  };
  tamaño: string;
  sku: string;
  stock: number;
  ubicacion: string;
  fecha_registro: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = "products";

export const productService = {
  // Obtener todos los productos
  async getAll(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  },

  // Obtener un producto por ID
  async getById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener producto:", error);
      throw error;
    }
  },

  // Verificar si un SKU ya existe (excluyendo un ID específico para edición)
  async checkSkuExists(
    sku: string,
    excludeId?: string
  ): Promise<{ exists: boolean; product?: Product }> {
    try {
      const q = query(collection(db, COLLECTION_NAME), where("sku", "==", sku));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { exists: false };
      }

      // Si hay un ID a excluir (para edición), verificar que no sea el mismo producto
      if (excludeId) {
        const otherProduct = querySnapshot.docs.find(
          (doc) => doc.id !== excludeId
        );
        if (otherProduct) {
          return {
            exists: true,
            product: { id: otherProduct.id, ...otherProduct.data() } as Product,
          };
        }
        return { exists: false };
      }

      // Para creación, si existe cualquier producto con ese SKU, es duplicado
      const existingProduct = querySnapshot.docs[0];
      return {
        exists: true,
        product: {
          id: existingProduct.id,
          ...existingProduct.data(),
        } as Product,
      };
    } catch (error) {
      console.error("Error al verificar SKU:", error);
      throw error;
    }
  },

  // Crear un nuevo producto
  async create(product: Omit<Product, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  },

  // Actualizar un producto
  async update(id: string, product: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...product,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  },

  // Actualizar solo el stock
  async updateStock(id: string, newStock: number): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        stock: newStock,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      throw error;
    }
  },

  // Eliminar un producto
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  },
};
