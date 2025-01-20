import { useParams } from "../mini-react-router";
// import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  return <div>ProductDetail: {id}</div>;
}
