import {
  EventsSDK,
  Menu,
  EntityManager,
  LocalPlayer,
  Unit,
  pudge_meat_hook,
  Vector3,
} from "github.com/octarine-public/wrapper/index"
import { Events } from "octarine-wrapper"

console.log("Hello World!")

EventsSDK.on("GameStarted", () => {
  console.log("GameStarted")
})

class CustomMenu {
  private tree: Menu.Node
  public toggleExample: Menu.Toggle
  public keybindExample: Menu.KeyBind

  constructor() {
    this.tree = Menu.AddEntry("MyCustomMenu")

    this.toggleExample = this.tree.AddToggle("Включить скрипт", true)
    this.toggleExample.OnValue(t => {
      console.log("Переключатель включен:", t.value)
    })

    this.keybindExample = this.tree.AddKeybind("Клавиша активации")
    this.keybindExample.OnPressed(() => this.pressedButton())
  }

  private pressedButton() {
    console.log("Bind is pressed")

    const hooks = EntityManager.GetEntitiesByClass(pudge_meat_hook)
    if (hooks.length === 0) {
      console.error("No pudge_meat_hook instances found")
      return
    }

    for (const hook of hooks) {
      const owner = hook.Owner
      if (!owner || !owner.IsControllable) {
        continue
      }
      if (!hook.CanBeCasted()) {
        console.warn("Meat Hook not ready. CooldownDuration:", hook.CooldownDuration)
        continue
      }

      const radius = hook.CastRange
      console.log("Hook CastRange:", radius)

      const me = owner as Unit
      const enemies = EntityManager.AllEntities.filter(ent =>
        ent instanceof Unit &&
        ent.IsAlive &&
        ent.IsEnemy(me) &&
        me.Distance(ent) <= radius
      )
      console.log("Enemies in range:", enemies.map(e => e.Name))
      if (enemies.length === 0) {
        console.log("No targets within radius", radius)
        continue
      }

      const target = me.Closest(enemies)
      console.log(
        "Selected target:",
        target.Name,
        "Distance:",
        me.Distance(target),
        "Position:",
        target.Position.x,
        target.Position.y,
        target.Position.z
      )

      me.CastPosition(hook, target.Position)
      console.log("Meat Hook cast at", target.Name)

      return
    }
  }
}

new CustomMenu()
