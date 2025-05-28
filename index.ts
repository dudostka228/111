import { EventsSDK, Menu, Ability, Unit, Entity } from "github.com/octarine-public/wrapper/index"

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
    
    // this.sliderExample = this.tree.AddSlider("Интервал (мс)", 50, 10, 1000, 10)
    // this.sliderExample.OnValue(s => {
    //   console.log("Слайдер значение:", s.value)
    // })

    // this.dropdownExample = this.tree.AddDropdown("Режим работы", ["Авто", "Ручной", "Отключено"], 0)
    // this.dropdownExample.OnValue((index, value) => {
    //   console.log(`Выбран режим: ${value} (ID ${index})`)
    // })

    // this.colorPickerExample = this.tree.AddColorPicker("Цвет UI", Color.Red)
    // this.colorPickerExample.OnValue(c => {
    //   console.log("Выбран цвет:", c)
    // })

    // this.buttonExample = this.tree.AddButton("Нажми меня")
    // this.buttonExample.OnValue(() => {
    //   console.log("Кнопка была нажата!")
    // })

    this.keybindExample = this.tree.AddKeybind("Клавиша активации")
    this.keybindExample.OnPressed(() => this.pressedButton())
    
  }
  public pressedButton() {
    console.log("Bind is pressed")
    if (ability.isReady) {
      console.log("Ability is Ready", ability.IsReady)
      // ability.UseAbility()
    } else {
      console.log("Error or Ability is not ready", ability.CooldownDuration)
    }
    const owner = ability.Owner
    const allEntities = Entity.EntityManager.AllEntities
    const enemies = Entity.EntityManager.AllEntities.filter (ent =>
      ent.IsAlive && ent.IsEnemy(owner) && ability.CanHit(ent))

    const target = owner.Closest(enemies)
    if (target) {
      console.log(`Cast spell in ${target.Name}`)
      ability.UseAbility(target)
    } else {
      console.log("Target Error or zero targets")
    }
  }
}

new CustomMenu()
