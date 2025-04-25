import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PlayerStack from "../../components/Player";

export default function Profile() {
  const { region, nickname } = useParams();

  useEffect(() => {}, [region, nickname]);
  if (region && nickname) {
    return (
      <>
        <PlayerStack nickname={nickname} region={region} />
      </>
    );
  }
}
