import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";


export const addDocument = async <T extends Record<string, any>>(
  collectionPath: string,
  data: T,
  docId?: string
): Promise<string> => {
  if (docId) {
    await setDoc(doc(db, collectionPath, docId), data);
    return docId;
  }
  const ref = await addDoc(collection(db, collectionPath), data);
  return ref.id;
};

// Update an existing document. By default merges fields (non-destructive)
export const updateDocument = async <T extends Record<string, any>>(
  collectionPath: string,
  docId: string,
  data: Partial<T>,
  merge: boolean = true
): Promise<void> => {
  const ref = doc(db, collectionPath, docId);
  if (merge) {
    await setDoc(ref, data, { merge: true });
  } else {
    await updateDoc(ref, data as any);
  }
};

// Get a single document by id
export const getDocument = async <T = Record<string, any>>(
  collectionPath: string,
  docId: string
): Promise<(T & { id: string }) | null> => {
  const ref = doc(db, collectionPath, docId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as T) } as T & { id: string };
};

// Get multiple documents with optional where/order/limit
type WhereClause = [field: string, op: any, value: any];
export const getDocuments = async <T = Record<string, any>>(
  collectionPath: string,
  options?: {
    where?: WhereClause[];
    orderBy?: [field: string, direction: "asc" | "desc"];
    limit?: number;
  }
): Promise<Array<T & { id: string }>> => {
  const base = collection(db, collectionPath);
  let q: any = base;

  const constraints: any[] = [];
  if (options?.where) {
    for (const [field, op, value] of options.where) {
      constraints.push(where(field, op, value));
    }
  }
  if (options?.orderBy) {
    const [field, direction] = options.orderBy;
    constraints.push(orderBy(field, direction));
  }
  if (typeof options?.limit === "number") {
    constraints.push(limit(options.limit));
  }

  if (constraints.length > 0) {
    q = query(base, ...constraints);
  }

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
};

// Optional helper to delete a document
export const deleteDocument = async (
  collectionPath: string,
  docId: string
): Promise<void> => {
  await deleteDoc(doc(db, collectionPath, docId));
};
