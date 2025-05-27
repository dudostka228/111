import { EventsSDK, Menu, Color } from "github.com/octarine-public/wrapper/index"

console.log("Hello World!")

EventsSDK.on("GameStarted", () => {
 console.log("GameStarted")
})

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

    this.sliderExample = this.tree.AddSlider("Интервал (мс)", 50, 10, 1000, 10)
    this.sliderExample.OnValue(s => {
      console.log("Слайдер значение:", s.value)
    })

    this.dropdownExample = this.tree.AddDropdown("Режим работы", ["Авто", "Ручной", "Отключено"], 0)
    this.dropdownExample.OnValue((index, value) => {
      console.log(`Выбран режим: ${value} (ID ${index})`)
    })

    this.colorPickerExample = this.tree.AddColorPicker("Цвет UI", Color.Red)
    this.colorPickerExample.OnValue(c => {
      console.log("Выбран цвет:", c)
    })

    this.buttonExample = this.tree.AddButton("Нажми меня")
    this.buttonExample.OnValue(() => {
      console.log("Кнопка была нажата!")
    })

    /*this.keybindExample = this.tree.AddKeybind("Клавиша активации", "K", false)
    this.keybindExample.OnValue(k => {
      console.log("Выбран биндинг клавиши:", k.assignedKeyStr, "(код:", k.assignedKey, ")")
    })*/
    this.keybindExample = this.tree.AddKeybind("Клавиша активации", "F", false)
    this.keybindExample.TriggerOnChat = false
    this.keybindExample.ActivatesInMenu = false

    this.keybindExample.OnPressed(k => {
        const keyStr = KeyNames[k.assignedKey] || "Unknown"
        console.log("Нажата клавиша:", keyStr)
      })
      
      this.keybindExample.OnRelease(k => {
        const keyStr = KeyNames[k.assignedKey] || "Unknown"
        console.log("Отжата клавиша:", keyStr)
      })
  }
}

new CustomMenu()
