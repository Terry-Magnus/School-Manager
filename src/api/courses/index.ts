import { firestore } from "@/lib/firebaseConfig";
import { Course, Faculty, Level } from "@/types";
import {
  collection,
  addDoc,
  doc,
  arrayUnion,
  getDocs,
  query,
  where,
  writeBatch,
  orderBy,
  startAfter,
  arrayRemove,
  serverTimestamp,
  getDoc,
  limit,
  //   QueryDocumentSnapshot,
  //   updateDoc,
  //   getDoc,
} from "firebase/firestore";

export const addCourse = async (
  courseData: Omit<Course, "id" | "students" | "createdAt" | "updatedAt">
) => {
  try {
    const coursesRef = collection(firestore, "courses");

    // Check if a course with the same code already exists
    const querySnapshot = await getDocs(
      query(coursesRef, where("code", "==", courseData.code))
    );
    if (!querySnapshot.empty) {
      throw new Error(
        `A course with the code "${courseData.code}" already exists.`
      );
    }

    // Create the course document
    const courseDoc = {
      ...courseData,
      students: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(coursesRef, courseDoc);
    return { id: docRef.id, ...courseDoc };
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};

export const registerStudentForCourse = async (
  courseId: string,
  studentId: string
) => {
  try {
    const courseRef = doc(firestore, "courses", courseId);
    const userRef = doc(firestore, "users", studentId);

    // Get the current course document to check if student is already registered
    const courseDoc = await getDoc(courseRef);

    if (!courseDoc.exists()) {
      throw new Error("Course not found!");
    }

    const courseData = courseDoc.data();
    if (courseData?.students.includes(studentId)) {
      throw new Error(`Student is already registered for ${courseData.title}`);
    }

    // Run as a batch to ensure both updates succeed or fail together
    const batch = writeBatch(firestore);

    // Update course document with the student and updatedAt timestamp
    batch.update(courseRef, {
      students: arrayUnion(studentId),
      updatedAt: serverTimestamp(), // Set the updatedAt timestamp
    });

    // Update user document with the course
    batch.update(userRef, {
      courses: arrayUnion(courseId),
    });

    await batch.commit();
  } catch (error) {
    console.error("Error registering student:", error);
    throw error;
  }
};

export const unregisterStudentFromCourse = async (
  courseId: string,
  studentId: string
) => {
  try {
    const courseRef = doc(firestore, "courses", courseId);
    const userRef = doc(firestore, "users", studentId);

    const batch = writeBatch(firestore);

    batch.update(courseRef, {
      students: arrayRemove(studentId),
      updatedAt: serverTimestamp(),
    });

    batch.update(userRef, {
      courses: arrayRemove(courseId),
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error unregistering student:", error);
    throw error;
  }
};

export const fetchAllCourses = async (
  pageSize: number = 10,
  cursorDoc: any = null
) => {
  try {
    const coursesRef = collection(firestore, "courses");
    let coursesQuery = query(coursesRef);

    // Base query with ordering and limit
    if (cursorDoc) {
      coursesQuery = query(
        coursesRef,
        orderBy("title"),
        startAfter(cursorDoc),
        limit(pageSize)
      );
    } else {
      coursesQuery = query(coursesRef, orderBy("title"), limit(pageSize));
    }

    // Execute query
    const querySnapshot = await getDocs(coursesQuery);

    // Get documents
    const courses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Course[];

    return { courses };
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const fetchCourses = async (
  faculty: Faculty,
  level: Level,
  semester: "harmattan" | "rain"
): Promise<Course[]> => {
  try {
    const coursesCollection = collection(firestore, "courses");

    // Query courses where the student is in the "students" array
    const q = query(
      coursesCollection,
      where("faculty", "==", faculty),
      where("level", "==", Number(level)),
      where("semester", "==", semester)
    );

    const querySnapshot = await getDocs(q);

    // Map the documents to Course objects
    const courses: Course[] = querySnapshot.docs.map((doc) => ({
      ...(doc.data() as Course),
      id: doc.id,
    }));

    return courses;
  } catch (error) {
    console.error("Error fetching student courses:", error);
    throw new Error("Unable to fetch courses.");
  }
};

export const fetchStudentCourses = async (
  studentId: string // fetch courses based on student id
): Promise<Course[]> => {
  try {
    const coursesCollection = collection(firestore, "courses");

    // Query courses where the student is in the "students" array
    const q = query(
      coursesCollection,
      where("students", "array-contains", studentId)
    );

    const querySnapshot = await getDocs(q);

    // Map the documents to Course objects
    const courses: Course[] = querySnapshot.docs.map((doc) => ({
      ...(doc.data() as Course),
      id: doc.id,
    }));

    return courses;
  } catch (error) {
    console.error("Error fetching student courses:", error);
    throw new Error("Unable to fetch registered courses for the student.");
  }
};
