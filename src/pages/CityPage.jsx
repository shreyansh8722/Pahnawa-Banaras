import { collection, query, where, getDocs } from "firebase/firestore";

useEffect(() => {
  const fetchSpots = async () => {
    console.log("Fetching spots for city:", cityId);

    const q = query(collection(db, "spots"), where("cityId", "==", cityId));
    const querySnapshot = await getDocs(q);

    console.log("QuerySnapshot size:", querySnapshot.size);

    const spotList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched spots data:", spotList);

    setSpots(spotList);
  };

  if (cityId) {
    fetchSpots();
  }
}, [cityId]);
