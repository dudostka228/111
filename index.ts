import { EventsSDK, Menu, Ability, Unit, Entity, EntityManager, LocalPlayer } from "github.com/octarine-public/wrapper/index"
import * as fs from "fs"
import * as path from "path"

function logToFile(message: string) {
  const timestamp = new Date().toISOString()
  const line = `[${timestamp}] ${message}\n`
  try {
    fs.appendFileSync(LOG_PATH, line, { encoding: "utf8" })
  } catch (e) {
    console.error("Failed to write log:", e)
  }
}

console.log("Hello World!")

EventsSDK.on("GameStarted", () => {
 console.log("GameStarted")
})

const index = 0
const serial = 0
const ability = new Ability(index, serial, "pudge_meat_hook")

class CustomMenu {
  private tree: Menu.Node
  public toggleExample: Menu.Toggle
  public sliderExample: Menu.Slider
  public colorPickerExample: Menu.ColorPicker
  public dropdownExample: Menu.Dropdown
  public buttonExample: Menu.Button
  public keybindExample: Menu.KeyBind
  public keynamesExample: Menu.KeyNames

  constructor() {
    this.tree = Menu.AddEntry("MyCustomMenu")

    this.toggleExample = this.tree.AddToggle("Включить скрипт", true)
    this.toggleExample.OnValue(t => {
      console.log("Переключатель включен:", t.value)
    })
    
    this.keybindExample = this.tree.AddKeybind("Клавиша активации")
    this.keybindExample.OnPressed(() => this.pressedButton())
    
  }
  public pressedButton() {
    console.log("Bind is pressed")
    if (ability.IsReady) {
      console.log("Ability is Ready", ability.IsReady)
    } else {
      console.log("Error or Ability is not ready", ability.CooldownDuration)
    }

    const myLocalHero = LocalPlayer
    const units = EntityManager.AllEntities
    const closest = myLocalHero?.Closest(units)
    console.log("myLocalHero: ", myLocalHero, "units: ", units, "closest: ", closest)
    logToFile(`myLocalHero: ${myLocalHero.Name}, closest enemy: ${closestEnemy?.Name ?? "none"}`)
  }
}

new CustomMenu()
