import { Link } from "react-router-dom";

function Error() {
  return (
    <>
      <div>An error occured</div>
      <Link to={"/"}>Go to home</Link>
    </>
  );
}

export default Error;
