import {
  EventsSDK,
  Menu,
  EntityManager,
  LocalPlayer,
  Unit,
  Player,
  Vector3,
  pudge_meat_hook,
  juggernaut_blade_fury,
  shadow_demon_disseminate,
  spectre_dispersion,
} from "github.com/octarine-public/wrapper/index"
import {
  dazzle_bad_juju_lua,
  ursa_enrage_lua
} from "github.com/octarine-public/wrapper/Objects/Abilities/"

EventsSDK.on("GameStarted", () => {
  console.log("GameStarted")
})

class CustomMenu {
  private tree: Menu.Node
  public toggleEnabled: Menu.Toggle
  public keybindHook: Menu.KeyBind
  public keybindCast: Menu.KeyBind

  constructor() {
    this.tree = Menu.AddEntry("dudostka228")

    this.toggleEnabled = this.tree.AddToggle("Включить скрипт", true)
    this.toggleEnabled.OnValue(t => {
      console.log("Скрипт включён:", t.value)
    })

    this.keybindHook = this.tree.AddKeybind("Клавиша хука")
    this.keybindHook.OnPressed(() => this.onHookPressed())

    this.keybindCast = this.tree.AddKeybind("Cast Abilities")
    this.keybindCast.OnPressed(() => this.onCastAbilities())

    EventsSDK.on("Tick", () => this.onTickAbilities())
  }

  private onHookPressed() {
    console.log("Bind is pressed")
    if (!this.toggleEnabled.value) {
      console.log("Скрипт отключён, ничего не делаем")
      return
    }

    const hooks = EntityManager.GetEntitiesByClass(pudge_meat_hook)
    for (const hook of hooks) {
      const owner = hook.Owner
      if (!owner || !owner.IsControllable || !owner.IsAlive || !hook.CanBeCasted()) {
        continue
      }
      const me = owner as Unit
      const range = hook.CastRange

      const enemies = EntityManager.AllEntities.filter(ent =>
        ent instanceof Unit &&
        ent.IsAlive &&
        ent.IsEnemy(me) &&
        me.Distance(ent) <= range
      )
      if (enemies.length === 0) continue

      const target = me.Closest(enemies)

      const speed = target.Speed
      const forward = target.Forward
      if (speed > target.MoveSpeed) continue

      const travelTime = me.Distance(target) / hook.Speed
      const predictedPos = new Vector3(
        target.Position.x + forward.x * speed * travelTime,
        target.Position.y + forward.y * speed * travelTime,
        target.Position.z + forward.z * speed * travelTime
      )

      let blocked = false
      const steps = 10
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
          console.log("Траектория заблокирована:", obstacle.Name)
          blocked = true
          break
        }
      }
      if (blocked) continue

      me.CastPosition(hook, predictedPos)
      console.log("Meat Hook cast to", target.Name)
      return
    }
  }

  private getAbilitiesFromEntity<T>(cls: new () => T): T[] {
    return EntityManager.GetEntitiesByClass(cls as any) as T[]
  }

  private onCastAbilities() {
    if (!this.toggleEnabled.value) return
    const raw = LocalPlayer
    if (!(raw instanceof Player)) return
    const me = raw as Player

    // Собираем все способности по классам
    let abilities = [
      ...this.getAbilitiesFromEntity(ursa_enrage_lua),
      ...this.getAbilitiesFromEntity(juggernaut_blade_fury),
      ...this.getAbilitiesFromEntity(shadow_demon_disseminate)
    ] as (ursa_enrage_lua | juggernaut_blade_fury | shadow_demon_disseminate)[]

    if (me.HasShard) {
      abilities.push(...this.getAbilitiesFromEntity(spectre_dispersion) as spectre_dispersion[])
    }

    // Фильтруем способности, принадлежащие локальному герою и готовые к касту
    abilities = abilities.filter(abil => {
      const owner = (abil as any).Owner as Unit | undefined
      return owner === me && abil.IsReady && abil.CanBeCasted()
    })

    // Кастуем каждую
    for (const abil of abilities) {
      abil.UseAbility(me, false, false, false, true)
      console.log(`Cast ${abil.Name}`)
    }

    // Последним бьем Bad Juju
    const badList = this.getAbilitiesFromEntity(dazzle_bad_juju_lua) as dazzle_bad_juju_lua[]
    badList.forEach(badJuju => {
      if ((badJuju as any).Owner === me && badJuju.IsReady && badJuju.CanBeCasted()) {
        badJuju.UseAbility(me, false, false, false, true)
        console.log(`Cast ${badJuju.Name}`)
      }
    })
  }

  private onTickAbilities() {
    if (!this.toggleEnabled.value) return
    const raw = LocalPlayer
    if (!(raw instanceof Player)) return
    const me = raw as Player

    // Повторяем логику onCastAbilities для тик-ротации
    this.onCastAbilities()
  }
}

new CustomMenu()
