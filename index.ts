import { EventsSDK, Menu, GameRules, DOTAGameUIState, GameState } from "github.com/octarine-public/wrapper/index"
import { MenuManager } from "wrapper/Menu"
import { Node } from "wrapper/Menu/Node"
import { Slider } from "wrapper/Menu/Slider"
import { KeyBind } from "wrapper/Menu/KeyBind"
import { ColorPicker } from "wrapper/Menu/ColorPicker"
import { Dropdown } from "wrapper/Menu/Dropdown"

console.log("Hello World!")

EventsSDK.on("GameStarted", () => {
 console.log("GameStarted")
})

let initialized = false
let menuTab: Node | undefined

function InitMenu() {
	if (initialized) return
	initialized = true

	// Создаём вкладку меню
	menuTab = MenuManager.AddEntry("OctarineScript", "menu/icons/custom.svg", "Settings")
	menuTab.IsOpen = true

	// Чекбокс
	menuTab.AddToggle("On/Off", "on off", true, (val) => {
		console.log("Enabled: ", val)
	})

	// Слайдер
	menuTab.AddSlider("Interval", 50, 1000, 200, 10, (value) => {
		console.log("Interval is:", value)
	})

	// Бинд клавиши
	menuTab.AddKeyBind("button", 0x2E /* Delete */, true, (keyCode) => {
		console.log("button is:", keyCode)
	})

	// Выпадающий список
	menuTab.AddDropdown(
		"dropdown",
		["auto", "manual", "off"],
		0,
		(index, value) => {
			console.log(`dropdown is: ${value} (ID ${index})`)
		}
	)

	// Выбор цвета
	menuTab.AddColorPicker("color UI", [255, 0, 0, 255], (rgba) => {
		console.log("color is:", rgba)
	})
}

// Точка входа
function main() {
	InitMenu()

	// Здесь можно разместить логику скрипта
	console.log("initialized")
}

main()