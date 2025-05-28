import {
  EventsSDK,
  Menu,
  EntityManager,
  LocalPlayer,
  Unit,
  Vector3,
  pudge_meat_hook
} from "github.com/octarine-public/wrapper/index"

console.log("Hello World!")

EventsSDK.on("GameStarted", () => {
  console.log("GameStarted")
})

class CustomMenu {
  private tree: Menu.Node
  public toggleEnabled: Menu.Toggle
  public keybindHook: Menu.KeyBind
  public keybindLogAbilities: Menu.KeyBind

  constructor() {
    this.tree = Menu.AddEntry("MyCustomMenu")

    this.toggleEnabled = this.tree.AddToggle("Включить скрипт", true)
    this.toggleEnabled.OnValue(t => {
      console.log("Скрипт включён:", t.value)
    })

    this.keybindHook = this.tree.AddKeybind("Клавиша хука")
    this.keybindHook.OnPressed(() => this.onHookPressed())

    this.keybindLogAbilities = this.tree.AddKeybind("Лог способностей героя")
    this.keybindLogAbilities.OnPressed(() => this.onLogAbilities())
  }

  private onHookPressed() {
    console.log("Bind is pressed")
    if (!this.toggleEnabled.value) {
      console.log("Скрипт отключён, ничего не делаем")
      return
    }

    const hooks = EntityManager.GetEntitiesByClass(pudge_meat_hook)
    for (const hook of hooks) {
      const owner = hook.Owner
      if (!owner || !owner.IsControllable || !owner.IsAlive || !hook.CanBeCasted()) {
        continue
      }
      const me = owner as Unit
      const range = hook.CastRange

      const enemies = EntityManager.AllEntities.filter(ent =>
        ent instanceof Unit &&
        ent.IsAlive &&
        ent.IsEnemy(me) &&
        me.Distance(ent) <= range
      )
      if (enemies.length === 0) continue

      const target = me.Closest(enemies)

      const speed = target.Speed
      const forward = target.Forward
      if (speed > target.MoveSpeed) continue

      const travelTime = me.Distance(target) / hook.Speed
      const predictedPos = new Vector3(
        target.Position.x + forward.x * speed * travelTime,
        target.Position.y + forward.y * speed * travelTime,
        target.Position.z + forward.z * speed * travelTime
      )

      let blocked = false
      const steps = 10
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        const sample = new Vector3(
          me.Position.x + (predictedPos.x - me.Position.x) * t,
          me.Position.y + (predictedPos.y - me.Position.y) * t,
          me.Position.z + (predictedPos.z - me.Position.z) * t
        )
        const obstacle = EntityManager.AllEntities.find(ent =>
          ent instanceof Unit &&
          ent.IsAlive &&
          ent !== me &&
          ent !== target &&
          ent.Position.Distance(sample) < 50
        )
        if (obstacle) {
          console.log("Траектория заблокирована:", obstacle.Name)
          blocked = true
          break
        }
      }
      if (blocked) continue

      me.CastPosition(hook, predictedPos)
      console.log("Meat Hook cast to", target.Name)
      return
    }
  }

  private onLogAbilities() {
    const rawMe = LocalPlayer
    if (!rawMe) {
      console.error("LocalPlayer не определён")
      return
    }
    if (!(rawMe instanceof Unit)) {
      console.error("LocalPlayer не является Unit")
      return
    }
    const me = rawMe as Unit

    const spells = me.Spells
    if (!spells || spells.length === 0) {
      console.log("Способности не найдены или список пуст")
      return
    }

    console.log("=== Способности героя: ===")
    spells.forEach((abil, idx) => {
      console.log(`${idx + 1}: ${abil.Name} (Cooldown: ${abil.CooldownDuration.toFixed(1)})`)
    })
  }
}

new CustomMenu()
