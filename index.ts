import {
  EventsSDK,
  Menu,
  Ability,
  EntityManager,
  LocalPlayer,
  Unit
} from "github.com/octarine-public/wrapper/index"

console.log("Hello World!")

EventsSDK.on("GameStarted", () => {
  console.log("GameStarted")
})

const ability = new Ability(0, 0, "pudge_meat_hook")

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

    console.log("Ability.BaseCastRange:", ability.BaseCastRange)
    console.log("Ability.CastRange:", ability.CastRange)
    console.log("Ability.SkillshotRange:", ability.SkillshotRange)
    console.log("Ability.AbilityBehaviorMask:", ability.AbilityBehaviorMask)
    console.log("Ability.TargetTypeMask:", ability.TargetTypeMask)
    console.log("Ability.TargetFlagsMask:", ability.TargetFlagsMask)

    const radius = ability.SkillshotRange
    console.log("Using radius:", radius)

    const enemiesInRange = EntityManager.AllEntities.filter(ent =>
      ent instanceof Unit &&
      ent.IsAlive &&
      ent.IsEnemy(me) &&
      ent.Distance(me) <= radius
    )

    console.log("Found enemiesInRange:", enemiesInRange.map(e => e.Name))

    if (enemiesInRange.length === 0) {
      console.log("No valid targets within radius", radius)
      return
    }

    const target = me.Closest(enemiesInRange)
    console.log(
      "Selected target:",
      target.Name,
      "Distance:",
      me.Distance(target)
    )

    console.log(
      "Target.Position:",
      target.Position.x,
      target.Position.y,
      target.Position.z
    )

    const used = ability.UseAbility(
      target,
      /* checkAutoCast */ false,
      /* checkToggled */ false,
      /* queue */ false,
      /* showEffects */ true
    )

    if (used) {
      console.log("Meat Hook fired at", target.Name)
    } else {
      console.log(
        "Failed to use Meat Hook. CooldownDuration:",
        ability.CooldownDuration
      )
    }
  }
}

new CustomMenu()
