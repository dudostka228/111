import {
  EventsSDK,
  Menu,
  EntityManager,
  Unit,
  pudge_meat_hook,
  Vector3,
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

    if (!this.toggleExample.value) {
      console.log("Script is Off")
      return
    }


    const hookOwner = EntityManager.GetEntitiesByClass(pudge_meat_hook)
    for (const hook of hookOwner) {
      const owner = hook.Owner
      if (!owner || !owner.IsControllable || !owner.IsAlive || !hook.CanBeCasted()) {
        continue
      }

    for (const hook of hookOwner) {
      const owner = hook.Owner
      if (!owner || !owner.IsControllable) {
        continue
      }
      if (!hook.CanBeCasted()) {
        console.warn("Meat Hook not ready. CooldownDuration:", hook.CooldownDuration)
        continue
      }

      const me = owner as Unit
      const range = hook.CastRange
      console.log("Hook range:", range)

      const enemies = EntityManager.AllEntities.filter(ent =>
        ent instanceof Unit &&
        ent.IsAlive &&
        ent.IsEnemy(me) &&
        me.Distance(ent) <= range
      )
      if (enemies.length === 0) {
        console.log("Нет врагов в радиусе", range)
        continue
      }

      enemies.sort((a, b) => me.Distance(a) - me.Distance(b))
      const target = enemies[0]
      console.log("Raw target:", target.Name)

      const speed = target.Speed
      const forward = target.Forward
      if (speed > target.MoveSpeed) {
        console.log("Цель под действием внешнего воздействия, пропускаем")
        continue
      }

      const travelTime = me.Distance(target) / hook.Speed
      const predictedPos = new Vector3(
        target.Position.x + forward.x * speed * travelTime,
        target.Position.y + forward.y * speed * travelTime,
        target.Position.z + forward.z * speed * travelTime
      )
      console.log(
        `PredictedPos: (${predictedPos.x.toFixed(1)}, ${predictedPos.y.toFixed(1)}, ${predictedPos.z.toFixed(1)})`
      )

      const steps = 10
      let blocked = false
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        const sample = new Vector3(
          me.Position.x + (predictedPos.x - me.Position.x) * t,
          me.Position.y + (predictedPos.y - me.Position.y) * t,
          me.Position.z + (predictedPos.z - me.Position.z) * t
        )
        const obstacle = EntityManager.AllEntities.find(ent =>
          ent instanceof Unit &&
          ent.IsAlive &&
          ent !== me &&
          ent !== target &&
          ent.Position.Distance(sample) < 50 
        )
        if (obstacle) {
          console.log("Траектория заблокирована:", obstacle.Name, "на шаге", i)
          blocked = true
          break
        }
      }
      if (blocked) {
        console.log("Пропускаем цель из-за препятствия на пути")
        continue
      }

      me.CastPosition(hook, predictedPos)
      console.log("Meat Hook cast to predicted position")
      return
    }
  }
}

new CustomMenu()
