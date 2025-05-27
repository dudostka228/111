import { EventsSDK, Menu, GameRules, DOTAGameUIState, GameState, Color } from "github.com/octarine-public/wrapper/index"

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
  public keybindExample: Menu.Keybind
  public textBoxExample: Menu.TextBox
  public noteExample: Menu.ShortDescripton

  constructor() {
    this.tree = Menu.AddEntry("MyCustomMenu")

    /*this.noteExample = new ShortDescripton(
        this.tree,
        "text",
        "hint",
        "github.com/octarine-public/wrapper/scripts_files/images/icons/alien.svg",
        6
    )
    this.tree.AddNote(this.noteExample)*/
    this.noteExample = this.tree.AddNote(
        this.tree,
        "text",
        "hint",
        "github.com/octarine-public/wrapper/scripts_files/images/icons/alien.svg",
        6
    )

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

    this.keybindExample = this.tree.AddKeybind("Клавиша активации", "K", false)
    this.keybindExample.OnValue(k => {
      console.log("Выбран биндинг клавиши:", k.assignedKeyStr, "(код:", k.assignedKey, ")")
    })
  }
}

new CustomMenu()
