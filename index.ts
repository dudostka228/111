import { EventsSDK, Menu, GameRules, DOTAGameUIState, GameState } from "github.com/octarine-public/wrapper/Imports"

console.log("Hello World!")

EventsSDK.on("GameStarted", () => {
 console.log("GameStarted")
})

class AutoCasterMenu {
    public readonly Enabled: Menu.Toggle
	public readonly UseCDR: Menu.Toggle
	public readonly Keybind: Menu.KeyBind

	private readonly node: Menu.Node
	private readonly useMode: Menu.Dropdown

	private readonly icon = "images/icons/alien.svg"

	constructor(menuRoot: Menu.Node) {
		this.node = menuRoot.AddNode("My AutoCaster", this.icon, "Text1")

		this.Enabled = this.node.AddToggle("Enable script", true)
		this.UseCDR = this.node.AddToggle("Use cooldown reset ability", true)
		this.Keybind = this.node.AddKeyBind("Toggle script", "F6")

		this.useMode = this.node.AddDropdown("Use mode", ["Always", "Only in menu", "Only in game"])

		this.node.SortNodes = false
	}

	public get ShouldRun(): boolean {
		if (!this.Enabled.value) return false
		const id = this.useMode.SelectedID
		if (id === 0) return true
		const isInMenu = GameRules === undefined || GameState.UIState !== DOTAGameUIState.DOTA_GAME_UI_DOTA_INGAME
		return (id === 1 && isInMenu) || (id === 2 && !isInMenu)
	}
}