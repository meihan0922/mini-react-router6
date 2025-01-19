import { useParams } from "../mini-react-router";

export default function ProductDetail() {
  const { id } = useParams();
  return <div>ProductDetail: {id}</div>;
}
