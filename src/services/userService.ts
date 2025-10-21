import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  lastName: string;
  role: "admin" | "assistant";
  createdAt: Date;
}

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener perfil de usuario:", error);
    return null;
  }
};

export const createUserProfile = async (
  uid: string,
  email: string,
  name: string,
  lastName: string,
  role: "admin" | "assistant" = "assistant"
): Promise<void> => {
  try {
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      name,
      lastName,
      role,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error al crear perfil de usuario:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<Omit<UserProfile, "uid" | "email" | "createdAt">>
): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await setDoc(userRef, { ...userDoc.data(), ...data }, { merge: true });
    }
  } catch (error) {
    console.error("Error al actualizar perfil de usuario:", error);
    throw error;
  }
};
