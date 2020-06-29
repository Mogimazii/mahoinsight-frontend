const getters = {
  curRank: state => ({ from=false, to=false }) => {
    if (from && !to) {
      return state.rankFrom ? state.rankFrom : state.maxRank
    } else if (to && !from) {
      return state.rankTo ? state.rankTo : state.maxRank
    } else {
      return state.curRank ? state.curRank : state.maxRank
    }
  },

  curLevel: state => {
    return state.curLevel ? state.curLevel : state.maxLevel
  },

  getPrincessByName: (state) => (name) => {
    return state.chara[name]
  },

  getPrincessById: (state) => (id) => {
    for (const key of Object.keys(state.chara)) {
      if (state.chara[key].id === id) return state.chara[key]
    }
  },

  getPrincessNameById: (state) => (id) => {
    for (const key of Object.keys(state.chara)) {
      if (state.chara[key].id === id) return key
    }
  },

  getPrincessIdByName: (state) => (name) => {
    return state.chara[name].id
  },

  getPrincessIdList: (state) => {
    return Object.keys(state.chara).map(x => state.chara[x].id)
  },

  getPrincessByRarity: (state) => (rarity) => {
    return Object.values(state.chara).filter(chara => chara.status.rarity === rarity)
  },

  getPrincessPositionByName: (state) => (name) => {
    const saw = state.chara[name].status.search_area_width
    if (saw < state.widthThreshold[0]) return 1
    else if (saw >= state.widthThreshold[1]) return 3
    else return 2
  },

  getItemByName: (state) => (name) => {
    for (const key of Object.keys(state.item)) {
      if ((key.length === 5 && state.item[key].detail.item_name === name) || (key.length === 6 && state.item[key].detail.equipment_name === name)) {
        return state.item[key]
      }
    }
  },

  getItemById: (state) => (id) => {
    return state.item[id]
  },

  getItemIdByName: (state) => (name) => {
    for (const key of Object.keys(state.item)) {
      if ((key.length === 5 && state.item[key].detail.item_name === name) || (key.length === 6 && state.item[key].detail.equipment_name === name)) {
        return key
      }
    }
  },

  getItemNameById: (state) => (id) => {
    if (String(id).length === 6 && state.item[id]) {
      return state.item[id].detail.equipment_name
    } else if (String(id).length === 5 && state.item[id]) {
      return state.item[id].detail.item_name
    }
  },
  
  getItemStatsById: (state) => (id) => {
    let stats = {}
    const item = state.item[id]
    stats = {
      生命值: parseFloat(item.detail.hp),
      物理攻击力: parseFloat(item.detail.atk),
      魔法攻击力: parseFloat(item.detail.magic_str),
      物理防御力: parseFloat(item.detail.def),
      魔法防御力: parseFloat(item.detail.magic_def),
      物理暴击: parseFloat(item.detail.physical_critical),
      魔法暴击: parseFloat(item.detail.magic_critical),
      生命值自动回复: parseFloat(item.detail.wave_hp_recovery),
      技能值自动回复: parseFloat(item.detail.wave_energy_recovery),
      回避: parseFloat(item.detail.dodge),
      物理穿透: parseFloat(item.detail.physical_penetrate),
      魔法穿透: parseFloat(item.detail.magic_penetrate),
      生命值吸收: parseFloat(item.detail.life_steal),
      回复量上升: parseFloat(item.detail.hp_recovery_rate),
      技能值上升: parseFloat(item.detail.energy_recovery_rate),
      技能值消耗降低: parseFloat(item.detail.energy_reduce_rate),
      命中: parseFloat(item.detail.accuracy)
    }
    for (const key of Object.keys(stats)) {
      if (!stats[key]) {
        delete stats[key]
      }
    }
    return stats
  },

  getRankColor: (state) => (rank) => {
    return state.rankColor[rank]
  },

  getQuestIdByName: (state) => (name) => {
    const q = [], re = /^.*\((.*[A-Z])\)$/
    for (const diff of state.difficulties) {
      for (const questid of Object.keys(state.quest[diff])) {
        if (state.quest[diff][questid].quest_info.quest_name === name) q.push(questid)
      }
    }
    if (name.match(re) && name.match(re)[1] === "H") {
      return q[1]
    } else if (name.match(re) && name.match(re)[1] === "VH"){
      return q[2]
    } else {
      return q[0]
    }
  },

  getQuestNameById: (state) => (id) => {
    for (const diff of state.difficulties) {
      if (state.quest[diff][id] && state.quest[diff][id].id === id) {
        switch (String(id).substring(0, 2)) {
          case "12":
            return `${state.quest[diff][id].quest_info.quest_name} (H)`
          default:
            return state.quest[diff][id].quest_info.quest_name
        }
      }
    }
  },

  getQuestInfoById: (state) => (id) => {
    for (const diff of state.difficulties) {
      if (state.quest[diff][id] && state.quest[diff][id].id === id) return state.quest[diff][id].quest_info
    }
  },

  getQuestRewardById: (state) => (id) => {
    for (const diff of state.difficulties) {
      if (state.quest[diff][id] && state.quest[diff][id].id === id) return state.quest[diff][id].reward_info
    }
  },

  getQuestEnemyById: (state) => (id) => {
    for (const diff of state.difficulties) {
      if (state.quest[diff][id] && state.quest[diff][id].id === id) return state.quest[diff][id].enemy_info
    }
  },

  getQuestEnemyIdById: (state) => (id) => {
    const enemy_id = []
    for (const diff of state.difficulties) {
      if (state.quest[diff][id] && state.quest[diff][id].id === id) {
        for (const wave of Object.keys(state.quest[diff][id].enemy_info)) {
          for (const key of Object.keys(state.quest[diff][id].enemy_info[wave])) {
            enemy_id.push({
              [`${key}_in_${wave}`]: state.quest[diff][id].enemy_info[wave][key].enemy_id
            })        
          }
        }
      }
    }
    return enemy_id
  },

  getQuestEnemyInfoByEnemyId: (state) => (id) => {
    for (const diff of state.difficulties) {
      for (const quest of Object.values(state.quest[diff])) {
        for (const wave of Object.values(quest.enemy_info)) {
          for (const enemy of Object.values(wave)) {
            if (enemy.enemy_id === id) return enemy
          }
        }
      }
    }
  },

  getQuestEnemyResistanceByEnemyId: (state) => (id) => {
    for (const diff of state.difficulties) {
      for (const quest of Object.values(state.quest[diff])) {
        for (const wave of Object.values(quest.enemy_info)) {
          for (const enemy of Object.values(wave)) {
            if (enemy.enemy_id === id) return {
              减速: enemy.resist_status[0],
              加速: enemy.resist_status[1],
              麻痹: enemy.resist_status[2],
              冻结: enemy.resist_status[3],
              束缚: enemy.resist_status[4],
              睡眠: enemy.resist_status[5],
              眩晕: enemy.resist_status[6],
              石化: enemy.resist_status[7],
              拘留α: enemy.resist_status[8], //拘留
              拘留β: enemy.resist_status[9], //拘留(造成伤害)
              毒: enemy.resist_status[10],
              烧伤: enemy.resist_status[11],
              诅咒: enemy.resist_status[12],
              魅惑: enemy.resist_status[13],
              黑暗: enemy.resist_status[14],
              沉默: enemy.resist_status[15],
              即死: enemy.resist_status[16],
              击退: enemy.resist_status[17],
              混乱: enemy.resist_status[18],
              猛毒: enemy.resist_status[19]
            }
          }
        }
      }
    }
  },

  getQuestEnemyUnitIdByEnemyId: (state) => (id) => {
    for (const diff of state.difficulties) {
      for (const quest of Object.values(state.quest[diff])) {
        for (const wave of Object.values(quest.enemy_info)) {
          for (const enemy of Object.values(wave)) {
            if (enemy.enemy_id === id) return enemy.unit_id
          }
        }
      }
    }
  },

  getQuestEnemyNameByEnemyId: (state) => (id) => {
    for (const diff of state.difficulties) {
      for (const quest of Object.values(state.quest[diff])) {
        for (const wave of Object.values(quest.enemy_info)) {
          for (const enemy of Object.values(wave)) {
            if (enemy.enemy_id === id) return enemy.name
          }
        }
      }
    }
  },

  getQuestArea: (state) => {
    const obj = {
      normal: [],
      hard: [],
      other: []
    }
    for (const area of state.quest.area) {
      switch (String(area.area_id).substring(0, 2)) {
        case "11":
          obj.normal.push({
            area_id: area.area_id,
            area_name: area.area_name
          })
          break
        case "12":
          obj.hard.push({
            area_id: area.area_id,
            area_name: `${area.area_name} (H)`
          })
          break
        default:
          obj.other.push({
            area_id: area.area_id,
            area_name: area.area_name
          })
      }
    }
    return obj
  },

  getQuestListByArea: (state) => (areaid) => {
    const arr = []
    for (const diff of state.difficulties) {
      for (const quest of Object.values(state.quest[diff])) {
        if (quest.quest_info.area_id === areaid) {
          arr.push(quest.id)
        }
      }
    }
    return arr
  },

  getClanBattleScheduleById: (state) => (id) => {
    return state.clanbattle[Number(id)].period.schedule
  },

  getClanBattleRewardById: (state) => (id) => {
    let reward = []
    for (let i = 1; i <= 3; i++) {
      if (state.clanbattle[Number(id)].period.reward[0]) {
        reward.push(state.clanbattle[Number(id)].period.reward[0][`reward_id_${i}`])
      } else {
        switch (Number(id)) {
          case 1004:
            reward = [91002, 90006, 31018]
            break
          case 1005:
            reward = [91002, 90006, 31025]
            break
          case 1006:
            reward = [91002, 90006, 31043]
            break
          case 1007:
            reward = [91002, 90006, 31022]
            break
          case 1008:
            reward = [91002, 90006, 31042]
            break
          case 1009:
            reward = [91002, 90006, 31018]
            break
          case 1010:
            reward = [91002, 90006, 31025]
            break
          case 1011:
            reward = [91002, 90006, 31043]
            break
          case 1012:
            reward = [91002, 90006, 31022]
            break
          case 1013:
            reward = [91002, 90006, 31042]
            break
          default:
            break
        }
      }
    }
    return reward
  },

  getClanBattleMapById: (state) => (id) => {
    return state.clanbattle[Number(id)].mapdata
  },

  getClanBattleBossGroup: (state) => (id, phase) => {
    return state.clanbattle[Number(id)].mapdata[Number(phase)].clan_battle_boss_group
  },

  getLootSimulation: (state) => ({ questid, times = 1, multiplier = 1 }) => {
    let rewards, stamina
    const loots = {}
    const lootDivider = (reward) => {
      const arr = [0]
      let odds = 0
      for (let i = 1; i <= 5; i++) {
        odds += reward[`odds_${i}`]
        arr.push(odds)
      }
      return arr
    }
    for (const diff of state.difficulties) {
      if (state.quest[diff][questid] && state.quest[diff][questid].id === questid) {
        rewards = state.quest[diff][questid].reward_info
        stamina = state.quest[diff][questid].quest_info.stamina
      } 
    }
    for (let t = 0; t < times; t++) {
      rewards.forEach(reward => {
        const divider = lootDivider(reward)
        const rand = Math.random() * divider[divider.length - 1]
        for (let i = 0; i < divider.length - 1; i++) {
          if (rand >= divider[i] && rand < divider[i + 1]) {
            if (reward[`reward_id_${i + 1}`] && reward[`reward_num_${i + 1}`]) {
              if (Object.prototype.hasOwnProperty.call(loots, reward[`reward_id_${i + 1}`])) {
                loots[reward[`reward_id_${i + 1}`]] += reward[`reward_num_${i + 1}`] * multiplier
              } else {
                loots[reward[`reward_id_${i + 1}`]] = reward[`reward_num_${i + 1}`] * multiplier
              }
            }
            break
          }
        }
      }) 
    }
    
    return {
      loots,
      stamina,
      times
    }
  }
}

export default getters
