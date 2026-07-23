import { assetManager, Sprite, SpriteFrame } from 'cc';

const DEFAULT_SPRITE_FRAME_UUID = '57520716-48c8-4a19-8acf-41c9f8777fb0@f9941';

export function applyDefaultSpriteFrame(sprite: Sprite): void {
    if (sprite.spriteFrame) {
        return;
    }

    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    assetManager.loadAny({ uuid: DEFAULT_SPRITE_FRAME_UUID }, (error, asset) => {
        if (error || !asset) {
            throw new Error(`applyDefaultSpriteFrame: failed to load default sprite (${String(error)})`);
        }

        sprite.spriteFrame = asset as SpriteFrame;
    });
}
