import {
  EventsSDK,
  Menu,
  EntityManager,
  LocalPlayer,
  Unit
} from "github.com/octarine-public/wrapper/index"

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
    const me = LocalPlayer
    if (!me) {
      console.log("LocalPlayer is not defined")
      return
    }

    const hookAbility = me.Abilities?.find(
      a => a.Name === "pudge_meat_hook"
    )
    if (!hookAbility) {
      console.error("Ability pudge_meat_hook not found on hero")
      return
    }

    console.log("Ability.CastRange:", hookAbility.CastRange)
    if (hookAbility.CastRange === 0) {
      console.warn("CastRange = 0, возможно способность ещё не синхронизировалась")
      return
    }

    const radius = hookAbility.CastRange

    const enemiesInRange = EntityManager.AllEntities.filter(ent =>
      ent instanceof Unit &&
      ent.IsAlive &&
      ent.IsEnemy(me) &&
      me.Distance(ent) <= radius
    )
    console.log("Enemies in range:", enemiesInRange.map(e => e.Name))
    if (enemiesInRange.length === 0) {
      console.log("No valid targets within radius", radius)
      return
    }

    const target = me.Closest(enemiesInRange)
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

    const used = hookAbility.UseAbility(
      target,
      /*checkAutoCast*/ false,
      /*checkToggled*/ false,
      /*queue*/ false,
      /*showEffects*/ true
    )

    if (used) {
      console.log("Meat Hook fired at", target.Name)
    } else {
      console.error(
        "Failed to use Meat Hook. CooldownDuration:",
        hookAbility.CooldownDuration
      )
    }
  }
}

new CustomMenu()
