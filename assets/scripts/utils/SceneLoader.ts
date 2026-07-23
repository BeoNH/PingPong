import { director } from 'cc';
import type { SceneName } from '../SceneNames';

export function loadScene(sceneName: SceneName): void {
    director.loadScene(sceneName, (error) => {
        if (error) {
            throw new Error(`SceneLoader.loadScene(${sceneName}): ${String(error)}`);
        }
    });
}
