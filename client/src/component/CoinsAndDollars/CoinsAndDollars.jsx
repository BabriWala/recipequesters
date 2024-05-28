import { useSelector } from "react-redux";

const CoinsAndDollars = () => {
  const user = useSelector((state) => state?.user);
  if (!user) {
    return; // Or any other appropriate fallback UI
  }
  // Destructure user information
  const { displayName, photoURL, email, coins, dollar } = user?.user;
  return (
    <div>
      display Name: {displayName}, photoUrl: {photoURL}, email: {email}, coins:{" "}
      {coins}, dollar: {dollar}
    </div>
  );
};

export default CoinsAndDollars;
