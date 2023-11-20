import { world } from "@minecraft/server"
import { ModalFormData } from "@minecraft/server-ui"

let radius = 5;
let breakBlocks = false;
let underWater = false;

world.afterEvents.itemUse.subscribe(iuEvent => {
    if (iuEvent.itemStack.typeId != `minecraft:stick` || iuEvent.source.typeId != `minecraft:player`) return;
    const preferenceForm = new ModalFormData()
    .title(`§2§lExplosion Mobs`)
    .slider(`[爆発範囲]`, 1, 10, 1, radius)
    .toggle(`[ブロックを破壊する]`, breakBlocks)
    .toggle(`[水中の爆発を許可する]`, underWater)
    preferenceForm.show(iuEvent.source).then(response => {
        radius = response.formValues[0];
        breakBlocks = response.formValues[1];
        underWater = response.formValues[2];
        iuEvent.source.runCommandAsync(`say ~~~~~~\n§4§lExplosion Mobs§r\n設定を変更しました\n爆発範囲: §4§l${radius}§r\nブロックを破壊する: §4§l${breakBlocks}§r\n水中の爆発を許可する: §4§l${underWater}§r\n~~~~~~`);
    });
});

world.afterEvents.entityHitEntity.subscribe(ehEvent => {
    if (ehEvent.hitEntity.typeId != `minecraft:player`) return;
    let playerPlace = ehEvent.hitEntity.location;
    let options = {
        allowUnderwater: underWater,
        breaksBlocks: breakBlocks
    };
    world.getDimension(`overworld`).createExplosion(playerPlace, radius, options);
});

world.afterEvents.projectileHitEntity.subscribe(phEvent => {
    let entityInfo = phEvent.getEntityHit();
    if (entityInfo.entity.typeId != `minecraft:player`) return;
    let playerPlace = entityInfo.entity.location;
    let options = {
        allowUnderwater: underWater,
        breaksBlocks: breakBlocks
    };
    world.getDimension(`overworld`).createExplosion(playerPlace, radius, options);
});