import { EventsSDK, Menu, GameRules, DOTAGameUIState, GameState } from "github.com/octarine-public/wrapper/index"

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
    }
  }
  
  new CustomMenu()