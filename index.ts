import {
  EventsSDK,
  Menu,
  EntityManager,
  LocalPlayer,
  Unit,
  Player
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

    const rawMe = LocalPlayer
    if (!rawMe) {
      console.error("LocalPlayer не определён")
      return
    }
    if (!(rawMe instanceof Player)) {
      console.error("LocalPlayer не является Player")
      return
    }
    const me = rawMe as Player

    const hookAbility = me.GetAbilityByName("pudge_meat_hook")
    if (!hookAbility) {
      console.error("Ability pudge_meat_hook не найдена у героя")
      return
    }

    const radius = hookAbility.CastRange
    console.log("Ability.CastRange:", radius)
    if (radius <= 0) {
      console.warn("CastRange = 0, способность ещё не синхронизировалась")
      return
    }

    const enemiesInRange = EntityManager.AllEntities.filter(ent =>
      ent instanceof Unit &&
      ent.IsAlive &&
      ent.IsEnemy(me) &&
      me.Distance(ent) <= radius
    )
    console.log("Enemies in range:", enemiesInRange.map(e => e.Name))
    if (enemiesInRange.length === 0) {
      console.log("Нет целей в радиусе", radius)
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
      target,            // Entity convert in coords
      false,             // checkAutoCast
      false,             // checkToggled
      false,             // queue
      true               // showEffects
    )

    if (used) {
      console.log("Meat Hook выпущен по", target.Name)
    } else {
      console.error(
        "Не удалось использовать Meat Hook. CooldownDuration:",
        hookAbility.CooldownDuration
      )
    }
  }
}

new CustomMenu()
