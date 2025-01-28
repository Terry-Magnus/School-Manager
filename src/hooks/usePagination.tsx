import { useState, useEffect } from "react";
import {
  DocumentData,
  QueryConstraint,
  collection,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { firestore } from "@/lib/firebaseConfig";

interface PaginationTypes {
  collectionName: string;
  itemsPerPage: number;
  orderByField: string;
  queryConstraints?: Array<QueryConstraint>;
}

interface PaginationReturnType<T> {
  list: Array<T>;
  currentPage: number;
  totalDocs: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  showNext: () => Promise<void>;
  showPrevious: () => Promise<void>;
}

const usePagination = <T = DocumentData,>({
  collectionName,
  itemsPerPage,
  orderByField,
  queryConstraints,
}: PaginationTypes): PaginationReturnType<T> => {
  const [list, setList] = useState<Array<T>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const [firstDoc, setFirstDoc] = useState<DocumentData | null>(null);
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  //   const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasMore = totalPages <= currentPage;

  const fetchTotalDocs = async () => {
    setError(null);
    try {
      const queryCollection = collection(firestore, collectionName);
      const snapshot = await getCountFromServer(queryCollection);
      setTotalDocs(snapshot.data().count);
      setTotalPages(Math.ceil(snapshot.data().count / itemsPerPage));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchPageData = async () => {
    setLoading(true);
    setError(null);

    if (!orderByField)
      throw new Error("orderByField is required for pagination.");

    try {
      const queryCollection = collection(firestore, collectionName);
      const q = query(
        queryCollection,
        ...(queryConstraints || []),
        orderBy(orderByField, "desc"),
        limit(itemsPerPage)
      );

      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];

      setList(items);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setFirstDoc(querySnapshot.docs[0]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showNext = async () => {
    if (!lastDoc) return;

    setLoading(true);
    setError(null);

    try {
      const queryCollection = collection(firestore, collectionName);
      const q = query(
        queryCollection,
        ...(queryConstraints || []),
        orderBy(orderByField, "desc"),
        startAfter(lastDoc),
        limit(itemsPerPage)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];

        setList(items);
        setCurrentPage((prev) => prev + 1);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setFirstDoc(querySnapshot.docs[0]);
      }
    } catch (err: any) {
      setError("Failed to fetch next page.");
    } finally {
      setLoading(false);
    }
  };

  const showPrevious = async () => {
    if (!firstDoc || currentPage === 1) return;

    setLoading(true);
    setError(null);

    try {
      const queryCollection = collection(firestore, collectionName);
      const q = query(
        queryCollection,
        ...(queryConstraints || []),
        orderBy(orderByField, "desc"),
        endBefore(firstDoc),
        limit(itemsPerPage)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];

        setList(items);
        setCurrentPage((prev) => prev - 1);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setFirstDoc(querySnapshot.docs[0]);
      }
    } catch (err: any) {
      setError("Failed to fetch previous page.");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!lastDoc || !hasMore) return;
    console.log(lastDoc);
    setLoading(true);
    try {
      const queryCollection = collection(firestore, collectionName);
      const q = query(
        queryCollection,
        ...(queryConstraints || []),
        orderBy(orderByField, "desc"),
        startAfter(lastDoc),
        limit(itemsPerPage)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const newItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];

        setList((prev) => [...prev, ...newItems]); // Append new items to the existing list
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        // setHasMore(newItems.length === itemsPerPage); // Update hasMore
      }
      //   else {
      //     setHasMore(false); // No more items to load
      //   }
    } catch (err: any) {
      setError("Failed to load more items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalDocs();
    fetchPageData();
  }, []);

  return {
    list,
    currentPage,
    totalDocs,
    totalPages,
    loading,
    error,
    hasMore,
    showNext,
    showPrevious,
    loadMore,
  };
};

export default usePagination;
