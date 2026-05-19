import { useSceneMachine } from "../stateMachine/useSceneMachine";
import { ShowDialog } from "../components/ShowDialog/ShowDialog";

export default function Game() {
    const { scene, goTo } = useSceneMachine(0);

    return <ShowDialog nextscene={scene} changeScene={goTo} />;
}