import { EventsSDK, Menu, Ability, EntityManager, LocalPlayer, Vector3 } from "github.com/octarine-public/wrapper/index"

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
      console.log("Localplayer is not defined")
      return
    }
    
    const radius = ability.CastRange
    console.log("CastRange:", radius)

    const enemiesInRange = EntityManager.AllEntities.filter (ent =>
      ent.IsUnit && ent.IsAlive && ent.IsEnemy(me) && ent.Distance(me) <= radius)
    
    if (enemiesInRange.lenght === 0) {
      console.log("Zero targets", radius)
      return
    }
    const target = me.Closest(enemiesInRange)
    console.log("TargetName: ", target.Name, "Distance: ", me.Distance(target))
    
    const used = ability.UseAbility(target, /*checkAutoCast*/ false, /*checkToggled*/ false, /*queue*/ false, /*showEffects*/ true)
    if (used) {
      console.log("Ability is used to: ", target.Name)
    } else {
      console.log("Error, Ability is not used: ", ability.CooldownDuration)
    }
  }
}

new CustomMenu()
